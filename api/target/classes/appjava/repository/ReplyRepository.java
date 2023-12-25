package appjava.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import appjava.entity.Reply;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    Reply findByLink(String link);
    List<Reply> findByOwnerLogin(String ownerLogin);
    List<Reply> findByPollLink(String pollLink);

}
