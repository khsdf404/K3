package appjava.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.beans.factory.annotation.Value;

import appjava.repository.UserRepository;
import appjava.repository.JwtRepository;

import appjava.service.UserService;
import appjava.service.JwtService;
import appjava.service.JwtBuilder;


@Configuration
public class ServiceConfig {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Value("${jwt.sessionTime}")
    private Long sessionTime;

    @Bean
    public UserService userService(UserRepository repository) {
        return new UserService(repository);
    }

    @Bean
    public JwtService jwtService(JwtRepository repository) {
        return new JwtService(new JwtBuilder(this.SECRET_KEY, this.sessionTime), repository);
    }
}
