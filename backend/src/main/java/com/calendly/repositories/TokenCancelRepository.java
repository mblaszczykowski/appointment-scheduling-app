package com.calendly.repositories;
import com.calendly.entities.CancelMeetingToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TokenCancelRepository extends JpaRepository<CancelMeetingToken, Integer> {
    CancelMeetingToken findByAppointmentId(Integer appointmentId);


    @Query("SELECT a.appointment.id FROM CancelMeetingToken a WHERE a.token = :token")
    Integer findAppointmentIdByToken(@Param("token")String token);

}