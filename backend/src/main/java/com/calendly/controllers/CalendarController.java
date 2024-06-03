package com.calendly.controllers;

import com.calendly.dtos.AppointmentDTO;
import com.calendly.email.MailService;
import com.calendly.entities.Appointment;
import com.calendly.entities.User;
import com.calendly.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/calendar")
public class CalendarController {

    @Autowired
    private UserService userService;
    private MailService mailService;

    @GetMapping("/{calendarUrl}")
    public ResponseEntity<?> getUserByCalendarUrl(@PathVariable("calendarUrl") String calendarUrl) {
        User user = userService.getUserIdFromCalendarUrl(calendarUrl);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(user);
    }

    @PostMapping("/booking-confirmation")
    public ResponseEntity<?> bookingConfirmation(@RequestBody AppointmentDTO appointmentDTO) {
        var calendarOwner = userService.getUserIdFromCalendarUrl(appointmentDTO.calendarUrl());
        Appointment appointment = new Appointment();
        try {
            mailService.sendEmail(appointment, calendarOwner, false);
            mailService.sendEmail(appointment, calendarOwner, true);
            return ResponseEntity.ok().build();
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
