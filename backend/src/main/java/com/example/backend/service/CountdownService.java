package com.example.backend.service;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
@EnableScheduling
public class CountdownService {

    private Instant countdownStartTime;
    private Duration countdownDuration;
    private boolean isCountingDown = false;

    // Start the countdown when called by admin
    public void startCountdown(int hours, int minutes) {
        countdownDuration = Duration.ofHours(hours).plusMinutes(minutes);
        countdownStartTime = Instant.now();
        isCountingDown = true;
    }

    // Scheduled task to update the countdown every second
    @Scheduled(fixedRate = 1000) // Update every second
    public void updateCountdown() {
        if (isCountingDown && countdownStartTime != null) {
            Duration elapsed = Duration.between(countdownStartTime, Instant.now());
            if (elapsed.compareTo(countdownDuration) >= 0) {
                isCountingDown = false; // Stop countdown when it reaches 0
            }
        }
    }

    // Get the remaining time in seconds
    public long getRemainingTime() {
        if (!isCountingDown) {
            return 0;
        }
        Duration elapsed = Duration.between(countdownStartTime, Instant.now());
        return countdownDuration.minus(elapsed).getSeconds();
    }

    // Check if the countdown is active
    public boolean isCountdownActive() {
        return isCountingDown;
    }
}
