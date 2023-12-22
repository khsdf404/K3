package appjava.repository;

import appjava.entity.Jwt;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JwtRepository extends CrudRepository<Jwt, Long> {

    Jwt findByAccessToken(String accessToken);

    Jwt findByOwnerLogin(String ownerLogin);

}
