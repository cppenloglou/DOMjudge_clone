package com.example.backend.dto;

import com.example.backend.entity.Problem;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ProblemSetResponse {
    private Problem problem;
    private String description;
}
