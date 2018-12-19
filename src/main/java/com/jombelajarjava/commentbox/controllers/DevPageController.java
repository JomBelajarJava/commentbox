package com.jombelajarjava.commentbox.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
@Profile("development")
public class DevPageController {
    @Value("${commentbox.server.development.host}")
    private String baseUrl;

    @GetMapping("/")
    public String instructions(Model model) {
        model.addAttribute("baseUrl", baseUrl);
        model.addAttribute("embed", true);
        return "page";
    }
}
