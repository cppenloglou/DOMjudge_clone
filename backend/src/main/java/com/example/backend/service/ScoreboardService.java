package com.example.backend.service;

import com.example.backend.dto.ProblemScoreboard;
import com.example.backend.dto.ProblemSetResponse;
import com.example.backend.dto.ScoreboardResponse;
import com.example.backend.entity.Problem;
import com.example.backend.entity.Team;
import com.example.backend.repository.ProblemRepository;
import com.example.backend.repository.SubmissionRepository;
import com.example.backend.repository.TeamRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ScoreboardService {

    private final TeamRepository teamRepository;
    private final ProblemService problemService;
    private final SubmissionRepository submissionRepository;
    private final ProblemRepository problemRepository;

    public ScoreboardService(TeamRepository teamRepository, ProblemService problemService, SubmissionRepository submissionRepository, ProblemRepository problemRepository) {
        this.teamRepository = teamRepository;
        this.problemService = problemService;
        this.submissionRepository = submissionRepository;
        this.problemRepository = problemRepository;
    }

    public List<ScoreboardResponse> getScoreboard() {
        List<ProblemService.TeamRank> teamRanks = problemService.getTeamRanking();
        return teamRepository.findAll().stream().map(team -> {
            long solved = problemService.countDistinctPassedProblemsByTeamId(team.getId());
            long teamRank = 1;
            for (ProblemService.TeamRank rank : teamRanks) {
                if (rank.teamId().equals(team.getId())) {
                    break;
                }
                teamRank++;
            }

            return ScoreboardResponse.builder()
                    .team_id(team.getId())
                    .rank(teamRank)
                    .solved(solved)
                    .university(team.getUniversity())
                    .name(team.getName())
                    .problems(getProblemScoreboard(team.getId()))
                    .build();
        }).collect(Collectors.toList());
    }

    private List<ProblemScoreboard> getProblemScoreboard(long teamId) {
        List<ProblemSetResponse> problems = problemService.getProblemSetResponseList(teamId, "all");

        return problems.stream().map(problemSetResponse -> {

            Optional<Team> optional_team = teamRepository.findById(teamId);
            Optional<Problem> optional_problem = problemRepository.findById(problemSetResponse.getId());
            Optional<Double> bestAvgTime = submissionRepository.findBestAvgTimeByTeamAndProblem(teamId, problemSetResponse.getId());

            if (optional_team.isEmpty()) {
                throw new IllegalArgumentException("Team not found");
            }
            if (optional_problem.isEmpty()) {
                throw new IllegalArgumentException("Problem not found");
            }

            return ProblemScoreboard.builder()
                    .id(problemSetResponse.getId())
                    .status(problemSetResponse.getStatus())
                    .time(bestAvgTime.orElse(null))  // Set the best avg time here
                    .attempts((long) submissionRepository.getSubmissionsByTeamAndProblem(optional_team.get(), optional_problem.get()).size())
                    .build();
        }).collect(Collectors.toList());
    }
}
