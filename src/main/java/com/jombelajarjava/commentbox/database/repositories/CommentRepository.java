package com.jombelajarjava.commentbox.database.repositories;

import com.googlecode.objectify.Key;
import com.jombelajarjava.commentbox.database.entities.CommentEntity;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.googlecode.objectify.ObjectifyService.ofy;

@Repository
public class CommentRepository {
    public List<CommentEntity> findAllThreads() {
        return ofy().load()
                .type(CommentEntity.class)
                .filter("threadKey", null)
                .list();
    }

    public List<CommentEntity> findAllReplies(Long threadId) {
        return ofy().load()
                .type(CommentEntity.class)
                .filter("threadKey", Key.create(CommentEntity.class, threadId))
                .list();
    }

    public Integer countReplies(Long threadId) {
        return ofy().load()
                .type(CommentEntity.class)
                .filter("threadKey", Key.create(CommentEntity.class, threadId))
                .count();
    }

    public Key<CommentEntity> insert(CommentEntity commentEntity) {
        return ofy().save()
                .entity(commentEntity)
                .now();
    }
}
