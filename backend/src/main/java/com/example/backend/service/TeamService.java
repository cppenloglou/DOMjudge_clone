package com.example.backend.service;

import com.example.backend.dto.TeamDto;
import com.example.backend.entity.Team;
import com.example.backend.repository.TeamRepository;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    private final TeamRepository teamRepository;

    public TeamService(TeamRepository teamRepository) {
        this.teamRepository = teamRepository;
    }

    public Team register(TeamDto teamDto) {
        Team newTeam = Team.builder()
                .name(teamDto.getName())
                .university(teamDto.getUniversity())
                .members(teamDto.getMembers())
                .problemsSolved(0)
                .build();

        return teamRepository.save(newTeam);
    }
}
