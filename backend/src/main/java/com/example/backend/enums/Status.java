package com.example.backend.enums;

import lombok.Getter;

@Getter
public enum Status {

    FAILED("Failed"),
    PASSED("Passed"),
    ERROR("Error");

    private final String displayName;

    Status (String displayName) {
        this.displayName = displayName;
    }
}
