package com.example.backend.service;

import com.example.backend.dto.docker.DockerExecutionResult;
import com.example.backend.dto.SubmissionRequest;
import com.example.backend.dto.SubmissionResponse;
import com.example.backend.entity.Problem;
import com.example.backend.entity.Submission;
import com.example.backend.entity.Team;
import com.example.backend.enums.Status;
import com.example.backend.repository.ProblemRepository;
import com.example.backend.repository.SubmissionRepository;
import com.example.backend.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final DockerExecutorService dockerExecutorService;
    private final TeamRepository teamRepository;

    public SubmissionResponse processSubmission(SubmissionRequest request) {
        try {
            // 1. Validate and get a problem
            Problem problem = problemRepository.findById(request.problemId())
                    .orElseThrow(() -> new IllegalArgumentException("Problem not found"));

            // 2. Save code file temporarily
            Path codePath = saveCodeFile(request.codeFile());

            // 3. Execute in Docker
            DockerExecutionResult result = dockerExecutorService.executeInDocker(
                    codePath,
                    getFileExtension(request.codeFile()),
                    problem.getId()
            );

            Optional<Team> temp_team = teamRepository.findById(request.teamId());

            if (temp_team.isEmpty()) {
                throw new IllegalArgumentException("Team not found");
            }

            // 4. Create and save submission
            Submission submission = Submission.builder()
                    .problem(problem)
                    .status(result.getStatus())
                    .team(temp_team.get())
                    .testcasesPassed(result.getDetails().getTestcaseIndex())
                    .avgTime(result.getAvgTime())
                    .build();

            Submission savedSubmission =  submissionRepository.save(submission);

            // 5. Clean up and return response
            Files.deleteIfExists(codePath);

            return new SubmissionResponse(
                    submission.getStatus(),
                    submission.getTestcasesPassed(),
                    submission.getAvgTime(),
                    result.getStderr(),
                    savedSubmission.getTimestamp().toString()

            );

        } catch (Exception e) {
            log.error("Submission failed", e);
            return new SubmissionResponse(
                    Status.FAILED,
                    0,
                    0,
                    "Error: " + e.getMessage(),
                    null
            );
        }
    }

    private Path saveCodeFile(MultipartFile file) throws IOException {
        String tempFileName = "submission" + "_" + UUID.randomUUID() + "_" + "solution" + "." + getFileExtension(file);
        Path tempPath = Path.of("temp", tempFileName);
        Files.createDirectories(tempPath.getParent());
        Files.copy(file.getInputStream(), tempPath, StandardCopyOption.REPLACE_EXISTING);
        return tempPath;
    }

    private String getFileExtension(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        assert fileName != null;
        return fileName.substring(fileName.lastIndexOf(".") + 1);
    }

    public List<SubmissionResponse> getSubmissionsByTeamAndProblemOrderByTimestampDesc(Long team_id, Long problem_id) {
        Optional<Team> optional_team = teamRepository.findById(team_id);
        Optional<Problem> optional_problem = problemRepository.findById(problem_id);
        if (optional_team.isEmpty()) {
            throw new IllegalArgumentException("Team not found");
        }
        if (optional_problem.isEmpty()) {
            throw new IllegalArgumentException("Problem not found");
        }
        return submissionRepository
                .getSubmissionsByTeamAndProblemOrderByTimestampDesc(optional_team.get(), optional_problem.get())
                .stream()
                .map(
                        submission -> new SubmissionResponse(
                                submission.getStatus(),
                                submission.getTestcasesPassed(),
                                submission.getAvgTime(),
                                "",
                                submission.getTimestamp().toString()))
                .collect(Collectors.toList());
    }
}