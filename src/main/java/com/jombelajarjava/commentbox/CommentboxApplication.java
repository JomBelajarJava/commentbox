package com.jombelajarjava.commentbox;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@SpringBootApplication
@ServletComponentScan
public class CommentboxApplication {
    public static void main(String[] args) {
        SpringApplication.run(CommentboxApplication.class, args);
    }
}

