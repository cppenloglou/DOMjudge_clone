package com.example.backend.controller;

import com.example.backend.service.CountdownService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/clock")
public class CountdownController {

    private final CountdownService countdownService;

    @Autowired
    public CountdownController(CountdownService countdownService) {
        this.countdownService = countdownService;
    }

    // Endpoint to start the countdown
    @PostMapping("/start-countdown")
    public String startCountdown() {
        countdownService.startCountdown();
        return "Countdown started successfully";
    }

    // Endpoint to check the remaining time
    @GetMapping("/remaining-time")
    public String getRemainingTime() {
        long remainingTime = countdownService.getRemainingTime();
        if (remainingTime <= 0) {
            return null;
        }
        return String.valueOf(remainingTime);
    }

    // Endpoint to check if the countdown is active
    @GetMapping("/is-countdown-active")
    public boolean isCountdownActive() {
        return countdownService.isCountdownActive();
    }
}
