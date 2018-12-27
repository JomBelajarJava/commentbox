package com.jombelajarjava.commentbox.database.repositories;

import com.google.cloud.datastore.Cursor;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import com.jombelajarjava.commentbox.database.entities.Comment;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.googlecode.objectify.ObjectifyService.ofy;
import static com.jombelajarjava.commentbox.database.Utils.take;

@Repository
public class CommentRepository {
    public List<Comment> findLatestThreads() {
        Query<Comment> query = ofy()
                .load()
                .type(Comment.class)
                .order("-created")
                .filter("threadKey", null);

        return take(5, query);
    }

    public List<Comment> findThreads(Cursor cursor) {
        Query<Comment> query = ofy()
                .load()
                .type(Comment.class)
                .startAt(cursor)
                .order("-created")
                .filter("threadKey", null);

        return take(5, query);
    }

    public List<Comment> findEarliestReplies(Long threadId) {
        Query<Comment> query = ofy()
                .load()
                .type(Comment.class)
                .order("created")
                .filter("threadKey", Key.create(Comment.class, threadId));

        return take(10, query);
    }

    public List<Comment> findReplies(Long threadId, Cursor cursor) {
        Query<Comment> query = ofy()
                .load()
                .type(Comment.class)
                .startAt(cursor)
                .order("created")
                .filter("threadKey", Key.create(Comment.class, threadId));

        return take(10, query);
    }

    public Integer countReplies(Long threadId) {
        return ofy()
                .load()
                .type(Comment.class)
                .filter("threadKey", Key.create(Comment.class, threadId))
                .count();
    }

    public Key<Comment> insert(Comment comment) {
        return ofy()
                .save()
                .entity(comment)
                .now();
    }
}
