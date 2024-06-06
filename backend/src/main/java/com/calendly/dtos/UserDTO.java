package com.calendly.dtos;

public record UserDTO(Integer id, String firstname, String lastname, String email, String password, String calendarUrl,
                      String meetingLink, Integer availableFromHour, Integer availableToHour, String availableDays,
                      Integer meetingDuration, String profilePicture) {
}
