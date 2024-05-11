package com.calendly.requests;

public record UserRegistrationRequest(
        String firstname, String lastname, String email, String password, Integer availableFromHour, Integer availableToHour, String availableDays
) {
}
