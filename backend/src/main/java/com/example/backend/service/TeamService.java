package com.example.backend.service;

import com.example.backend.dto.TeamDto;
import com.example.backend.entity.Team;
import com.example.backend.entity.User;
import com.example.backend.repository.TeamRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository, UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
    }

    public Team register(TeamDto teamDto) {
        Team newTeam = Team.builder()
                .name(teamDto.getName())
                .university(teamDto.getUniversity())
                .members(teamDto.getMembers())
                .problemsSolved(0)
                .build();

        Team team = teamRepository.save(newTeam);

        Optional<User> user = userRepository.findById(teamDto.getUserId());

        if (user.isPresent()) {
            User user1 = user.get();
            user1.setTeam(team);
            userRepository.save(user1);
        } else {
            throw new UsernameNotFoundException("User with that userId not found");
        }

        return team;
    }
}
