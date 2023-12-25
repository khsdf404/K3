package appjava.entity;

import jakarta.persistence.*;
import java.util.Date;
import java.time.temporal.ChronoUnit;
import java.time.Instant;
import java.math.BigInteger;


@Entity
@Table(name = "polls")
public class Poll {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String ownerLogin;

  private String name;
  private String questions;
  private String answers;
  private Boolean status;
  private Date creationTime;
  private Date expirationTime;

  @Column(unique=true)
  private String link;
  private Long replyAmount;


  public void setId(Long id) { this.id = id; }
  public Long getId() { return this.id; }

  public void setReplyAmount(Long replyAmount) { this.replyAmount = replyAmount; }
  public Long getReplyAmount() { return this.replyAmount; }

  public String getOwnerLogin() { return this.ownerLogin; }
  public void setOwnerLogin(String login) { this.ownerLogin = login; }


  public void setName(String name) { this.name = name; }
  public String getName() { return this.name; }

  public void setQuestions(String questions) { this.questions = questions; }
  public String getQuestions() { return this.questions; }

  public void setAnswers(String answers) { this.answers = answers; }
  public String getAnswers() { return this.answers; }

  public void setLink(String link) { this.link = link; }
  public String getLink() { return this.link; }
  public String generateLink() {
    String link = "";

    link += this.ownerLogin;
    link += this.name;

    link += Date.from(Instant.now()).toInstant().toString();
    
    return String.format("%040x", new BigInteger(1, link.getBytes()));
  }

  public void setStatus(Boolean status) { this.status = status; }
  public Boolean getStatus() { return this.status; }


  public void setCreationTime(Date time) { this.creationTime = time; }
  public Date getCreationTime() { return this.creationTime; }
  public Date generateCreationTime() {
    return Date.from(Instant.now());
  }

  public void setExpirationTime(Date time) { this.expirationTime = time; }
  public Date getExpirationTime() { return this.expirationTime; }

}
