package com.calendly.dtos;

import java.util.UUID;

public record BookingDTO(UUID appointmentId, String bookerName, String bookerEmail) {
}
