package appjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import appjava.entity.Poll;

@Repository
public interface PollRepository extends JpaRepository<Poll, Long> {

    Poll findByLink(String link);
    List<Poll> findByOwnerLogin(String ownerLogin);

}
