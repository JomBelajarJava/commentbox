package com.jombelajarjava.commentbox.services;

import com.google.cloud.datastore.Cursor;
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

    public List<Comment> getLatestThreads() {
        List<Comment> threads = commentRepository.findLatestThreads();
        return associateRepliesCount(threads);
    }

    public List<Comment> getThreads(String cursorAfter) {
        Cursor cursor = Cursor.fromUrlSafe(cursorAfter);
        List<Comment> threads = commentRepository.findThreads(cursor);
        return associateRepliesCount(threads);
    }

    public List<Comment> getEarliestReplies(Long threadId) {
        return commentRepository.findEarliestReplies(threadId);
    }

    public List<Comment> getReplies(Long threadId, String cursorAfter) {
        Cursor cursor = Cursor.fromUrlSafe(cursorAfter);
        return commentRepository.findReplies(threadId, cursor);
    }

    public Comment addThread(Comment comment) {
        comment.setCreated(Date.from(now()));
        Key<Comment> key = commentRepository.insert(comment);
        comment.setId(key.getId());
        return comment;
    }

    public void addReply(Long threadId, Comment comment) {
        comment.setCreated(Date.from(now()));
        comment.setThreadKey(Key.create(Comment.class, threadId));
        commentRepository.insert(comment);
    }

    /**
     * Associate replies count for each thread.
     *
     * @param threads A list of threads
     * @return A list of threads with replies count
     */
    private List<Comment> associateRepliesCount(List<Comment> threads) {
        for (Comment thread : threads) {
            Integer repliesCount = commentRepository.countReplies(thread.getId());
            thread.setRepliesCount(repliesCount);
        }
        return threads;
    }
}
