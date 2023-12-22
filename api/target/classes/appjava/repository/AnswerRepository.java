package appjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import appjava.entity.Answer;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    Answer findByLink(String link);
    List<Answer> findByOwnerLogin(String ownerLogin);

}
