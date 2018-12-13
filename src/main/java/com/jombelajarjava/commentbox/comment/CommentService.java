package com.jombelajarjava.commentbox.comment;

import com.jombelajarjava.commentbox.comment.model.Comment;
import com.jombelajarjava.commentbox.converters.CommentConverter;
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
                .map(CommentConverter::toModel)
                .collect(toList());
    }

    public List<Comment> getAllReplies(Long parentId) {
        return commentRepository.findAllReplies(parentId).stream()
                .map(CommentConverter::toModel)
                .collect(toList());
    }

    public void addComment(Comment comment) {
        commentRepository.insert(toEntity(comment));
    }
}
