package com.calendly.requests;

public record UserUpdateRequest(
        String firstname, String lastname, String email, String password,
        String calendarUrl, Integer availableFromHour, Integer availableToHour, String availableDays
) {
}
