package com.jombelajarjava.commentbox.database.repositories;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import com.jombelajarjava.commentbox.database.entities.Comment;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.googlecode.objectify.ObjectifyService.ofy;
import static com.jombelajarjava.commentbox.database.Utils.toList;

@Repository
public class CommentRepository {
    public List<Comment> findLatestThreads() {
        Query<Comment> query = ofy().load()
                .type(Comment.class)
                .order("-created")
                .filter("threadKey", null)
                .limit(5);

        return toList(query);
    }

    public Comment findThread(Key<Comment> key) {
        return ofy().load()
                .type(Comment.class)
                .filterKey(key)
                .first()
                .now();
    }

    public List<Comment> findReplies(Long threadId) {
        Query<Comment> query = ofy().load()
                .type(Comment.class)
                .order("created")
                .filter("threadKey", Key.create(Comment.class, threadId))
                .limit(10);

        return toList(query);
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
