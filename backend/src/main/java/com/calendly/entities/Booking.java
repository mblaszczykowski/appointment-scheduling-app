package com.calendly.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "appointment_id", referencedColumnName = "id")
    private Appointment appointment;

    @Column(nullable = false)
    private String bookerName;

    @Column(nullable = false)
    private String bookerEmail;

    @Column(nullable = true)
    private LocalDateTime bookedAt = LocalDateTime.now();

    public Booking() {
    }

    public Booking(Appointment appointment, String bookerName, String bookerEmail) {
        this.appointment = appointment;
        this.bookerName = bookerName;
        this.bookerEmail = bookerEmail;
    }

    public Integer getId() {
        return id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }

    public String getBookerName() {
        return bookerName;
    }

    public void setBookerName(String bookerName) {
        this.bookerName = bookerName;
    }

    public String getBookerEmail() {
        return bookerEmail;
    }

    public void setBookerEmail(String bookerEmail) {
        this.bookerEmail = bookerEmail;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }
}
