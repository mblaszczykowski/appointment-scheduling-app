package com.calendly.services;

import com.calendly.entities.Appointment;
import com.calendly.entities.Booking;
import com.calendly.repositories.AppointmentRepository;
import com.calendly.repositories.BookingRepository;
import com.calendly.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final AppointmentRepository appointmentRepository;

    @Autowired
    private UserService userService;  // Assuming UserService provides checkAuthorization method

    @Autowired
    public BookingService(BookingRepository bookingRepository, AppointmentRepository appointmentRepository) {
        this.bookingRepository = bookingRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Booking createBooking(UUID appointmentId, String bookerName, String bookerEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        Booking booking = new Booking(appointment, bookerName, bookerEmail);
        return bookingRepository.save(booking);
    }

    public Optional<Booking> findBookingById(UUID bookingId) {
        return bookingRepository.findById(bookingId);
    }

    public void deleteBooking(UUID bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    public ResponseEntity<?> checkAuthorization(HttpServletRequest request) {
        return userService.checkAuthorization(request);
    }
}
