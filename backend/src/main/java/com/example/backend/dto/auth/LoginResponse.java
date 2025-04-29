package com.example.backend.dto.auth;

import com.example.backend.entity.User;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private User user;
    private String accessToken;
    private String refreshToken;
}
