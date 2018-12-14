package com.jombelajarjava.commentbox.services;

import com.googlecode.objectify.Key;
import com.jombelajarjava.commentbox.database.entities.Comment;
import com.jombelajarjava.commentbox.database.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

import static java.time.Instant.now;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllThreads() {
        List<Comment> threads = commentRepository.findAllThreads();

        for (Comment thread : threads) {
            Integer repliesCount = commentRepository.countReplies(thread.getId());
            thread.setRepliesCount(repliesCount);
        }

        return threads;
    }

    public List<Comment> getAllReplies(Long threadId) {
        return commentRepository.findAllReplies(threadId);
    }

    public void addThread(Comment comment) {
        comment.setCreated(Date.from(now()));
        commentRepository.insert(comment);
    }

    public void addReply(Long threadId, Comment comment) {
        comment.setCreated(Date.from(now()));
        comment.setThreadKey(Key.create(Comment.class, threadId));
        commentRepository.insert(comment);
    }
}
