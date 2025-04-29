package com.example.backend.repository;

import com.example.backend.entity.Submission;
import com.example.backend.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    boolean existsByTeamIdAndProblemIdAndStatus(Long team_id, Long problem_id, Status status);
    boolean existsByTeamIdAndProblemId(Long team_id, Long problem_id);
}