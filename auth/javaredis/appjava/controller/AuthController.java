package appjava.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import lombok.AllArgsConstructor;

import appjava.config.Response;
import appjava.entity.User;
import appjava.entity.Jwt;
import appjava.service.JwtService;
import appjava.service.UserService;



@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

    private final JwtService jwtService;
    private final UserService userService;


    @PostMapping("/reg/")
    public Response registryNewUser(@RequestBody User user) {

        String role = "ROLE_USER";

        user.setRole(role);
        userService.save(user);

        String token = jwtService.createTokens(user.getLogin(), role, user.getId());

        return new Response(token, role);
    }



    @PostMapping("/login/")
    public Response loginUser(@RequestBody User user) {

        User db_user = userService.findByLogin(user.getLogin());

        if (db_user == null) {
            // user not found exception
            return new Response("user not found", null);
        }
        if (!db_user.getPassword().equals(user.getPassword())) {
            // wrong password exception
            return new Response("wrong password", null);
        }

        String role = db_user.getRole();
        jwtService.deleteJwt(user.getLogin());
        String token = jwtService.createTokens(user.getLogin(), role, db_user.getId());

        return new Response(token, role);
    }



    @GetMapping("/token/")
    public Response verify(@RequestHeader("Authorization") String tokenHeader) {

        Jwt jwt = jwtService.findByAccessToken(tokenHeader.substring(7));

        if (jwt == null) {
            // token not found exception
            return new Response(null, null);
        }

        User user = userService.findByLogin(jwt.getOwnerLogin());

        if (jwtService.TokenExpired(jwt.getAccessToken())) {
            if (jwtService.TokenExpired(jwt.getRefreshToken())) {
                // tokens expired exception
                return new Response(null, user.getRole());
            }

            String updatedToken = jwtService.createTokens(jwt.getOwnerLogin(), user.getRole(), user.getId());
            jwt.setAccessToken(updatedToken);

            jwtService.save(jwt);

            return new Response(jwt.getAccessToken(), user.getRole());
        }

        return new Response(jwt.getAccessToken(), user.getRole());
    }


    @GetMapping("/logout/")
    public ResponseEntity logout(@RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);

        try { jwtService.TokenVerified(token, "ROLE_USER, ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        jwtService.deleteJwt(jwtService.getClaim(token, "subject"));
        return ResponseEntity.ok("Logout successfully");
        
    }


}
