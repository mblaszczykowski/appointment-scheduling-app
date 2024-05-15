package com.calendly.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "users", uniqueConstraints = {
        @UniqueConstraint(
                name = "user_email_unique",
                columnNames = "email"
        )
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Integer id;

    @Column(name = "firstName", nullable = false)
    private String firstname;

    @Column(name = "lastName", nullable = false)
    private String lastname;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "calendarUrl", nullable = false)
    private String calendarUrl;

    @Column(name = "meetingLink", nullable = false)
    private String meetingLink;

    @Column(name = "isActive", nullable = false, columnDefinition = "boolean default false")
    private boolean isActive;

    // Available hours
    @Column(name = "availableFromHour", nullable = false)
    private Integer availableFromHour;

    @Column(name = "availableToHour", nullable = false)
    private Integer availableToHour;

    // Available days
    @Column(name = "availableDays", nullable = false)
    private String availableDays;  // Example: "Monday,Tuesday,Wednesday"

    public User() {
    }

    public User(String firstname, String lastname, String email, String password, String calendarUrl, String meetingLink, Integer availableFromHour, Integer availableToHour, String availableDays) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.calendarUrl = calendarUrl;
        this.meetingLink = meetingLink;
        this.availableFromHour = availableFromHour;
        this.availableToHour = availableToHour;
        this.availableDays = availableDays;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isActive() {
        return isActive;
    }

    public String getCalendarUrl() {
        return calendarUrl;
    }

    public void setCalendarUrl(String calendarUrl) {
        this.calendarUrl = calendarUrl;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Integer getAvailableFromHour() {
        return availableFromHour;
    }

    public void setAvailableFromHour(Integer availableFromHour) {
        this.availableFromHour = availableFromHour;
    }

    public Integer getAvailableToHour() {
        return availableToHour;
    }

    public void setAvailableToHour(Integer availableToHour) {
        this.availableToHour = availableToHour;
    }

    public String getAvailableDays() {
        return availableDays;
    }

    public void setAvailableDays(String availableDays) {
        this.availableDays = availableDays;
    }

    public String getMeetingLink() {return meetingLink;}

    public void setMeetingLink(String meetingLink) {this.meetingLink = meetingLink;}
}
