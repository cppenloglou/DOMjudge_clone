package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProblemScoreboard {
    private Long id;
    private String status; // "solved" or "unsolved"
    private Long attempts;
    private Double time; // in minutes or seconds (depending on how you store submission timestamps)
}
