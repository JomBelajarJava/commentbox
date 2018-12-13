package com.jombelajarjava.commentbox.converters;

import com.jombelajarjava.commentbox.comment.model.Comment;

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
}
