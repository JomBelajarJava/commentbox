package com.jombelajarjava.commentbox.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jombelajarjava.commentbox.database.entities.Comment;
import com.jombelajarjava.commentbox.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApiController {
    private static final String APPLICATION_JAVASCRIPT_VALUE = "application/javascript";

    @Autowired
    private CommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;



    @GetMapping(value = "/api/threads/latest", produces = APPLICATION_JAVASCRIPT_VALUE)
    public String latestThreads(@RequestParam String callback) {
        List<Comment> threads = commentService.getLatestThreads();
        return serialize(new Message(threads), callback);
    }

    @GetMapping(value = "/api/threads", produces = APPLICATION_JAVASCRIPT_VALUE)
    public String loadMoreThreads(@RequestParam String cursorAfter, @RequestParam String callback) {
        List<Comment> threads = commentService.getThreads(cursorAfter);
        return serialize(new Message(threads), callback);
    }

    @GetMapping(value = "/api/thread/{threadId}/comments/earliest", produces = APPLICATION_JAVASCRIPT_VALUE)
    public String replies(@PathVariable Long threadId, @RequestParam String callback) {
        List<Comment> replies = commentService.getEarliestReplies(threadId);
        return serialize(new Message(replies), callback);
    }

    @GetMapping(value = "/api/thread/{threadId}/comments", produces = APPLICATION_JAVASCRIPT_VALUE)
    public String moreReplies(@PathVariable Long threadId, @RequestParam String cursorAfter,
                              @RequestParam String callback) {
        List<Comment> replies = commentService.getReplies(threadId, cursorAfter);
        return serialize(new Message(replies), callback);
    }

    @GetMapping(value = "/api/thread", produces = APPLICATION_JAVASCRIPT_VALUE)
    public String openThread(@ModelAttribute Comment comment, @RequestParam String callback) {
        Comment thread = commentService.addThread(comment);
        return serialize(new Message(thread), callback);
    }

    @GetMapping(value = "/api/thread/{threadId}/comment", produces = APPLICATION_JAVASCRIPT_VALUE)
    public String  sendReply(@PathVariable Long threadId, @ModelAttribute Comment comment,
                             @RequestParam String callback) {
        commentService.addReply(threadId, comment);
        return serialize(new Message(""), callback);
    }



    private String serialize(Message message, String callback) {
        try {
            return callback + "(" + objectMapper.writeValueAsString(message) + ");";
        } catch (JsonProcessingException e) {
            return e.getMessage();
        }
    }
}
