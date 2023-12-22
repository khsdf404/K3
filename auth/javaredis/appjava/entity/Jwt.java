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
@RedisHash("JWT")
public class Jwt {

    @Id
    private Long id;
    @Indexed
    private String ownerLogin;
    @Indexed
    private String accessToken;
    @Indexed
    private String refreshToken;
    
    
    public String getOwnerLogin() { return this.ownerLogin; }
    public void setOwnerLogin(String login) { this.ownerLogin = login; }

    public String getAccessToken() { return this.accessToken; }
    public void setAccessToken(String token) { this.accessToken = token; }

    public String getRefreshToken() { return this.refreshToken; }
    public void setRefreshToken(String token) { this.refreshToken = token; }
    
}