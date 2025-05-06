package com.example.backend.config;


import com.example.backend.dto.auth.RegisterDto;
import com.example.backend.entity.User;
import com.example.backend.filter.JwtAuthenticationFilter;
import com.example.backend.filter.TokenBlacklistFilter;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final TokenBlacklistFilter tokenBlacklistFilter;
    private final AuthenticationProvider authenticationProvider;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Value("${frontend.base-url}")
    private String baseUrl;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth ->
                auth.requestMatchers(
                        "/auth/login",
                        "/auth/register",
                        "/auth/refresh",
                        "/hello",
                        "/swagger-ui/**",
                        "/swagger-resources/**",
                        "/v3/api-docs/**",
                        "/api-ui")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
            .exceptionHandling(exceptions -> exceptions
                .accessDeniedHandler(accessDeniedHandler())
                .authenticationEntryPoint((request, response, authException) -> 
                    handleAuthError(response, "Authentication required", HttpStatus.UNAUTHORIZED))
            )
            .addFilterBefore(tokenBlacklistFilter, LogoutFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .authenticationProvider(authenticationProvider);
        return http.build();
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> 
            handleAuthError(response, "Access denied: You don't have permission to access this resource", HttpStatus.FORBIDDEN);
    }

    private void handleAuthError(HttpServletResponse response, String message, HttpStatus status) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        Map<String, Object> body = new HashMap<>();
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        objectMapper.writeValue(response.getOutputStream(), body);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(baseUrl + ":5173", "http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public CommandLineRunner createTempUser(UserService userService, JwtService jwtService, UserRepository userRepository) {
        return args -> {
            String tempEmail = "tempuser@example.com";

            if (userRepository.findByUsername(tempEmail).isEmpty()) {
                RegisterDto registerDto = RegisterDto.builder()
                        .email(tempEmail)
                        .password("password") // plain password for registration
                        .teamName("Temp Team")
                        .university("Debug University")
                        .members("Temp Member 1," + "Temp Member 2")
                        .build();

                // Reuse your real registration logic
                userService.register(registerDto);

                // Fetch the user again to generate token
                User tempUser = userRepository.findByUsername(tempEmail).orElseThrow();

                String token = jwtService.generateJwtToken(tempUser.getUsername());
                String refreshToken = jwtService.generateJwtToken(tempUser.getUsername());

                logger.info("==================================================");
                logger.info(" TEMP USER CREATED FOR DEBUGGING ");
                logger.info(" Email: {}", tempEmail);
                logger.info(" Password: {}", "password");
                logger.info(" Access Token: Bearer {}", token);
                logger.info(" Refresh Token: Bearer {}", refreshToken);
                logger.info("==================================================");
            } else {
                logger.info("Temp user already exists. No new user created.");
            }
        };
    }

    @Bean
    public CommandLineRunner createAdminUser(UserService userService, JwtService jwtService, UserRepository userRepository) {
        return args -> {
            String adminEmail = "admin@example.com";

            if (userRepository.findByUsername(adminEmail).isEmpty()) {
                RegisterDto adminRegisterDto = RegisterDto.builder()
                        .email(adminEmail)
                        .password("adminpassword") // plain password for registration
                        .teamName("Admin Team")
                        .university("Admin University")
                        .members("Admin Member 1, Admin Member 2")
                        .build();

                // Reuse your real registration logic
                userService.register(adminRegisterDto);

                // Fetch the admin user again to generate token
                User adminUser = userRepository.findByUsername(adminEmail).orElseThrow();

                // Assign the "ADMIN" role to the user (You may need to modify your user entity and service for this)
                adminUser.setRoles(List.of("ROLE_ADMIN"));  // Assuming you have a setRoles method

                // Save the user with roles
                userRepository.save(adminUser);

                String token = jwtService.generateJwtToken(adminUser.getUsername());
                String refreshToken = jwtService.generateJwtToken(adminUser.getUsername());

                logger.info("==================================================");
                logger.info(" ADMIN USER CREATED FOR DEBUGGING ");
                logger.info(" Email: {}", adminEmail);
                logger.info(" Password: {}", "adminpassword");
                logger.info(" Access Token: Bearer {}", token);
                logger.info(" Refresh Token: Bearer {}", refreshToken);
                logger.info("==================================================");
            } else {
                logger.info("Admin user already exists. No new user created.");
            }
        };
    }


}
