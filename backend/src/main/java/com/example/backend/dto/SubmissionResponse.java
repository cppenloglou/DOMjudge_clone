package com.example.backend.dto;

import com.example.backend.enums.Status;

public record SubmissionResponse(
        Status status,
        int testcasesPassed,
        double avgTime,
        String executionLog
) {}