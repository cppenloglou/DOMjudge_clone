package com.example.backend.controller;


import com.example.backend.dto.LoginDto;
import com.example.backend.dto.RegisterDto;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto, HttpServletResponse response) {
        var authenticationDetails = userService.authenticate(loginDto, response);
        if(authenticationDetails != null && !authenticationDetails.isEmpty()){
            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + authenticationDetails.get("access_token"))
                    .body(
                            LoginResponse
                                    .builder()
                                    .user((User) authenticationDetails.get("user"))
                                    .accessToken((String) authenticationDetails.get("access_token"))
                                    .build()
                    );
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Username or Password");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse response) {
        var accessToken = userService.refreshToken(request, response);
        if(accessToken != null)
            return ResponseEntity.ok()
                .header("Authorization", "Bearer " + accessToken)
                .body("accessToken: " + accessToken);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Refresh Token");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        var user = userService.register(registerDto);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        userService.logout(request, response);
        return ResponseEntity.ok("Logged Out Successfully");
    }
}
