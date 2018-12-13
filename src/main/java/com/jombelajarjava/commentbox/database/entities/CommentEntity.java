package com.jombelajarjava.commentbox.database.entities;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.Date;

@Entity
public class CommentEntity {
    @Id
    public Long id;
    public String username;
    public String text;
    public Date created;
    @Index
    public Key<CommentEntity> threadKey;
}
