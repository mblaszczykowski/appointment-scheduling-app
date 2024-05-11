package com.calendly.dtos;

import java.time.LocalDateTime;

public record AppointmentDTO(LocalDateTime startTime, LocalDateTime endTime, String bookerName, String bookerEmail) {
}
