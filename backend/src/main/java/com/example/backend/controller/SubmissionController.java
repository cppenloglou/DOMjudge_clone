package com.example.backend.controller;

import com.example.backend.dto.SubmissionRequest;
import com.example.backend.dto.SubmissionResponse;
import com.example.backend.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/submit")
    public SubmissionResponse submitSolution(
            @ModelAttribute SubmissionRequest request) {
        return submissionService.processSubmission(request);
    }

    @GetMapping("/problem/{problem_id}/team/{team_id}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByTeamAndProblemOrderByTimestampDesc(
            @PathVariable(name = "problem_id") Long problem_id,
            @PathVariable(name = "team_id") Long team_id
    ) {
        return ResponseEntity.ok().body(submissionService.getSubmissionsByTeamAndProblemOrderByTimestampDesc(team_id, problem_id));
    }
}