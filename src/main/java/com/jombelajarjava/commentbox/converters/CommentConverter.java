package com.jombelajarjava.commentbox.converters;

import com.jombelajarjava.commentbox.comment.model.Comment;
import com.jombelajarjava.commentbox.database.entities.CommentEntity;

import java.sql.Date;
import java.time.Instant;

public final class CommentConverter {
    private CommentConverter() {}

    public static Comment toModel(CommentEntity commentEntity) {
        return Comment.builder()
                .id(commentEntity.id)
                .username(commentEntity.username)
                .text(commentEntity.text)
                .created(commentEntity.created)
                .build();
    }

    public static CommentEntity toEntity(Comment model) {
        CommentEntity entity = new CommentEntity();
        entity.id = model.getId();
        entity.username = model.getUsername();
        entity.text = model.getText();
        entity.created = Date.from(Instant.now());

        return entity;
    }
}
