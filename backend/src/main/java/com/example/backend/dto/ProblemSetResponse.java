package com.example.backend.dto;

import com.example.backend.enums.Difficulty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ProblemSetResponse {
    private Long id;
    private Difficulty difficulty;
    private String name;
    private int testcases;
    private String description;
    private String status;
}
