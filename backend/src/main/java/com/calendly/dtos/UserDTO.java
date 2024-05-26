package com.calendly.dtos;

public class UserDTO {
    private final Integer id;
    private final String firstname;
    private final String lastname;
    private final String email;
    private final String password;
    private final String calendarUrl;
    private final String meetingLink;
    private final Integer availableFromHour;
    private final Integer availableToHour;
    private final String availableDays;
    private final Integer meetingDuration;

    public UserDTO(Integer id, String firstname, String lastname,
                   String email, String password, String calendarUrl, String meetingLink,
                   Integer availableFromHour, Integer availableToHour, String availableDays, Integer meetingDuration) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.calendarUrl = calendarUrl;
        this.meetingLink = meetingLink;
        this.availableFromHour = availableFromHour;
        this.availableToHour = availableToHour;
        this.availableDays = availableDays;
        this.meetingDuration = meetingDuration;
    }

    public Integer getId() {
        return id;
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getCalendarUrl() {
        return calendarUrl;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public Integer getAvailableFromHour() {
        return availableFromHour;
    }

    public Integer getAvailableToHour() {
        return availableToHour;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public Integer getMeetingDuration() {
        return meetingDuration;
    }
}
