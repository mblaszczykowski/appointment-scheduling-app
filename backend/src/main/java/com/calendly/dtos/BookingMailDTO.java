package com.calendly.dtos;

public record BookingMailDTO(String sendTo, String calendarUrl, String date, String bookerName) {}