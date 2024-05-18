package com.calendly.email;

import com.calendly.dtos.BookingMailDTO;
import com.calendly.entities.PasswordResetToken;
import com.calendly.entities.User;
import com.calendly.repositories.TokenResetRepository;
import jakarta.annotation.Nullable;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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
        String textBody;
        String htmlBody;

        if (isBooker) {
            textBody = String.format("""
                        Hello, %s

                        Your meeting with %s will take place on %s CET at %s.
                        
                        Meeting note:
                        %s

                        Regards,
                        Team Meetly""",
                    bookingMailDTO.bookerName(),
                    calendarOwner.getFullName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    bookingMailDTO.meetingNote());

            htmlBody = String.format("""
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <style type="text/css">
                        %s
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h1>Meeting Confirmation</h1>
                            <p>Hello, %s</p>
                            <p>Your meeting with <strong>%s</strong> will take place on <strong>%s</strong> CET at <a href="%s" class="button">this link</a></p>
                            <p><strong>Meeting note:</strong><br />%s</p>
                            <p>Regards,<br /><strong>Team Meetly</strong></p>
                        </div>
                        </body>
                        </html>
                        """,
                    getCss(),
                    bookingMailDTO.bookerName(),
                    calendarOwner.getFullName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    bookingMailDTO.meetingNote());

        } else {
            textBody = String.format("""
                        Hello, %s

                        You have a new meeting with %s on %s CET at %s.
                        
                        Meeting note:
                        %s

                        You can see all your meetings here: http://localhost:3000/dashboard
                        Regards,
                        Team Meetly""",
                    calendarOwner.getFullName(),
                    bookingMailDTO.bookerName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    bookingMailDTO.meetingNote());

            htmlBody = String.format("""
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <style type="text/css">
                        %s
                        </style>
                        </head>
                        <body>
                        <div class="container">
                            <h1>New Meeting Notification</h1>
                            <p>Hello, %s</p>
                            <p>You have a new meeting with <strong>%s</strong> on <strong>%s</strong> CET at <a href="%s" class="button">this link</a></p>
                            <p><strong>Meeting note:</strong><br />%s</p>
                            <p>You can see all your meetings here: <a href="http://localhost:3000/dashboard" class="button">Dashboard</a></p>
                            <p>Regards,<br /><strong>Team Meetly</strong></p>
                        </div>
                        </body>
                        </html>
                        """,
                    getCss(),
                    calendarOwner.getFullName(),
                    bookingMailDTO.bookerName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    bookingMailDTO.meetingNote());
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("Meetly <app.meetly@gmail.com>");
            helper.setTo(isBooker ? bookingMailDTO.sendTo() : calendarOwner.getEmail());
            helper.setSubject("Meeting confirmation");
            helper.setText(textBody, htmlBody);

            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public String getCss() {
        return """
                body {
                    font-family: 'Poppins', sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                h1 {
                    font-size: 24px;
                    color: #3b82f6;
                    text-align: left;
                }
                p {
                    font-size: 16px;
                    line-height: 1.5;
                    margin-bottom: 20px;
                }
                a.button {
                    display: inline-block;
                    padding: 8px 16px;
                    font-size: 16px;
                    color: #fff;
                    background-color: #3b82f6;
                    text-decoration: none;
                    border-radius: 5px;
                    text-align: center;
                }
                """;
    }
}
