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
                .filter("parentComment", null)
                .list();
    }

    public List<Comment> findAllReplies(Long parentId) {
        return ofy().load()
                .type(Comment.class)
                .filter("parentComment", Key.create(Comment.class, parentId))
                .list();
    }
}
