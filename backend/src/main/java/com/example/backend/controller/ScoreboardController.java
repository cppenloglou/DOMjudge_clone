package com.example.backend.controller;

import com.example.backend.dto.ScoreboardResponse;
import com.example.backend.service.ScoreboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/scoreboard")
@RequiredArgsConstructor
public class ScoreboardController {

    private final ScoreboardService scoreboardService;

    @GetMapping
    public ResponseEntity<List<ScoreboardResponse>> getScoreboard() {
        return ResponseEntity.ok().body(scoreboardService.getScoreboard());
    }
}
