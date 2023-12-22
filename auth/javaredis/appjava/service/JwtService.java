package appjava.service;

import java.util.List;

import lombok.AllArgsConstructor;

import appjava.entity.Jwt;
import appjava.repository.JwtRepository;

import appjava.exceptions.FakeTokenException;
import appjava.exceptions.TokenExpiredException;
import appjava.exceptions.NoRightsException;


@AllArgsConstructor
public class JwtService {

    private final JwtBuilder jwtBuilder;
    private final JwtRepository repository;

    private static final Jwt EMPTY = new Jwt();



    public String test() {
        return this.jwtBuilder.test();
    }



    public Iterable<Jwt> findAll() {
        return repository.findAll();
    }


    
    public Jwt findByAccessToken(String token) {
        return repository.findByAccessToken(token);
    }



    public Jwt save(Jwt jwt) {
        return repository.save(jwt);
    }



    public String createTokens(String subject, String role, Long uid) {
        Jwt jwt = this.jwtBuilder.createJWT(subject, role, uid);
        repository.save(jwt);

        return jwt.getAccessToken();
    }

    public void deleteJwt(String ownerLogin) {
        Jwt jwt = repository.findByOwnerLogin(ownerLogin);
        if (jwt != null)
            repository.delete(jwt);
    }

    public Boolean TokenExpired(String token) {
        return this.jwtBuilder.TokenExpired(token);
    }

    public Boolean TokenVerified(String token, String role) throws FakeTokenException, TokenExpiredException, NoRightsException {
        return this.jwtBuilder.TokenVerified(token, role);
    }

    public String getClaim(String token, String subject) {
        return this.jwtBuilder.getClaim(token, subject);
    }

}
