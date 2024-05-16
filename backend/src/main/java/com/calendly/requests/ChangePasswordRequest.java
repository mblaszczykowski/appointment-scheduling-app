package com.calendly.requests;

public record ChangePasswordRequest(String currentPassword, String newPassword, String retNewPassword) {
}
