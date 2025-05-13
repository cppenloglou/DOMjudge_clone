package com.example.backend.controller;


import com.example.backend.dto.auth.LoginDto;
import com.example.backend.dto.auth.LoginResponse;
import com.example.backend.dto.auth.RegisterDto;
import com.example.backend.entity.User;
import com.example.backend.service.CountdownService;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final CountdownService countdownService;
    Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Value("${frontend.base.url}")
    private String BASE_URL;

    private final UserService userService;
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
    var authenticationDetails = userService.authenticate(loginDto);
    if (authenticationDetails != null && !authenticationDetails.isEmpty()) {
        // Extract tokens
        String accessToken = (String) authenticationDetails.get("accessToken");
        String refreshToken = (String) authenticationDetails.get("refreshToken");

        // Create secure cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .sameSite("Strict")
                .maxAge(7 * 24 * 60 * 60) // 7 days
                .build();

        // Add cookie to response
        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok()
                .body(LoginResponse
                        .builder()
                        .user((User) authenticationDetails.get("user"))
                        .accessToken(accessToken) // return access token only
                        .build()
                );
    }

    if (!countdownService.isCountdownActive())
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The contest hasn't started yet!");

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Username or Password");
}

   @PostMapping("/refresh")
public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
    logger.info("Refresh token: {}", refreshToken);

    if (refreshToken == null) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Missing Refresh Token");
    }

    Map<String, Object> refreshTokenDetails = userService.refreshToken(refreshToken);
    if (refreshTokenDetails.get("accessToken") != null) {
        return ResponseEntity.ok(refreshTokenDetails);
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        userService.register(registerDto);
        return ResponseEntity.ok().body("User registered successfully");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, @RequestBody String refreshToken) {
        logger.info("Refresh token in logout: {}", refreshToken);
        userService.logout(request, refreshToken);
        return ResponseEntity.ok("Logged Out Successfully");
    }
}
