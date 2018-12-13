package com.jombelajarjava.commentbox.api;

import com.jombelajarjava.commentbox.comment.CommentService;
import com.jombelajarjava.commentbox.comment.model.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/api/threads")
    public Message testGettingAllThreads() {
        List<Comment> threads = commentService.getAllThreads();
        return new Message(threads);
    }

    @Data
    @AllArgsConstructor
    class Message {
        private List<Comment> data;
    }
}
