package com.example.backend.controller;

import com.example.backend.dto.ProblemSetResponse;
import com.example.backend.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final
    ProblemService problemService;

    @GetMapping
    public ResponseEntity<List<ProblemSetResponse>> getAllProblems() {
        return ResponseEntity.ok().body(problemService.getAllProblems());
    }
}
