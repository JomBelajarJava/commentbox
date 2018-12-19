package com.jombelajarjava.commentbox.database;

import com.google.cloud.datastore.DatastoreOptions;
import com.googlecode.objectify.ObjectifyFactory;
import com.googlecode.objectify.ObjectifyService;
import com.jombelajarjava.commentbox.database.entities.Comment;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener
public class DatabaseInitializer implements ServletContextListener {
    private void useDatastoreEmulator() {
        ObjectifyService.init(new ObjectifyFactory(
                DatastoreOptions.newBuilder()
                        .setHost("http://localhost:8081")
                        .setProjectId("vivid-reality-225905")
                        .build()
                        .getService()
        ));
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {
//        useDatastoreEmulator();  // During development, uncomment this and comment out ObjectifyService.init();

        ObjectifyService.init();
        ObjectifyService.register(Comment.class);
    }
}
