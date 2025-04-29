package com.example.backend.dto.docker;

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
    private DockerExecutionDetails details;
    private String stdout;
    private String stderr;
    private int returncode;
    private double avgTime;
}