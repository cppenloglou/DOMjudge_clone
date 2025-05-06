package com.example.backend.controller;


import com.example.backend.dto.auth.LoginDto;
import com.example.backend.dto.auth.LoginResponse;
import com.example.backend.dto.auth.RegisterDto;
import com.example.backend.entity.User;
import com.example.backend.service.CountdownService;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

    private final UserService userService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) throws UsernameNotFoundException {
        logger.info("Login Request");
        var authenticationDetails = userService.authenticate(loginDto);
        logger.info("Login Authentication Response");
        if(authenticationDetails != null && !authenticationDetails.isEmpty()){
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + authenticationDetails.get("access_token"))
                    .body(
                            LoginResponse
                                    .builder()
                                    .user((User) authenticationDetails.get("user"))
                                    .accessToken((String) authenticationDetails.get("accessToken"))
                                    .refreshToken((String) authenticationDetails.get("refreshToken"))
                                    .build()
                    );
        }
        if(!countdownService.isCountdownActive())
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("The contest doesn't start yet!");
        logger.info("Login Unauthorized");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Username or Password");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody() String refreshToken) {
        logger.info("Refresh token: {}", refreshToken);
        Map<String, Object> refreshTokenDetails = userService.refreshToken(refreshToken);
        if(refreshTokenDetails.get("accessToken") != null)
            return ResponseEntity.ok()
                .body(refreshTokenDetails);
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
