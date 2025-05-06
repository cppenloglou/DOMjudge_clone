package com.example.backend.service;

import com.example.backend.dto.ProblemSetResponse;
import com.example.backend.entity.Problem;
import com.example.backend.repository.ProblemRepository;
import com.example.backend.repository.SubmissionRepository;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;
    private final Logger logger = LoggerFactory.getLogger(ProblemService.class);

    // Cache for problem descriptions
    private final LoadingCache<Path, String> problemDescriptionCache = Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(1, TimeUnit.HOURS)
            .build(this::readProblemDescription);

    public List<ProblemSetResponse> getAllProblems(long teamId, int page, int size, String filter) {
        List<ProblemSetResponse> filteredList = getProblemSetResponseList(teamId, filter);

        // Apply pagination
        int start = page * size;
        if (start < 0 || start >= filteredList.size()) {
            return Collections.emptyList();
        }
        int end = Math.min(start + size, filteredList.size());
        return filteredList.subList(start, end);
    }

    public List<ProblemSetResponse> getProblemSetResponseList(long teamId, String filter) {
        // Get paginated problems from a database (note: filter not applied at DB level)
        List<Problem> problems = problemRepository.findAll();

        // Get statuses in a single query
        Map<Long, String> statusMap = getProblemStatusMap(teamId);

        // Process problems with status and filter
        return problems.stream()
                .map(problem -> new ProblemWithStatus(
                        problem,
                        statusMap.get(problem.getId())
                ))
                .filter(pws -> matchesFilter(pws, filter))
                .map(pws -> buildProblemSetResponse(pws.problem(), pws.status()))
                .toList();
    }

    private Map<Long, String> getProblemStatusMap(long teamId) {
        return submissionRepository.findProblemStatusesByTeamId(teamId).stream()
                .collect(Collectors.toMap(
                        ProblemStatusProjection::getProblemId,
                        ProblemStatusProjection::getStatus
                ));
    }

    private boolean matchesFilter(ProblemWithStatus pws, String filter) {
        if (filter == null || filter.isEmpty()) return true;

        return switch (filter.toLowerCase()) {
            case "solved" -> "Solved".equals(pws.status());
            case "unsolved" -> pws.status() == null || "Attempted".equals(pws.status());
            default -> true;
        };
    }

    private ProblemSetResponse buildProblemSetResponse(Problem problem, String status) {
        return ProblemSetResponse.builder()
                .description(getProblemDescription(problem))
                .status(status)
                .id(problem.getId())
                .name(problem.getName())
                .testcases(problem.getTestcases())
                .difficulty(problem.getDifficulty())
                .build();
    }

    private String getProblemDescription(Problem problem) {
        return problem.getFilePath() != null ?
                problemDescriptionCache.get(problem.getFilePath()) :
                "";
    }

    private String readProblemDescription(Path path) {
        try {
            return Files.readString(path);
        } catch (IOException e) {
            logger.error("Failed to read problem description file: {}", e.getMessage());
            return "Description not available.";
        }
    }

    public int getAllProblemsSize(long teamId, String filter) {
        // Get paginated problems from a database (note: filter not applied at DB level)
        return getProblemSetResponseList(teamId, filter).size();
    }

    // Records and Projections
    private record ProblemWithStatus(Problem problem, String status) {}

    public interface ProblemStatusProjection {
        Long getProblemId();
        String getStatus();
    }

    public interface TeamSolvedCountProjection {
        Long getTeamId();
        Long getSolvedCount();
    }

    public List<TeamRank> getTeamRanking() {
        return submissionRepository.findTeamSolvedCounts().stream()
                .sorted((a, b) -> Long.compare(b.getSolvedCount(), a.getSolvedCount())) // Sort descending just in case
                .map(projection -> new TeamRank(
                        projection.getTeamId(),
                        projection.getSolvedCount()
                ))
                .toList();
    }

    // Record to represent the rank entry
    public record TeamRank(Long teamId, Long solvedCount) {}

    public long countDistinctPassedProblemsByTeamId(long teamId) {
        return submissionRepository.countDistinctPassedProblemsByTeamId(teamId);
    }

}