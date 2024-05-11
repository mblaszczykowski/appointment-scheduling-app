package com.calendly.controllers;

import com.calendly.dtos.BookingDTO;
import com.calendly.entities.Booking;
import com.calendly.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    @Autowired
    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingDTO bookingDTO, HttpServletRequest request) {
        // moze anonimowy uzytkownik utworzyc booking wiec tutaj bez autoryzacji uzytkownika
        /*
        ResponseEntity<?> authResponse = bookingService.checkAuthorization(request);
        if (authResponse.getStatusCode() != HttpStatus.OK) {
            return authResponse;
        }
        */

        if (bookingDTO.appointmentId() == null || bookingDTO.bookerName() == null || bookingDTO.bookerEmail() == null) {
            // check if appointment with this id exists and if its not already booked

            return new ResponseEntity<>("Invalid request parameters", HttpStatus.BAD_REQUEST);
        }

        Booking booking = bookingService.createBooking(
                bookingDTO.appointmentId(),
                bookingDTO.bookerName(),
                bookingDTO.bookerEmail()
        );
        return new ResponseEntity<>("Booking created successfully", HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable UUID id, HttpServletRequest request) {
        ResponseEntity<?> authResponse = bookingService.checkAuthorization(request);
        if (!authResponse.getStatusCode().is2xxSuccessful()) {
            return authResponse;
        }
        bookingService.deleteBooking(id);
        return ResponseEntity.ok().build();
    }
}
