package com.calendly.email;

import com.calendly.dtos.BookingMailDTO;
import com.calendly.entities.PasswordResetToken;
import com.calendly.entities.User;
import com.calendly.repositories.TokenResetRepository;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Component
public class MailService {

    @Autowired
    JavaMailSender javaMailSender;
    @Autowired
    TokenResetRepository tokenResetRepository;
    @Value("${mail.baseUrl}")
    private String baseUrl;

    public String generateResetToken(User user) {
        UUID uuid = UUID.randomUUID();
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime expiryDateTime = currentDateTime.plusMinutes(60);
        PasswordResetToken existingToken = tokenResetRepository.findByUserEmail(user.getEmail());

        if (existingToken != null) {
            // Update the existing token
            existingToken.setToken(uuid.toString());
            existingToken.setExpiryDateTime(expiryDateTime);
        } else {
            // No existing token, create a new one
            existingToken = new PasswordResetToken();
            existingToken.setUser(user);
            existingToken.setToken(uuid.toString());
            existingToken.setExpiryDateTime(expiryDateTime);
        }

        tokenResetRepository.save(existingToken);
        return existingToken.getToken();
    }

    public void sendEmail(User user, String emailType, @Nullable String token) {
        String path;
        String subject;
        String actionText;

        switch (emailType.toLowerCase()) {
            case "activate":
                path = "/activate/";
                subject = "Account Activation Link";
                actionText = "activate your account";
                break;
            case "reset":
                path = "/reset-password/";
                subject = "Password Reset Link";
                actionText = "reset your password";
                token = generateResetToken(user);
                break;
            default:
                throw new IllegalArgumentException("Invalid email type");
        }

        String link = baseUrl + path + token;
        String messageBody = String.format("Hello,\n\nPlease click on this link to %s: %s.\n\nRegards,\nXYZ", actionText, link);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom("sender@gmail.com"); // Consider externalizing
        msg.setTo(user.getEmail());
        msg.setSubject(subject);
        msg.setText(messageBody);

        try {
            javaMailSender.send(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendEmail(BookingMailDTO bookingMailDTO, User calendarOwner, Boolean isBooker) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDateTime = LocalDateTime.parse(bookingMailDTO.date()).format(formatter);
        String body;
        SimpleMailMessage msg = new SimpleMailMessage();
        if (isBooker) {
            body = String.format("""
                            Hello, %s

                            Your meeting with %s will take place on %s CET at %s .

                            Regards,
                            Team Meetly""",
                    bookingMailDTO.bookerName(),
                    calendarOwner.getFullName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink());
            msg.setTo(bookingMailDTO.sendTo());
        }
        else {
            body =String.format("""
                            Hello, %s

                            You have a new meeting with %s on %s CET at %s .

                            You can see all your meetings here: http://localhost:3000/dashboard
                            Regards,
                            Team Meetly""",
                    calendarOwner.getFullName(),
                    bookingMailDTO.bookerName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink());
            msg.setTo(calendarOwner.getEmail());
        }

        msg.setFrom("meetly@gmail.com");
        msg.setSubject("Meeting confirmation");
        msg.setText(body);
        try {
            javaMailSender.send(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
