package com.jombelajarjava.commentbox.comment.model;

import lombok.Builder;
import lombok.Data;

import java.util.Date;

@Data
@Builder
public class Comment {
    private Long id;
    private String username;
    private String text;
    private Date created;
    private Integer repliesCount;
}
