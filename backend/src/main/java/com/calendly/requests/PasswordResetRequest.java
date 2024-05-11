package com.calendly.requests;

public record PasswordResetRequest(String password, String retPassword) {
}
