package com.example.backend.dto.auth;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterDto {
    private String email;
    private String password;
    private String teamName;
    private String members;
    private String university;
}
