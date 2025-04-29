package com.example.backend.service;

import com.example.backend.dto.docker.DockerExecutionResult;
import com.example.backend.dto.docker.DockerExecutionDetails;
import com.example.backend.enums.Status;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Path;

@Service
public class DockerExecutorService {

    private final RestTemplate restTemplate;

    private static final Logger logger = LoggerFactory.getLogger(DockerExecutorService.class);

    @Value("${docker.executor.base-url}")
    private String baseUrl;

    public DockerExecutorService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public DockerExecutionResult executeInDocker(Path codePath, String language, Long problemId) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("problemID", problemId.toString());
            body.add("file", new FileSystemResource(codePath));

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<DockerExecutionResult> response = restTemplate.exchange(
                    getContainerUrl(language),
                    HttpMethod.POST,
                    requestEntity,
                    DockerExecutionResult.class
            );

            assert response.getBody() != null;
            ObjectMapper mapper = new ObjectMapper();
            mapper.enable(SerializationFeature.INDENT_OUTPUT);

            try {
                String prettyJson = mapper.writeValueAsString(response.getBody());
                logger.info("\n{}", prettyJson);
            } catch (Exception e) {
                logger.error("Failed to pretty print JSON", e);
            }


            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                return createErrorResult(problemId.toString(),
                        "Container returned status: " + response.getStatusCode());
            }
        } catch (Exception e) {
            logger.error(e.getMessage());
            return createErrorResult(problemId.toString(),
                    "Execution failed: " + e.getMessage());
        }
    }

    private String getContainerUrl(String language) {
        return baseUrl + ":" + getLanguagePort(language) + "/execute";
    }

    private String getLanguagePort(String language) {
        return switch (language.toLowerCase()) {
            case "cpp" -> "5001";
            case "python", "py" -> "5002";
            case "c" -> "5003";
            case "java" -> "5004";
            default -> "5004";
        };
    }

    private DockerExecutionResult createErrorResult(String problemId, String errorMessage) {
        return DockerExecutionResult.builder()
                .problemID(problemId)
                .status(Status.ERROR)
                .stdout("")
                .details(
                        DockerExecutionDetails.builder()
                        .message(errorMessage)
                        .testcaseIndex(-1)
                        .actualOutput("")
                        .expectedOutput("")
                        .build()
                )
                .stderr(errorMessage)
                .returncode(1)
                .build();

    }
}