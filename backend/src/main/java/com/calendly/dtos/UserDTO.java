package com.calendly.dtos;

public class UserDTO {
    private final Integer id;
    private final String firstname;
    private final String lastname;
    private final String email;
    private final String password;
    private final String calendarUrl;
    private final Integer availableFromHour;
    private final Integer availableToHour;
    private final String availableDays;

    public UserDTO(Integer id, String firstname, String lastname,
                   String email, String password, String calendarUrl,
                   Integer availableFromHour, Integer availableToHour, String availableDays) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.calendarUrl = calendarUrl;
        this.availableFromHour = availableFromHour;
        this.availableToHour = availableToHour;
        this.availableDays = availableDays;
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

    public Integer getAvailableFromHour() {
        return availableFromHour;
    }

    public Integer getAvailableToHour() {
        return availableToHour;
    }

    public String getAvailableDays() {
        return availableDays;
    }

}
