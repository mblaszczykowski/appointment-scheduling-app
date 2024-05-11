package com.calendly.requests;

import java.time.LocalDate;

public record UserUpdateRequest(
        String firstname, String lastname, LocalDate birthDate
) {
}
