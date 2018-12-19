package com.jombelajarjava.commentbox.database;

import com.googlecode.objectify.ObjectifyService;
import com.jombelajarjava.commentbox.database.entities.Comment;
import org.springframework.context.annotation.Profile;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
@Profile("production")
public class DatabaseInitializer implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ObjectifyService.init();
        ObjectifyService.register(Comment.class);
    }
}
