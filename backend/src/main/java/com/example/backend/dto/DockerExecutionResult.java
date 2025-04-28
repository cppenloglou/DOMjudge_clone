package com.example.backend.dto;

import com.example.backend.enums.Status;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class DockerExecutionResult {
    private String problemID;
    private Status status;
    private ExecutionDetails details;
    private String stdout;
    private String stderr;
    private int returncode;
    private double avgTime;
}