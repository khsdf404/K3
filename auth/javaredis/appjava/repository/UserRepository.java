package appjava.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import appjava.entity.User;


@Repository
public interface UserRepository extends CrudRepository<User, Long> {


    User findByLogin(String login);

}
