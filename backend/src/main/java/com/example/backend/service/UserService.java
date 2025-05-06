package com.example.backend.service;


import com.example.backend.dto.auth.LoginDto;
import com.example.backend.dto.auth.RegisterDto;
import com.example.backend.dto.TeamDto;
import com.example.backend.entity.Team;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    private final JwtService jwtService;
    private final RedisService redisService;
    private final UserDetailsService userDetailsService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TeamService teamService;
    private final CountdownService countdownService;

    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    public Map<String, Object> authenticate(LoginDto loginDto) throws UsernameNotFoundException {
        User user = (User) userDetailsService.loadUserByUsername(loginDto.getUsername());
        logger.info("Username {} found", loginDto.getUsername());
        Optional<String> role = user.getRoles().stream().findFirst();
        if(role.isEmpty()) {
            throw new UsernameNotFoundException("Invalid username or password");
        }

        if(!countdownService.isCountdownActive() && role.get().equals("ROLE_USER")) {
            return null;
        }

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginDto.getUsername(), loginDto.getPassword()));
        String jwtToken = jwtService.generateJwtToken(user.getUsername());
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());

        return Map.of("accessToken", jwtToken,  "user", user, "refreshToken", refreshToken);
    }
    public Map<String, Object> refreshToken(String refreshToken) {
        if(redisService.hasToken(refreshToken))
            return null;
        invalidateToken(refreshToken);
        if(refreshToken != null) {
            if(jwtService.validateToken(refreshToken)) {
                var username = jwtService.extractSubject(refreshToken);
                String jwtToken = jwtService.generateJwtToken(username);
                String newRefreshToken = jwtService.generateRefreshToken(username);
                return Map.of("accessToken", jwtToken,  "refreshToken", newRefreshToken);
            }
        }
        return null;
    }

    public void register(RegisterDto registerDto) {
        User user = User.builder()
            .username(registerDto.getEmail())
            .password(passwordEncoder.encode(registerDto.getPassword()))
            .roles(List.of("ROLE_USER"))
            .build();

        User user1 = userRepository.save(user);
        TeamDto teamDto = TeamDto.builder()
                .userId(user1.getId())
                .members(registerDto.getMembers())
                .university(registerDto.getUniversity())
                .name(registerDto.getTeamName())
                .build();

        Team team = teamService.register(teamDto);

        user.setTeam(team);

        userRepository.save(user);
    }

    public void logout(HttpServletRequest request, String refreshToken) {
        var token = request.getHeader("Authorization").substring(7);
        log.info("Token value from request: {}", token);
        invalidateToken(token);
        invalidateToken(refreshToken);
    }

    private void invalidateToken(String token) {
        long expirationTimeInMilliseconds = jwtService.extractExpiration(token).getTime() - System.currentTimeMillis();
        log.info("Invalidating token with remaining : TTL: {} seconds", expirationTimeInMilliseconds);
        if(expirationTimeInMilliseconds > 0L){
            log.info("New Access Token Generated Successfully, Invalidating Previous Refresh token");
            redisService.setTokenWithTTL(token, "blacklisted", expirationTimeInMilliseconds, TimeUnit.MILLISECONDS);
        }
    }

}
