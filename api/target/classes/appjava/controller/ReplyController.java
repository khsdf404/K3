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

import appjava.entity.Reply;
import appjava.entity.Poll;
import appjava.repository.ReplyRepository;
import appjava.repository.PollRepository;
import appjava.service.JwtService;


@RestController
@RequestMapping("/api/reply/")
public class ReplyController {

    @Autowired
    private ReplyRepository repository;

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private JwtService jwtService;

    private String role = "ROLE_USER";



    @GetMapping("/{link}/")
    public ResponseEntity getByLink(@PathVariable String link) {

        if ( repository.findByLink(link) == null) 
            return ResponseEntity.badRequest().body("Not found");

        Reply reply = new Reply();
        reply.setAnswers(repository.findByLink(link).getAnswers());
        reply.setPollLink(repository.findByLink(link).getPollLink());

        return ResponseEntity.ok(reply);
    }


    @GetMapping("/byParent/{link}/")
    public ResponseEntity getByParentLink(@RequestHeader("Authorization") String bearer, @PathVariable String link) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        Poll poll = pollRepository.findByLink(link);

        if ( poll == null)
            return ResponseEntity.badRequest().body("Not found poll");

        if ( !poll.getOwnerLogin().equals(jwtService.getSubject(bearer)) )
            return ResponseEntity.badRequest().body("У Вас нет прав!");
        
        return ResponseEntity.ok(repository.findByPollLink(link));
    }


    @GetMapping("/bytoken/")
    public ResponseEntity getByToken(@RequestHeader("Authorization") String bearer) {

        try { jwtService.TokenVerified(bearer, this.role); }
        catch (Exception e) { return ResponseEntity.badRequest().body(e.getMessage()); }

        // List<Reply>
        List<Reply> reply = repository.findByOwnerLogin(jwtService.getSubject(bearer));

        return ResponseEntity.ok(reply);
    }


    @PostMapping
    public ResponseEntity post(@RequestBody Reply obj) {

        if (obj.getPollLink() == null || pollRepository.findByLink(obj.getPollLink()) == null)
            return ResponseEntity.badRequest().body("Неправильная ссылка!");

        Poll poll = pollRepository.findByLink(obj.getPollLink());

        obj.setOwnerLogin(poll.getOwnerLogin());
        obj.setLink(obj.generateLink());
        obj.setCreationTime(obj.generateCreationTime());

        poll.setReplyAmount(poll.getReplyAmount() + 1);

        return ResponseEntity.ok(repository.save(obj));
    }

    
}
