package com.calendly.dtos;

public class UserDTO {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private String calendarUrl;
    private Integer availableFromHour;
    private Integer availableToHour;
    private String availableDays;

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
    public String getPassword() { return password; }
    public String getCalendarUrl() { return calendarUrl; }
    public Integer getAvailableFromHour() { return availableFromHour; }
    public Integer getAvailableToHour() { return availableToHour; }
    public String getAvailableDays() { return availableDays; }

}
