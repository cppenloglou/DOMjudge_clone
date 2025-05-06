package com.example.backend.repository;

import com.example.backend.entity.Problem;
import com.example.backend.entity.Submission;
import com.example.backend.entity.Team;
import com.example.backend.service.ProblemService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> getSubmissionsByTeamAndProblemOrderByTimestampDesc(Team team, Problem problem);
    @Query("SELECT s.problem.id AS problemId, " +
            "CASE WHEN SUM(CASE s.status WHEN 'PASSED' THEN 1 ELSE 0 END) > 0 THEN 'Solved' ELSE 'Attempted' END AS status " +
            "FROM Submission s WHERE s.team.id = :teamId GROUP BY s.problem.id")
    List<ProblemService.ProblemStatusProjection> findProblemStatusesByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT COUNT(DISTINCT s.problem.id) " +
            "FROM Submission s " +
            "WHERE s.team.id = :teamId AND s.status = 'PASSED'")
    Long countDistinctPassedProblemsByTeamId(@Param("teamId") Long teamId);

    @Query("SELECT s.team.id AS teamId, COUNT(DISTINCT s.problem.id) AS solvedCount " +
            "FROM Submission s " +
            "WHERE s.status = 'PASSED' " +
            "GROUP BY s.team.id " +
            "ORDER BY solvedCount DESC")
    List<ProblemService.TeamSolvedCountProjection> findTeamSolvedCounts();

    @Query("SELECT MIN(s.avgTime) AS bestAvgTime " +
            "FROM Submission s " +
            "WHERE s.status = 'PASSED' AND s.team.id = :teamId AND s.problem.id = :problemId")
    Optional<Double> findBestAvgTimeByTeamAndProblem(@Param("teamId") Long teamId, @Param("problemId") Long problemId);


    List<Submission> getSubmissionsByTeamAndProblem(Team team, Problem problem);





}