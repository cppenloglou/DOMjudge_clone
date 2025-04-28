package com.example.backend.service;

import com.example.backend.dto.ProblemSetResponse;
import com.example.backend.entity.Problem;
import com.example.backend.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final Logger logger = LoggerFactory.getLogger(ProblemService.class);

    public List<ProblemSetResponse> getAllProblems() {
        List<Problem> problems = problemRepository.findAll();

        return problems.stream()
                .map(problem -> {
                    String description = "";
                    if (problem.getFilePath() != null) {
                        try {
                            description = Files.readString(problem.getFilePath());
                        } catch (IOException e) {
                            // Handle error: maybe log or set a default message
                            logger.error(e.getMessage());
                            description = "Description not available.";
                        }
                    }
                    return new ProblemSetResponse(problem, description);
                })
                .collect(Collectors.toList());
    }
}
