package com.jombelajarjava.commentbox.comment;

import com.googlecode.objectify.Key;
import com.jombelajarjava.commentbox.comment.model.Comment;
import com.jombelajarjava.commentbox.converters.CommentConverter;
import com.jombelajarjava.commentbox.database.entities.CommentEntity;
import com.jombelajarjava.commentbox.database.repositories.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.jombelajarjava.commentbox.converters.CommentConverter.toEntity;
import static java.util.stream.Collectors.toList;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllThreads() {
        return commentRepository.findAllThreads().stream()
                .map(commentEntity -> {
                    Integer repliesCount = commentRepository.countReplies(commentEntity.id);

                    Comment comment = CommentConverter.toModel(commentEntity);
                    comment.setRepliesCount(repliesCount);

                    return comment;
                })
                .collect(toList());
    }

    public List<Comment> getAllReplies(Long threadId) {
        return commentRepository.findAllReplies(threadId).stream()
                .map(CommentConverter::toModel)
                .collect(toList());
    }

    public void addThread(Comment comment) {
        commentRepository.insert(toEntity(comment));
    }

    public void addReply(Long threadId, Comment comment) {
        CommentEntity entity = CommentConverter.toEntity(comment);
        entity.threadKey = Key.create(CommentEntity.class, threadId);

        commentRepository.insert(entity);
    }
}
