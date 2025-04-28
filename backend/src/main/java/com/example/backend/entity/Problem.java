package com.example.backend.entity;

import com.example.backend.enums.Difficulty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.nio.file.Path;
import java.nio.file.Paths;

@Getter
@Setter
@Entity
@Table(name = "problem")
public class Problem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private String name;

    private transient Path filePath; // Transient to exclude from JPA

    private String filePathDB; // Store the actual path as String in DB

    private int testcases;

    @PostLoad
    private void postLoad() {
        this.filePath = Paths.get(filePathDB);
    }

    @PrePersist
    @PreUpdate
    private void prePersist() {
        this.filePathDB = filePath != null ? filePath.toString() : null;
    }

}