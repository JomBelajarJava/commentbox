package com.jombelajarjava.commentbox.database;

import com.google.cloud.datastore.DatastoreOptions;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.jombelajarjava.commentbox.database.entities.Comment;
import org.springframework.context.annotation.Profile;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
@Profile("development")
public class DatabaseEmulatorInitializer implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        ObjectifyService.init(new ObjectifyFactory(
                DatastoreOptions.newBuilder()
                        .setHost("http://localhost:8081")
                        .setProjectId("vivid-reality-225905")
                        .build()
                        .getService()
        ));
        ObjectifyService.register(Comment.class);
    }
}
