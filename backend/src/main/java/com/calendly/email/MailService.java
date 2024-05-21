package com.calendly.email;

import com.calendly.dtos.AppointmentDTO;
import com.calendly.entities.Appointment;
import com.calendly.entities.PasswordResetToken;
import com.calendly.entities.User;
import com.calendly.repositories.TokenResetRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;
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

    public void sendPasswordResetEmail(User user, String emailType) {
        String path;
        String subject;
        String actionText;
        String textBody;
        String htmlBody;

        if (emailType.equalsIgnoreCase("activate")) {
            path = "/activate/";
            subject = "Account Activation Link";
            actionText = "activate your account";
        } else if (emailType.equalsIgnoreCase("reset")) {
            path = "/reset-password/";
            var token = generateResetToken(user);
            String link = baseUrl + path + token;
            // dodac token do linka
            textBody = String.format("""
                        Hello, %s

                        We recently received a request to change your account password.\s
                        If you would like to change your password, please click the link below:
                        %s
                        

                        Regards,
                        Team Meetly""",
            user.getFullName(),
                    link);

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
                            <h1>Password Reset</h1>
                            <p>Hello, %s</p>
                            <p>We recently received a request to change your account password.<br>
                             If you would like to change your password, please click the link below:</p><br>
                             <a href="%s" class="button">Click here to change your password</a><br>
                            <p>Regards,<br /><strong>Team Meetly</strong></p>
                        </div>
                        </body>
                        </html>
                        """,
                    getCss(),
                    user.getFullName(),
                    link);

            try {
                MimeMessage message = javaMailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true);

                helper.setFrom("Meetly <app.meetly@gmail.com>");
                helper.setTo(user.getEmail());
                helper.setSubject("Password reset");
                helper.setText(textBody, htmlBody);

                javaMailSender.send(message);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Async
    public void sendEmail(AppointmentDTO appointmentDTO, User calendarOwner, Boolean isBooker) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDateTime = appointmentDTO.startTime().format(formatter);
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
                    appointmentDTO.bookerName(),
                    calendarOwner.getFullName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    appointmentDTO.meetingNote());

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
                    appointmentDTO.bookerName(),
                    calendarOwner.getFullName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    appointmentDTO.meetingNote());

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
                    appointmentDTO.bookerName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    appointmentDTO.meetingNote());

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
                    appointmentDTO.bookerName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink(),
                    appointmentDTO.meetingNote());
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("Meetly <app.meetly@gmail.com>");
            helper.setTo(isBooker ? appointmentDTO.bookerEmail() : calendarOwner.getEmail());
            helper.setSubject("Meeting confirmation");
            helper.setText(textBody, htmlBody);

            javaMailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Async
    public void sendCancelAppointmentEmail(Appointment appointment, User calendarOwner, Boolean isBooker) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        String formattedDateTime = appointment.getStartTime().format(formatter);
        String textBody;
        String htmlBody;

        if (isBooker) {
            textBody = String.format("""
                        Hello, %s

                        Your meeting with %s on %s CET at %s has been canceled.
                        

                        Regards,
                        Team Meetly""",
                    appointment.getBookerName(),
                    calendarOwner.getFullName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink());

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
                            <h1>Cancel Meeting Confirmation</h1>
                            <p>Hello, %s</p>
                            <p>Your meeting with <strong>%s</strong> on <strong>%s</strong> CET has been canceled.</p>
                            <p>Regards,<br /><strong>Team Meetly</strong></p>
                        </div>
                        </body>
                        </html>
                        """,
                    getCss(),
                    appointment.getBookerName(),
                    calendarOwner.getFullName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink());

        } else {
            textBody = String.format("""
                        Hello, %s
                        Your meeting with %s on %s CET at %s has been canceled.
                        

                        You can see all your meetings here: http://localhost:3000/dashboard
                        Regards,
                        Team Meetly""",
                    calendarOwner.getFullName(),
                    appointment.getBookerName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink());

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
                            <h1>Cancel Meeting Confirmation</h1>
                            <p>Hello, %s</p>
                            <p>Your meeting with <strong>%s</strong> on <strong>%s</strong> CET has been canceled</p>
                            <p>You can see all your meetings here: <a href="http://localhost:3000/dashboard" class="button">Dashboard</a></p>
                            <p>Regards,<br /><strong>Team Meetly</strong></p>
                        </div>
                        </body>
                        </html>
                        """,
                    getCss(),
                    calendarOwner.getFullName(),
                    appointment.getBookerName(),
                    formattedDateTime,
                    calendarOwner.getMeetingLink());
        }

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom("Meetly <app.meetly@gmail.com>");
            helper.setTo(isBooker ? appointment.getBookerEmail() : calendarOwner.getEmail());
            helper.setSubject("Cancel Meeting Confirmation");
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
