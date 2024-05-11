package com.calendly.dtos;

import java.time.LocalDateTime;
import java.util.UUID;

public record AppointmentDTO(LocalDateTime startTime, LocalDateTime endTime, String bookerName, String bookerEmail) {
}
