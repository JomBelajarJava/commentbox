package com.jombelajarjava.commentbox.api;

import com.jombelajarjava.commentbox.comment.CommentService;
import com.jombelajarjava.commentbox.comment.model.Comment;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/api/thread")
    public void testAddingComment(@RequestBody Comment comment) {
        commentService.addComment(comment);
    }

    @Data
    @AllArgsConstructor
    class Message {
        private Object data;
    }
}
