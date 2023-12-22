package appjava.controller;

import java.util.List;

import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.ResponseEntity;

import appjava.entity.User;
import appjava.service.UserService;
import appjava.service.JwtService;


@RestController
@RequestMapping("/auth/users/")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    private final JwtService jwtService;


    @GetMapping
    public ResponseEntity find(@RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);
        
        if (jwtService.findByAccessToken(token) == null) return ResponseEntity.badRequest().body("Invalid token");
        try { jwtService.TokenVerified(token, "ROLE_USER"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        return ResponseEntity.ok(userService.findByLogin(jwtService.getClaim(token, "subject")));
    }


    @PutMapping
    public ResponseEntity update(@RequestHeader("Authorization") String tokenHeader, @RequestBody User user) {

        String token = tokenHeader.substring(7);

        if (jwtService.findByAccessToken(token) == null) return ResponseEntity.badRequest().body("Invalid token");
        try { jwtService.TokenVerified(token, "ROLE_USER"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        User existUser = userService.findByLogin(jwtService.getClaim(token, "subject"));

        existUser.setLogin(user.getLogin());
        existUser.setPassword(user.getPassword());
        existUser.setEmail(user.getEmail());
        existUser.setPhone(user.getPhone());
        
        return ResponseEntity.ok(userService.save(existUser));
    }



    @DeleteMapping("/deleteSelf/")
    public ResponseEntity delete(@RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);

        System.out.println(jwtService.findByAccessToken(token));
        if (jwtService.findByAccessToken(token) == null) return ResponseEntity.badRequest().body("Invalid token");
        try { jwtService.TokenVerified(token, "ROLE_USER, ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        User existUser = userService.findByLogin(jwtService.getClaim(token, "subject"));

        if (existUser == null) 
            return ResponseEntity.badRequest().body("Not found");

        userService.deleteById(existUser.getId());
        return ResponseEntity.ok("Deleted successfully");
    }



    @GetMapping("/all/")
    public ResponseEntity findAll(@RequestHeader("Authorization") String tokenHeader) {

        String token = tokenHeader.substring(7);

        System.out.println(jwtService.findByAccessToken(token));
        if (jwtService.findByAccessToken(token) == null) return ResponseEntity.badRequest().body("Invalid token");
        try { jwtService.TokenVerified(token, "ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        return ResponseEntity.ok(userService.findAll());
    }



    @PostMapping
    public ResponseEntity save(@RequestHeader("Authorization") String tokenHeader, @RequestBody User user) {

        String token = tokenHeader.substring(7);
        
        if (jwtService.findByAccessToken(token) == null) return ResponseEntity.badRequest().body("Invalid token");
        try { jwtService.TokenVerified(token, "ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        return ResponseEntity.ok(userService.save(user));
    }


    @PutMapping("/{id}/")
    public ResponseEntity updateId(@RequestHeader("Authorization") String tokenHeader, @PathVariable Long id, @RequestBody User user) {

        String token = tokenHeader.substring(7);

        if (jwtService.findByAccessToken(token) == null) return ResponseEntity.badRequest().body("Invalid token");
        try { jwtService.TokenVerified(token, "ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        User existUser = userService.findById(id); 

        existUser.setLogin(user.getLogin());
        existUser.setPassword(user.getPassword());
        existUser.setEmail(user.getEmail());
        existUser.setPhone(user.getPhone());
        
        return ResponseEntity.ok(userService.save(existUser));
    }


    @DeleteMapping("/{id}/")
    public ResponseEntity deleteId(@RequestHeader("Authorization") String tokenHeader, @PathVariable Long id) {

        String token = tokenHeader.substring(7);

        if (jwtService.findByAccessToken(token) == null) return ResponseEntity.badRequest().body("Invalid token");
        try { jwtService.TokenVerified(token, "ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        if (userService.findById(id).getId() == null)
            return ResponseEntity.badRequest().body("Not found");

        userService.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
