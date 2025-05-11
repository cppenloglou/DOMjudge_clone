package com.example.backend.config;

import com.example.backend.dto.auth.RegisterDto;
import com.example.backend.entity.Problem;
import com.example.backend.entity.Submission;
import com.example.backend.entity.Team;
import com.example.backend.entity.User;
import com.example.backend.enums.Status;
import com.example.backend.repository.ProblemRepository;
import com.example.backend.repository.SubmissionRepository;
import com.example.backend.repository.TeamRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.JwtService;
import com.example.backend.service.UserService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Slf4j
@Configuration
public class InitializeConfig {

    @Bean
    public CommandLineRunner createTempUser(UserService userService, JwtService jwtService,
            UserRepository userRepository) {
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
                String message = " TEMP USER CREATED FOR DEBUGGING ";
                String userpassword = "password";

                logAuthenticationSummary(message, tempEmail, userpassword, token, refreshToken);
            } else {
                log.info("Temp user already exists. No new user created.");
            }
        };
    }

    @Bean
    public CommandLineRunner createAdminUser(UserService userService, JwtService jwtService,
            UserRepository userRepository, TeamRepository teamRepository) {
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

                // Assign the "ADMIN" role to the user (You may need to modify your user entity
                // and service for this)
                adminUser.setRoles(List.of("ROLE_ADMIN")); // Assuming you have a setRoles method

                // Save the user with roles
                userRepository.save(adminUser);

                String token = jwtService.generateJwtToken(adminUser.getUsername());
                String refreshToken = jwtService.generateJwtToken(adminUser.getUsername());
                String message = " ADMIN USER CREATED FOR DEBUGGING ";
                String adminpassword = "adminpassword";

                logAuthenticationSummary(message, adminEmail, adminpassword, token, refreshToken);
            } else {
                log.info("Admin user already exists. No new user created.");
            }
        };
    }

    @Bean
    @Order(1)
    CommandLineRunner initProblems(ProblemRepository problemRepository) {
        return args -> {
            if (problemRepository.count() == 0) {
                ObjectMapper mapper = new ObjectMapper();
                InputStream inputStream = new ClassPathResource("problems.json").getInputStream();

                List<Problem> problems = mapper.readValue(inputStream, new TypeReference<>() {});

                // Convert filePath strings to Path objects
                problems.forEach(problem -> {
                    if (problem.getFilePathDB() != null) {
                        problem.setFilePath(Path.of(problem.getFilePathDB()));
                    }
                });

                problemRepository.saveAll(problems);
                System.out.println("Initialized " + problems.size() + " problems");
            }
        };
    }

    @Bean
    @Order(2)
    public CommandLineRunner createTempUsers(UserService userService, JwtService jwtService,
            UserRepository userRepository, TeamRepository teamRepository,
            ProblemRepository problemRepository, SubmissionRepository submissionRepository) {
        return args -> {
            // Create 10 temporary users and teams with submissions
            List<Problem> problems = problemRepository.findAll();
            if (problems.isEmpty()) {
                log.warn("No problems found in the database, skipping temp user submissions creation");
                return;
            }

            Random random = new Random();

            for (int i = 1; i <= 10; i++) {
                String tempEmail = "tempuser" + i + "@example.com";

                if (userRepository.findByUsername(tempEmail).isEmpty()) {
                    // Create new user and team
                    RegisterDto registerDto = RegisterDto.builder()
                            .email(tempEmail)
                            .password("password") // plain password for registration
                            .teamName("Team " + i)
                            .university("University " + i)
                            .members("Member " + i + "-1, Member " + i + "-2")
                            .build();

                    // Register the user and team
                    userService.register(registerDto);

                    // Fetch the user again to get the team
                    User tempUser = userRepository.findByUsername(tempEmail).orElseThrow();
                    Team team = tempUser.getTeam();

                    log.info("Created temp user {} with team {}", tempUser.getUsername(), team.getName());

                    // Create 3-7 random submissions per team
                    int numSubmissions = 3 + random.nextInt(5); // Between 3 and 7 submissions

                    // Keep track of which problems this team has already solved
                    java.util.Set<Long> solvedProblems = new java.util.HashSet<>();

                    for (int j = 0; j < numSubmissions; j++) {
                        // Select a random problem
                        Problem problem = problems.get(random.nextInt(problems.size()));

                        // Randomize status (bias toward successful submissions)
                        Status status = random.nextDouble() > 0.3 ? Status.PASSED : Status.FAILED;

                        // Create timestamp with slight variation
                        Instant timestamp = Instant.now().minusSeconds(random.nextInt(3600)); // Within the last hour

                        // Create submission with random values
                        int testcasesPassed = status == Status.PASSED ? problem.getTestcases()
                                : random.nextInt(problem.getTestcases());
                        double avgTime = ThreadLocalRandom.current().nextDouble(100, 500); // Random time between 100ms
                                                                                           // and 500ms

                        Submission submission = Submission.builder()
                                .team(team)
                                .problem(problem)
                                .status(status)
                                .testcasesPassed(testcasesPassed)
                                .avgTime(avgTime)
                                .timestamp(timestamp)
                                .build();

                        submissionRepository.save(submission);

                        // Update team's problemsSolved count if this is a passed submission and not
                        // already solved
                        if (status == Status.PASSED && !solvedProblems.contains(problem.getId())) {
                            solvedProblems.add(problem.getId());
                            team.setProblemsSolved(team.getProblemsSolved() + 1);
                            teamRepository.save(team);
                        }
                    }

                    log.info("Created {} submissions for team {}", numSubmissions, team.getName());
                } else {
                    log.info("Temp user {} already exists. Skipping.", tempEmail);
                }
            }

            log.info("======================================");
            log.info(" CREATED 10 TEMP USERS WITH SUBMISSIONS ");
            log.info("======================================");
        };
    }

    private static void logAuthenticationSummary(String message, String email, String password, String token,
            String refreshToken) {
        log.info("==================================================");
        log.info(message);
        log.info(" Email: {}", email);
        log.info(" Password: {}", password);
        log.info(" Access Token: Bearer {}", token);
        log.info(" Refresh Token: Bearer {}", refreshToken);
        log.info("==================================================");
    }
}
