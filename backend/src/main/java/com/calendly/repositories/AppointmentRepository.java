package com.calendly.repositories;

import com.calendly.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    @Query("SELECT a FROM Appointment a WHERE a.user.id = :userId AND a.startTime >= :startOfDay AND a.startTime < :endOfDay")
    List<Appointment> findByUserIdAndDate(Integer userId, LocalDateTime startOfDay, LocalDateTime endOfDay);
}
