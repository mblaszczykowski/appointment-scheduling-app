package com.calendly.controllers;

import com.calendly.dtos.AppointmentDTO;
import com.calendly.entities.Appointment;
import com.calendly.services.AppointmentService;
import com.calendly.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

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
        ResponseEntity<?> checkAuthorizationResult = userService.checkAuthorization(request);
        if (checkAuthorizationResult.getStatusCode() != HttpStatus.OK) {
            return checkAuthorizationResult;
        }

        if (appointmentDTO.startTime() == null || appointmentDTO.endTime() == null) {
            return new ResponseEntity<>("Invalid request parameters", HttpStatus.BAD_REQUEST);
        }

        int userId = userService.getUserIDFromAccessToken(request);

        appointmentService.createAppointment(
                userId,
                appointmentDTO.startTime(),
                appointmentDTO.endTime()
        );

        return new ResponseEntity<>("Post created successfully", HttpStatus.CREATED);
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
