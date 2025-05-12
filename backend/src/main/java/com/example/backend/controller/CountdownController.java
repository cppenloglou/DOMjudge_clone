package com.example.backend.controller;

import com.example.backend.service.CountdownService;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/clock")
public class CountdownController {

    private final CountdownService countdownService;

    public CountdownController(CountdownService countdownService) {
        this.countdownService = countdownService;
    }

    // Endpoint to start the countdown
    @PostMapping("/start-countdown")
    public String startCountdown(
            @RequestParam(defaultValue = "3", name = "h") int hours,
            @RequestParam(defaultValue = "0", name = "m") int minutes) {
        log.info("Starting countdown with hours: {} and minutes: {}", hours, minutes);
        countdownService.startCountdown(hours, minutes);
        return "Countdown started successfully";
    }

    @PostMapping("/cancel-countdown")
    public void cancelCountdown() {
        log.info("Canceling countdown...");
        countdownService.cancelCountdown();
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
