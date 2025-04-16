package com.example.backend.controller;

import com.example.backend.dto.TeamDto;
import com.example.backend.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/team")
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody TeamDto teamDto) {
        return ResponseEntity.ok()
                .body(teamService.register(teamDto));
    }

}
