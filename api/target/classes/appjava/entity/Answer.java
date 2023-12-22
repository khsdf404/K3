package appjava.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.time.temporal.ChronoUnit;
import java.time.Instant;
import java.math.BigInteger;


@Entity
@Table(name = "answers")
public class Answer {
  
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ownerLogin;

    private String body;
    private Date creationTime;

    @Column(unique=true)
    private String link;
    private String pollLink;


    public void setId(Long id) { this.id = id; }
    public Long getId() { return this.id; }

    public String getOwnerLogin() { return this.ownerLogin; }
    public void setOwnerLogin(String login) { this.ownerLogin = login; }


    public void setBody(String body) { this.body = body; }
    public String getBody() { return this.body; }

    public void setLink(String link) { this.link = link; }
    public String getLink() { return this.link; }
    public String generateLink() {
        String link = "";

        link += this.ownerLogin;
        link += this.pollLink;

        link += Date.from(Instant.now()).toInstant().toString();

        return String.format("%040x", new BigInteger(1, link.getBytes()));
    }

    public void setPollLink(String link) { this.pollLink = link; }
    public String getPollLink() { return this.pollLink; }

    public void setCreationTime(Date time) { this.creationTime = time; }
    public Date getCreationTime() { return this.creationTime; }
    public Date generateCreationTime() {
    return Date.from(Instant.now());
    }

}
