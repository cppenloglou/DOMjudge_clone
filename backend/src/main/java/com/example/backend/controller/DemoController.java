package com.example.backend.controller;


import com.example.backend.entity.Customer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class DemoController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello, Welcome to Spring security integration with JWT and Redis 2025.!";
    }

    @GetMapping("/customers")
    public List<Customer> demo() {
        Customer customer = Customer.builder().name("John Doe").age(20).email("john@doe.com").build();
        return List.of(customer);
    }

}