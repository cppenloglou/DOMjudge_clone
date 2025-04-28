package com.example.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class ExecutionDetails {
    private String message;
    private int testcaseIndex;
    private String expectedOutput;
    private String actualOutput;
}
