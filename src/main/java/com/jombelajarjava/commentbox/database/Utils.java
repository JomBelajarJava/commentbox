package com.jombelajarjava.commentbox.database;

import com.google.cloud.datastore.QueryResults;
import com.googlecode.objectify.cmd.Query;
import com.jombelajarjava.commentbox.database.entities.Comment;

import java.util.LinkedList;
import java.util.List;

public final class Utils {
    private Utils() {}

    /**
     * Store results in a list with cursorAfter set in the last comment.
     *
     * @param query Query to be executed
     * @return List of comments
     */
    public static List<Comment> toList(Query<Comment> query) {
        LinkedList<Comment> result = new LinkedList<>();

        QueryResults<Comment> iterator = query.iterator();
        while (iterator.hasNext()) {
            result.add(iterator.next());
        }

        String cursorAfter = iterator.getCursorAfter().toUrlSafe();
        Comment lastComment = result.getLast();
        lastComment.setCursorAfter(cursorAfter);

        return result;
    }
}
