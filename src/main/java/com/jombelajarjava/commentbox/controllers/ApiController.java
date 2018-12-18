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

    @GetMapping("/api/threads")
    public Message loadMoreThreads(@RequestParam String cursorAfter) {
        List<Comment> threads = commentService.getThreads(cursorAfter);
        return new Message(threads);
    }

    @GetMapping("/api/thread/{threadId}/comments/earliest")
    public Message replies(@PathVariable Long threadId) {
        List<Comment> replies = commentService.getEarliestReplies(threadId);
        return new Message(replies);
    }

    @GetMapping("/api/thread/{threadId}/comments")
    public Message moreReplies(@PathVariable Long threadId, @RequestParam String cursorAfter) {
        List<Comment> replies = commentService.getReplies(threadId, cursorAfter);
        return new Message(replies);
    }

    @PostMapping(value = "/api/thread")
    public Message openThread(@ModelAttribute Comment comment) {
        Comment thread = commentService.addThread(comment);
        return new Message(thread);
    }

    @PostMapping("/api/thread/{threadId}/comment")
    public Message sendReply(@PathVariable Long threadId, @ModelAttribute Comment comment) {
        commentService.addReply(threadId, comment);
        return new Message("");
    }
}
