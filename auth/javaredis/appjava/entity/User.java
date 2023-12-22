package appjava.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RedisHash("User")
public class User {
  
    @Id
    private Long id;
    @Indexed
    private String role;
    @Indexed
    private String login;
    @Indexed
    private String password;
    @Indexed
    private String email;
    @Indexed
    private String phone;

}