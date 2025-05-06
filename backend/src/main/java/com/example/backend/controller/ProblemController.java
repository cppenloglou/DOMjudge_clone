package com.example.backend.controller;

import com.example.backend.dto.ProblemSetResponse;
import com.example.backend.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final
    ProblemService problemService;

    @GetMapping("/team/{team_id}")
    public ResponseEntity<List<ProblemSetResponse>> getAllProblems(
            @PathVariable(name = "team_id") long team_id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "all") String filter
    ) {
        return ResponseEntity.ok().body(problemService.getAllProblems(team_id, page, size, filter));
    }

    @GetMapping
    public ResponseEntity<Integer> getAllProblemsSize(
            @RequestParam(name = "teamId") long team_id,
            @RequestParam(defaultValue = "all") String filter
    ) {
        return ResponseEntity.ok(problemService.getAllProblemsSize(team_id, filter));
    }
}
