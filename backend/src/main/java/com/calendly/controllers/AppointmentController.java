package com.calendly.controllers;

import com.calendly.dtos.AppointmentDTO;
import com.calendly.entities.Appointment;
import com.calendly.services.AppointmentService;
import com.calendly.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserService userService;

    @Autowired
    public AppointmentController(AppointmentService appointmentService, UserService userService) {
        this.appointmentService = appointmentService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO appointmentDTO, HttpServletRequest request) {
        // we allow anonymous users to create appointments
        /*
        ResponseEntity<?> checkAuthorizationResult = userService.checkAuthorization(request);
        if (checkAuthorizationResult.getStatusCode() != HttpStatus.OK) {
            return checkAuthorizationResult;
        }
        */

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
                appointmentDTO.bookerEmail()
        );

        return new ResponseEntity<>("Appointment created successfully", HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAppointmentsByUserId(@PathVariable Integer userId, HttpServletRequest request) {
        ResponseEntity<?> authResponse = appointmentService.checkAuthorization(request);
        if (!authResponse.getStatusCode().is2xxSuccessful()) {
            return authResponse;
        }
        List<Appointment> appointments = appointmentService.getAppointmentsByUserId(userId);
        return ResponseEntity.ok(appointments);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable UUID id, HttpServletRequest request) {
        ResponseEntity<?> authResponse = appointmentService.checkAuthorization(request);
        if (!authResponse.getStatusCode().is2xxSuccessful()) {
            return authResponse;
        }
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
