package com.calendly.services;

import com.calendly.entities.Appointment;
import com.calendly.entities.User;
import com.calendly.repositories.AppointmentRepository;
import com.calendly.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    @Autowired
    private UserService userService;

    @Autowired
    public AppointmentService(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    public Appointment createAppointment(Integer userId, LocalDateTime start, LocalDateTime end, String bookerName, String bookerEmail) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        Appointment appointment = new Appointment(user, start, end, bookerName, bookerEmail);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByUserIdAndDate(Integer userId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return appointmentRepository.findByUserIdAndDate(userId, startOfDay, endOfDay);
    }
    public List<Appointment> getAppointmentsByUserId(Integer userId) {
        return appointmentRepository.findAll().stream()
                .filter(appointment -> appointment.getUser().getId().equals(userId))
                .collect(Collectors.toList());
    }

    public void deleteAppointment(UUID appointmentId) {
        appointmentRepository.deleteById(appointmentId);
    }

    public ResponseEntity<?> checkAuthorization(HttpServletRequest request) {
        return userService.checkAuthorization(request);
    }
}
