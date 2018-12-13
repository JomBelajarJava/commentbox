package com.jombelajarjava.commentbox.comment;

import com.googlecode.objectify.Key;
import com.jombelajarjava.commentbox.database.entities.Comment;
import com.jombelajarjava.commentbox.database.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.List;

import static java.time.Instant.now;
import static java.util.stream.Collectors.toList;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllThreads() {
        return commentRepository
                .findAllThreads().stream()
                .peek(thread -> {
                    Integer repliesCount = commentRepository.countReplies(thread.getId());
                    thread.setRepliesCount(repliesCount);
                })
                .collect(toList());
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
