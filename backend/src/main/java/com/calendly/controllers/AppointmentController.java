package com.calendly.controllers;

import com.calendly.dtos.AppointmentDTO;
import com.calendly.email.MailService;
import com.calendly.entities.Appointment;
import com.calendly.services.AppointmentService;
import com.calendly.services.UserService;
import jakarta.annotation.Nullable;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;
    private final MailService mailService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, UserService userService, MailService mailService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
        this.mailService = mailService;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO) {
        // we allow anonymous users to create appointments

        if (appointmentDTO.startTime() == null || appointmentDTO.endTime() == null
                || userService.isNullOrEmpty(appointmentDTO.bookerName()) || userService.isNullOrEmpty(appointmentDTO.bookerEmail())
                || appointmentDTO.startTime().isAfter(appointmentDTO.endTime()) || userService.isNullOrEmpty(appointmentDTO.calendarUrl())) {
            return new ResponseEntity<>("Invalid request parameters", HttpStatus.BAD_REQUEST);
        }

        // TODO: check if this date is not already booked
        // w przyszlosci mozna by najpierw potwierdzic mailem spotkanie i dopiero je zabookować

        var user = userService.getUserIdFromCalendarUrl(appointmentDTO.calendarUrl());

        appointmentService.createAppointment(
                user.getId(),
                appointmentDTO.startTime(),
                appointmentDTO.endTime(),
                appointmentDTO.bookerName(),
                appointmentDTO.bookerEmail(),
                appointmentDTO.meetingNote(),
                appointmentDTO.isActual()
        );
        var appointmentId = appointmentService.getAppointmentByUserAndDate(user.getId(), appointmentDTO.startTime(), appointmentDTO.endTime()).getId();
        var appointment = appointmentService.getAppointmentById(appointmentId);
        mailService.sendEmail(appointment, user, false);
        mailService.sendEmail(appointment, user, true);

        return new ResponseEntity<>("Appointment created successfully", HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAppointmentsByUserIdAndDate(
            @PathVariable Integer userId,
            @RequestParam @Nullable String date,
            HttpServletRequest request) {
        try {
            List<Appointment> appointments;
            if (date != null) {
                LocalDate localDate = LocalDate.parse(date);
                appointments = appointmentService.getAppointmentsByUserIdAndDate(userId, localDate);
            } else {
                ResponseEntity<?> authResponse = appointmentService.checkAuthorization(request);
                if (!authResponse.getStatusCode().is2xxSuccessful()) {
                    return authResponse;
                }
                appointments = appointmentService.getAppointmentsByUserId(userId);
            }
            Map<String, Object> response = new HashMap<>();
            response.put("appointments", appointments);
            response.put("username", userService.getUserById(userId).getFirstname());
            return ResponseEntity.ok(response);
        } catch (DateTimeParseException e) {
            LoggerFactory.getLogger(this.getClass()).error("Invalid date format: " + date, e);
            return ResponseEntity.badRequest().body("Invalid date format");
        } catch (Exception e) {
            LoggerFactory.getLogger(this.getClass()).error("Error fetching appointments", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while fetching appointments");
        }
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer id, HttpServletRequest request) {
        ResponseEntity<?> authResponse = appointmentService.checkAuthorization(request);
        if (!authResponse.getStatusCode().is2xxSuccessful()) {
            return authResponse;
        }
        try {
            appointmentService.cancelAppointment(id);
            var appointment = appointmentService.getAppointmentById(id);
            var user = userService.getUserById(appointment.getUser().getId());
            mailService.sendCancelAppointmentEmail(appointment, user, true);
            mailService.sendCancelAppointmentEmail(appointment, user, false);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/cancelMeeting/{token}")
    public ResponseEntity<?> cancelAppointmentFromMail(@PathVariable String token, HttpServletRequest request) {
        try {
            var appointmentId = appointmentService.getAppointmentIdByToken(token);
            appointmentService.cancelAppointment(appointmentId);
            var appointment = appointmentService.getAppointmentById(appointmentId);
            var user = userService.getUserById(appointment.getUser().getId());
            mailService.sendCancelAppointmentEmail(appointment, user, true);
            mailService.sendCancelAppointmentEmail(appointment, user, false);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Integer id, HttpServletRequest request) {
        ResponseEntity<?> authResponse = appointmentService.checkAuthorization(request);
        if (!authResponse.getStatusCode().is2xxSuccessful()) {
            return authResponse;
        }
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
