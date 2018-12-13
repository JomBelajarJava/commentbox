package com.jombelajarjava.commentbox.converters;

import com.jombelajarjava.commentbox.comment.model.Comment;

import java.sql.Date;
import java.time.Instant;

public final class CommentConverter {
    private CommentConverter() {}

    public static Comment toModel(com.jombelajarjava.commentbox.database.entities.Comment comment) {
        return Comment.builder()
                .id(comment.id)
                .username(comment.username)
                .text(comment.text)
                .created(comment.created)
                .build();
    }

    public static com.jombelajarjava.commentbox.database.entities.Comment toEntity(Comment model) {
        com.jombelajarjava.commentbox.database.entities.Comment entity =
                new com.jombelajarjava.commentbox.database.entities.Comment();
        entity.id = model.getId();
        entity.username = model.getUsername();
        entity.text = model.getText();
        entity.created = Date.from(Instant.now());

        return entity;
    }
}
