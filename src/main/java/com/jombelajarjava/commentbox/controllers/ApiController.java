package com.jombelajarjava.commentbox.controllers;

import com.jombelajarjava.commentbox.database.entities.Comment;
import com.jombelajarjava.commentbox.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "https://www.jombelajarjava.com")
public class ApiController {
    @Autowired
    private CommentService commentService;

    /**
     * GET Requests
     */

    @GetMapping("/api/threads/latest")
    public List<Comment> latestThreads() {
        return commentService.getLatestThreads();
    }

    @GetMapping("/api/threads")
    public List<Comment> loadMoreThreads(@RequestParam String cursorAfter) {
        return commentService.getThreads(cursorAfter);
    }

    @GetMapping("/api/thread/{threadId}/comments/earliest")
    public List<Comment> replies(@PathVariable Long threadId) {
        return commentService.getEarliestReplies(threadId);
    }

    @GetMapping("/api/thread/{threadId}/comments")
    public List<Comment> moreReplies(@PathVariable Long threadId, @RequestParam String cursorAfter) {
        return commentService.getReplies(threadId, cursorAfter);
    }

    /**
     * POST Requests
     */

    @PostMapping("/api/thread")
    public Comment openThread(@RequestBody Comment comment) {
        return commentService.addThread(comment);
    }

    @PostMapping("/api/thread/{threadId}/comment")
    public String  sendReply(@PathVariable Long threadId, @RequestBody Comment comment) {
        commentService.addReply(threadId, comment);
        return "";
    }
}
