package com.calendly;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class Calendly {

    public static void main(String[] args) {
        SpringApplication.run(Calendly.class, args);
    }

}
