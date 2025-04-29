package com.example.backend.dto.docker;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class DockerExecutionDetails {
    private String message;
    private int testcaseIndex;
    private String expectedOutput;
    private String actualOutput;
}
