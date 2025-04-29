package com.example.backend.service;

import com.example.backend.dto.ProblemSetResponse;
import com.example.backend.entity.Problem;
import com.example.backend.enums.Status;
import com.example.backend.repository.ProblemRepository;
import com.example.backend.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final Logger logger = LoggerFactory.getLogger(ProblemService.class);

    public List<ProblemSetResponse> getAllProblems(long teamId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return problemRepository.findAll(pageable)
                .map(problem -> buildProblemSetResponse(teamId, problem))
                .getContent();
    }

    private ProblemSetResponse buildProblemSetResponse(long teamId, Problem problem) {
        String description = getProblemDescription(problem);
        String status = determineProblemStatus(teamId, problem);

        return ProblemSetResponse.builder()
                .description(description)
                .status(status)
                .id(problem.getId())
                .name(problem.getName())
                .testcases(problem.getTestcases())
                .difficulty(problem.getDifficulty())
                .build();
    }

    private String getProblemDescription(Problem problem) {
        if (problem.getFilePath() == null) {
            return "";
        }

        try {
            return Files.readString(problem.getFilePath());
        } catch (IOException e) {
            logger.error("Failed to read problem description file: {}", e.getMessage());
            return "Description not available.";
        }
    }

    private String determineProblemStatus(long teamId, Problem problem) {
        if (!submissionRepository.existsByTeamIdAndProblemId(teamId, problem.getId())) {
            return null;
        }

        boolean isPassed = submissionRepository.existsByTeamIdAndProblemIdAndStatus(
                teamId, problem.getId(), Status.PASSED);

        return isPassed ? "Solved" : "Attempted";
    }

    public Integer getAllProblemsSize() {
        return problemRepository.findAll().size();
    }
}
