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

    @GetMapping("/api/threads/latest")
    public Message latestThreads() {
        List<Comment> threads = commentService.getLatestThreads();
        return new Message(threads);
    }

    @GetMapping("/api/thread/{threadId}/comments")
    public Message comments(@PathVariable Long threadId) {
        List<Comment> replies = commentService.getReplies(threadId);
        return new Message(replies);
    }

    @PostMapping("/api/thread")
    public Message openThread(@RequestBody Comment comment) {
        Comment thread = commentService.addThread(comment);
        return new Message(thread);
    }

    @PostMapping("/api/thread/{threadId}/comment")
    public String sendReply(@PathVariable Long threadId, @RequestBody Comment comment) {
        commentService.addReply(threadId, comment);
        return "OK";
    }
}
