package com.example.backend.controller;

import com.example.backend.entity.Team;
import com.example.backend.service.TeamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;

    @GetMapping("/{team_id}")
    public ResponseEntity<Team> getTeamById(@PathVariable Long team_id) {
        return ResponseEntity.ok(teamService.getTeamById(team_id));
    }
}
