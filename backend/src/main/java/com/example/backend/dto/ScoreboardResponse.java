package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreboardResponse {
    private Long team_id;
    private Long rank;
    private String name;
    private String university;
    private String members;
    private Long solved;
    private List<ProblemScoreboard> problems;
}
