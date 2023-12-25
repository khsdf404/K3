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


    @GetMapping("/public/{link}/")
    public ResponseEntity getPublic(@PathVariable String link) {

        if ( repository.findByLink(link) == null )
            return ResponseEntity.badRequest().body("Not found");

        Poll pollByLink = repository.findByLink(link);
        Poll publicPoll = new Poll();
        
        publicPoll.setQuestions(pollByLink.getQuestions());
        publicPoll.setName(pollByLink.getName());
        publicPoll.setExpirationTime(pollByLink.getExpirationTime());


        return ResponseEntity.ok(publicPoll);
    }
    @GetMapping("/private/{link}/")
    public ResponseEntity getPrivate(@RequestHeader("Authorization") String bearer, @PathVariable String link) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        if ( repository.findByLink(link) == null )
            return ResponseEntity.badRequest().body("Not found");

        if ( !repository.findByLink(link).getOwnerLogin().equals(jwtService.getSubject(bearer)) )
            return ResponseEntity.badRequest().body("You have no right for this.");

        return ResponseEntity.ok(repository.findByLink(link));
    }


    @GetMapping("/all/")
    public ResponseEntity getByToken(@RequestHeader("Authorization") String bearer) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        // List<Poll>
        List<Poll> polls = repository.findByOwnerLogin(jwtService.getSubject(bearer));

        return ResponseEntity.ok(polls);
    }

   


    @PostMapping
    public ResponseEntity post(@RequestHeader("Authorization") String bearer, @RequestBody Poll obj) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        System.out.println(obj);

        obj.setOwnerLogin(jwtService.getSubject(bearer));
        obj.setLink(obj.generateLink());
        obj.setStatus(true);
        obj.setReplyAmount(0L);
        obj.setCreationTime(obj.generateCreationTime());

        return ResponseEntity.ok(repository.save(obj));
    }


    @DeleteMapping("/{link}/")
    public ResponseEntity delete(@RequestHeader("Authorization") String bearer, @PathVariable String link) {

        try { jwtService.TokenVerified(bearer, "ROLE_USER"); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        if ( repository.findByLink(link) == null )
            return ResponseEntity.badRequest().body("Not found");

        Poll poll = repository.findByLink(link);

        if ( !poll.getOwnerLogin().equals(jwtService.getSubject(bearer)) )
            return ResponseEntity.badRequest().body("You don't have permission for that");


        repository.deleteById(poll.getId());
        return ResponseEntity.ok("Deleted successfully");
    }
    
}
