package appjava.service;

import java.util.Date;
import java.time.temporal.ChronoUnit;
import java.time.Instant;

import java.util.HashMap;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.lang.reflect.Type;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.NoSuchAlgorithmException;
import java.security.InvalidKeyException;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import appjava.exceptions.FakeTokenException;
import appjava.exceptions.TokenExpiredException;
import appjava.exceptions.NoRightsException;



@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.sessionTime}")
    private Long sessionTime;


    public Boolean TokenVerified(String bearer, String role)
        throws FakeTokenException, TokenExpiredException, NoRightsException {

            String token = bearer.substring(7);


            if (!TokenSignedCorrectly(token)) throw new FakeTokenException();
            if (TokenExpired(token)) throw new TokenExpiredException();
            if (!TokenHasRights(token, role)) throw new NoRightsException();

            return true;
    }

    
    private Boolean TokenSignedCorrectly(String token) {
        Boolean verified = false;
        try {
            String[] tokenArray = token.split("\\.");
            String header = tokenArray[0];
            String payload = tokenArray[1];
            String sign = tokenArray[2];

            verified = getEncodedSign(header, payload).equals(sign);
        } catch (Exception e) {

        }

        return verified;
    }
    private Boolean TokenExpired(String token) {

        // 2023-11-08T18:07:48.764Z
        String expTime = getClaim(token, "expiration");
        Instant reqInstant = Instant.parse(expTime);


        Date expDate = Date.from(reqInstant);
        Date nowDate = Date.from(Instant.now());


        return nowDate.after(expDate);
    }
    private Boolean TokenHasRights(String token, String role) {
        System.out.println(role);
        System.out.println(getClaim(token, "role"));
        if (!role.contains(getClaim(token, "role"))) return false;
        return true;
    }

    public String getClaim(String token, String claim) {
        return getPayload(token.split("\\.")[1]).get(claim);
    }
    public String getSubject(String bearer) {
        return this.getClaim(bearer.substring(7), "subject");
    }


    private String getEncodedSign(String header, String payload) {
        Mac sha256_HMAC = null;
        try {
            sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(SECRET_KEY.getBytes(), "HmacSHA256");
            sha256_HMAC.init(secret_key);
        }
        catch(NoSuchAlgorithmException e) {
            System.out.println("Something is wrong");
        }
        catch (InvalidKeyException e){
            System.out.println("Something is wrong");
        }


        return Base64.getUrlEncoder().encodeToString(sha256_HMAC.doFinal((header + "." + payload).getBytes()));
    }



    private Map<String, String> getPayload(String encodedPayload) {

        byte[] decodedBytes = Base64.getDecoder().decode(encodedPayload);
        String decoded = new String(decodedBytes, StandardCharsets.UTF_8);


        Type type = new TypeToken<Map<String, String>>(){}.getType();
        Gson gson = new Gson();

        return gson.fromJson(decoded, type);

    }

}