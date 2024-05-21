package com.calendly.daos;

import com.calendly.entities.Appointment;
import com.calendly.repositories.AppointmentRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class AppointmentDAO {
    private final AppointmentRepository appointmentRepository;

    public AppointmentDAO(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Optional<Appointment> getAppointmentById(Integer id) {
        return appointmentRepository.findById(id);
    }
}
