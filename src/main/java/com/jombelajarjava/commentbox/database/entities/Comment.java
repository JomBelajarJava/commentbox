package com.jombelajarjava.commentbox.database.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;
import com.googlecode.objectify.annotation.Index;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    private Long id;
    private String username;
    private String text;

    @Index
    private Date created;

    @JsonIgnore
    @Index
    private Key<Comment> threadKey;

    @Ignore
    private Integer repliesCount;

    @Ignore
    private String cursorAfter;
}
