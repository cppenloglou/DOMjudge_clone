package com.example.backend.filter;


import com.example.backend.entity.User;
import com.example.backend.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        SecurityContext context = SecurityContextHolder.getContext();
        String jwtToken = request.getHeader("Authorization");
        if(jwtToken == null || context.getAuthentication() != null){
            filterChain.doFilter(request, response);
            logger.info("Access Token is not present in request.");
            return;
        }
        jwtToken = jwtToken.substring(7);

        try {
            String username = jwtService.extractSubject(jwtToken);
            boolean isValid = jwtService.validateToken(jwtToken);
            String tokenType = jwtService.extractTokenType(jwtToken);
            logger.info("Extracted Username: " + username + ", Valid: " + isValid + ", Token Type: " + tokenType);

            if (username != null && isValid && tokenType.equals("access_token")) {
                logger.info("Access Token is valid and present in request.");
                User user = (User) userDetailsService.loadUserByUsername(username);
                var authToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                context.setAuthentication(authToken);
            }
            filterChain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            logger.info("JWT token has expired: " + e.getMessage());
            handleExpiredTokenError(response);
        } catch (Exception e) {
            logger.error("JWT authentication error: " + e.getMessage());
            handleAuthenticationError(response, e.getMessage());
        }
    }
    
        private void handleExpiredTokenError(HttpServletResponse response) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("error", "Unauthorized");
        body.put("message", "JWT token has expired");
        body.put("path", "access_token");
        
        objectMapper.writeValue(response.getOutputStream(), body);
    }
    
    private void handleAuthenticationError(HttpServletResponse response, String errorMessage) throws IOException {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        body.put("error", "Unauthorized");
        body.put("message", errorMessage);
        
        objectMapper.writeValue(response.getOutputStream(), body);
    }
}
