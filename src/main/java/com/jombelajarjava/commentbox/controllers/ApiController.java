package com.jombelajarjava.commentbox.controllers;

import com.jombelajarjava.commentbox.database.entities.Comment;
import com.jombelajarjava.commentbox.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApiController {
    @Autowired
    private CommentService commentService;

    @GetMapping("/api/threads")
    public Message threads() {
        List<Comment> threads = commentService.getAllThreads();
        return new Message(threads);
    }

    @GetMapping("/api/thread/{threadId}/comments")
    public Message comments(@PathVariable Long threadId) {
        List<Comment> replies = commentService.getAllReplies(threadId);
        return new Message(replies);
    }

    @PostMapping("/api/thread")
    public void openThread(@RequestBody Comment comment) {
        commentService.addThread(comment);
    }

    @PostMapping("/api/thread/{threadId}/comment")
    public void sendReply(@PathVariable Long threadId, @RequestBody Comment comment) {
        commentService.addReply(threadId, comment);
    }
}
