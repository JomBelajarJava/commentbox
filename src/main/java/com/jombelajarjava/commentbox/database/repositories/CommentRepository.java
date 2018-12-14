package com.jombelajarjava.commentbox.database.repositories;

import com.googlecode.objectify.Key;
import com.jombelajarjava.commentbox.database.entities.Comment;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.googlecode.objectify.ObjectifyService.ofy;

@Repository
public class CommentRepository {
    public List<Comment> findAllThreads() {
        return ofy().load()
                .type(Comment.class)
                .order("-created")
                .filter("threadKey", null)
                .list();
    }

    public List<Comment> findAllThreadsWithRepliesCount() {
        return ofy().transact(() -> {
            List<Comment> threads = findAllThreads();

            for (Comment thread : threads) {
                Integer repliesCount = countReplies(thread.getId());
                thread.setRepliesCount(repliesCount);
            }

            return threads;
        });
    }

    public List<Comment> findAllReplies(Long threadId) {
        return ofy().load()
                .type(Comment.class)
                .order("created")
                .filter("threadKey", Key.create(Comment.class, threadId))
                .list();
    }

    public Integer countReplies(Long threadId) {
        return ofy().load()
                .type(Comment.class)
                .filter("threadKey", Key.create(Comment.class, threadId))
                .count();
    }

    public Key<Comment> insert(Comment comment) {
        return ofy().save()
                .entity(comment)
                .now();
    }
}
