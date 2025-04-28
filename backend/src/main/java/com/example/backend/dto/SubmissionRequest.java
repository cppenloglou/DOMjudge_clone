package com.example.backend.dto;

import org.springframework.web.multipart.MultipartFile;

public record SubmissionRequest(
        Long problemId,
        MultipartFile codeFile,
        Long teamId
) {}