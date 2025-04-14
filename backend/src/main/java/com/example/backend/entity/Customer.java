package com.example.backend.entity;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Customer {
    private long id;
    private String name;
    private int age;
    private String email;
}