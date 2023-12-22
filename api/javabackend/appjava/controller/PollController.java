package appjava.controller;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
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

import appjava.entity.Poll;
import appjava.repository.PollRepository;
import appjava.service.JwtService;


@RestController
@RequestMapping("/api/polls/")
public class PollController {

    @Autowired
    private PollRepository repository;

    @Autowired
    private JwtService jwtService;

    private String role = "ROLE_USER, ROLE_ADMIN";


    @GetMapping("/name/{link}/")
    public ResponseEntity getByLink(@RequestHeader("Authorization") String bearer, @PathVariable String link) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        try { repository.findByLink(link); } 
        catch (Exception e) { return ResponseEntity.badRequest().body("Not found"); }

        return ResponseEntity.ok(repository.findByLink(link).getName());
    }
    @GetMapping("/questions/{link}/")
    public ResponseEntity getByLink(@RequestHeader("Authorization") String bearer, @PathVariable String link) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        try { repository.findByLink(link); } 
        catch (Exception e) { return ResponseEntity.badRequest().body("Not found"); }

        return ResponseEntity.ok(repository.findByLink(link).getQuestions());
    }
    @GetMapping("{link}/")
    public ResponseEntity getByLink(@RequestHeader("Authorization") String bearer, @PathVariable String link) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        try { repository.findByLink(link); } 
        catch (Exception e) { return ResponseEntity.badRequest().body("Not found"); }

        if ( repository.findByLink(link).getOwnerLogin() != jwtService.getSubject(bearer); )
            return ResponseEntity.badRequest().body("You have no right for this.");

        return ResponseEntity.ok(repository.findByLink(link));
    }


    @GetMapping("bytoken/")
    public ResponseEntity getByToken(@RequestHeader("Authorization") String bearer) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        // List<Poll>
        List<Poll> polls = repository.findByOwnerLogin(jwtService.getSubject(bearer));

        return ResponseEntity.ok(polls);
    }



    @GetMapping
    public ResponseEntity getAll(@RequestHeader("Authorization") String bearer) {

        try { jwtService.TokenVerified(bearer, "ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        return ResponseEntity.ok(repository.findAll());
    }

   


    @PostMapping
    public ResponseEntity post(@RequestHeader("Authorization") String bearer, @RequestBody Poll obj) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        obj.setOwnerLogin(jwtService.getSubject(bearer));
        obj.setLink(obj.generateLink());
        obj.setCreationTime(obj.generateCreationTime());

        return ResponseEntity.ok(repository.save(obj));
    }


    
    @PutMapping("/{id}/")
    public ResponseEntity update(@RequestHeader("Authorization") String bearer, 
    @PathVariable Long id, @RequestBody Poll obj) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }
        

        Poll existingObj = repository.findById(id).get(); 

        if (obj.getName() != null)
            existingObj.setName(obj.getName());
        if (obj.getBody() != null)
            existingObj.setBody(obj.getBody());
        if (obj.getStatus() != null)
            existingObj.setStatus(obj.getStatus());
        if (obj.getExpirationTime() != null)
            existingObj.setExpirationTime(obj.getExpirationTime());

        existingObj.setLink(existingObj.generateLink());
        existingObj.setCreationTime(existingObj.generateCreationTime());
        
        return ResponseEntity.ok(repository.save(existingObj));
    }

    @PutMapping("/admin/{id}/")
    public ResponseEntity updateAdmin(@RequestHeader("Authorization") String bearer, 
    @PathVariable Long id, @RequestBody Poll obj) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        Poll existingObj = repository.findById(id).get(); 

        if (obj.getName() != null)
            existingObj.setName(obj.getName());
        if (obj.getBody() != null)
            existingObj.setBody(obj.getBody());
        if (obj.getStatus() != null)
            existingObj.setStatus(obj.getStatus());
        if (obj.getExpirationTime() != null)
            existingObj.setExpirationTime(obj.getExpirationTime());

        existingObj.setLink(existingObj.generateLink());
        existingObj.setCreationTime(existingObj.generateCreationTime());
        
        return ResponseEntity.ok(repository.save(existingObj));
    }


    @DeleteMapping("/{id}/")
    public ResponseEntity delete(@RequestHeader("Authorization") String bearer, @PathVariable Long id) {

        try { jwtService.TokenVerified(bearer, "ROLE_USER"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        try { repository.findById(id).get(); } 
        catch (Exception e) { return ResponseEntity.badRequest().body("Not found"); }

        Poll poll = repository.findById(id).get();

        if (poll.getOwnerLogin() != jwtService.getSubject(bearer))
            return ResponseEntity.badRequest().body("You don't have permission for that");


        repository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }

    @DeleteMapping("/admin/{id}/")
    public ResponseEntity deleteAdmin(@RequestHeader("Authorization") String bearer, @PathVariable Long id) {

        try { jwtService.TokenVerified(bearer, "ROLE_ADMIN"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        try { repository.findById(id).get(); } 
        catch (Exception e) { return ResponseEntity.badRequest().body("Not found"); }

        repository.deleteById(id);
        return ResponseEntity.ok("Deleted successfully");
    }
    
}
