package com.example.backend.config;

import com.example.backend.entity.Problem;
import com.example.backend.repository.ProblemRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.nio.file.Path;
import java.util.List;

@Configuration
public class ProblemInitializer {

    @Bean
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
}