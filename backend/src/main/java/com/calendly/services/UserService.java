package com.calendly.services;

import com.calendly.daos.UserDAO;
import com.calendly.dtos.UserDTO;
import com.calendly.email.MailService;
import com.calendly.entities.User;
import com.calendly.exception.ApiError;
import com.calendly.exception.ResourceNotFoundException;
import com.calendly.repositories.TokenResetRepository;
import com.calendly.repositories.UserRepository;
import com.calendly.requests.ChangePasswordRequest;
import com.calendly.requests.UserRegistrationRequest;
import com.calendly.requests.UserUpdateRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.function.Consumer;
import java.util.regex.Pattern;

import static com.calendly.services.TokenService.EXPIRATION_TIME_ACCESS;
import static com.calendly.services.TokenService.generateToken;

@Service
public class UserService {
    private final UserDAO userDAO;
    private final String imageBasePath = "src/main/resources/media/prof-pic/";

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    TokenResetRepository tokenResetRepository;

    @Autowired
    MailService mailService;
    @Autowired
    TokenService tokenService;

    @Autowired
    public UserService(UserDAO userDAO) {
        this.userDAO = userDAO;
    }

    public List<User> getAllUsers() {
        return userDAO.getAllUsers();
    }

    public User getUserById(Integer id) {
        return userDAO.getUserById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer with id [%s] not found".formatted(id))
                );
    }

    public User getUserByEmail(String email) {
        return userDAO.getUserByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer with email [%s] not found".formatted(email))
                );
    }

    private ResponseEntity<?> checkEmailExists(String email) {
        if (userDAO.existsUserWithEmail(email)) {
            ApiError error = new ApiError("Validation", "email", "Email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        return ResponseEntity.ok("Email checked.");
    }

    public ResponseEntity<?> passwordValidator(String password, String retPassword) {
        if (password.length() < 8 || password.length() > 32) {
            ApiError error = new ApiError("Validation", "password", "Password length should be between 8 and 32 characters");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (!password.matches(".*[a-z].*")) {
            ApiError error = new ApiError("Validation", "password", "Password should contain at least one lowercase letter");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (!password.matches(".*[A-Z].*")) {
            ApiError error = new ApiError("Validation", "password", "Password should contain at least one uppercase letter");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
            ApiError error = new ApiError("Validation", "password", "Password should contain at least one special character");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (!password.matches(".*\\d.*")) {
            ApiError error = new ApiError("Validation", "password", "Password should contain at least one digit");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (password.contains(" ")) {
            ApiError error = new ApiError("Validation", "password", "Password should not contain spaces");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (!password.equals(retPassword)) {
            ApiError error = new ApiError("Validation", "retPassword", "Invalid retPassword");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        return ResponseEntity.ok("password is approved.");
    }

    private ResponseEntity<?> checkFullName(String firstname, String lastname) {
        if (firstname.length() > 50) {
            ApiError error = new ApiError("Validation", "firstname", "Invalid firstname");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        if (lastname.length() > 50) {
            ApiError error = new ApiError("Validation", "lastname", "Invalid lastname");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        return ResponseEntity.ok("fullname checked.");
    }

    public ResponseEntity<?> addUser(UserRegistrationRequest userRegistrationRequest) {
        final String regexPattern = "^(?=.{1,64}@)[A-Za-z0-9_-]+(\\.[A-Za-z0-9_-]+)*@"
                + "[^-][A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[A-Za-z]{2,})$";
        if (isNullOrEmpty(userRegistrationRequest.firstname()) ||
                isNullOrEmpty(userRegistrationRequest.lastname()) ||
                isNullOrEmpty(userRegistrationRequest.email()) ||
                isNullOrEmpty(userRegistrationRequest.password()) ||
                isNullOrEmpty(userRegistrationRequest.calendarUrl()) ||
                userRegistrationRequest.availableFromHour() == null ||
                userRegistrationRequest.availableToHour() == null ||
                isNullOrEmpty(userRegistrationRequest.availableDays())) {
            ApiError error = new ApiError("Validation", null, "Missing data");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        String firstname = userRegistrationRequest.firstname();
        String lastname = userRegistrationRequest.lastname();
        String email = userRegistrationRequest.email();
        String password = userRegistrationRequest.password();

        if (!checkEmailValid(email, regexPattern) || email.length() > 255) {
            ApiError error = new ApiError("Validation", "email", "Invalid email");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        ResponseEntity<?> checkFullNameResult = checkFullName(firstname, lastname);
        if (checkFullNameResult.getStatusCode() != HttpStatus.OK) {
            return checkFullNameResult;
        }
        ResponseEntity<?> checkEmailExistsResult = checkEmailExists(email);
        if (checkEmailExistsResult.getStatusCode() != HttpStatus.OK) {
            return checkEmailExistsResult;
        }

        // dodac dla pozostalych pól sprawdzenia
        // szczegolnie sprawdzic czy nie ma nikt linka takiego jak podany, jak tak to trzeba ladny error wyswietlic na froncie zeby link zostal zmieniony, bez przkierowania ani wywalania, trzeba na froncie to obsluzyc

        //Encrypting password
        String generatedSecuredPasswordHash = BCrypt.hashpw(password, BCrypt.gensalt(12));
        User user = new User(firstname,
                lastname,
                email,
                generatedSecuredPasswordHash,
                userRegistrationRequest.calendarUrl(),
                userRegistrationRequest.meetingLink(),
                userRegistrationRequest.availableFromHour(),
                userRegistrationRequest.availableToHour(),
                userRegistrationRequest.availableDays());
        userDAO.addUser(user);

        // logujemy od razu poki co po rejestracji, bez aktywacji
        String accessToken = generateToken(EXPIRATION_TIME_ACCESS, user.getId());
        return ResponseEntity.ok(accessToken);
    }

    public boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public void deleteUser(Integer id) {
        User user = userDAO.getUserById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer with id [%s] not found".formatted(id))
                );

        userDAO.deleteUser(user);
    }

    private boolean checkEmailValid(String email, String emailRegex) {
        return Pattern.compile(emailRegex)
                .matcher(email)
                .matches();
    }

    public ResponseEntity<?> updateUser(Integer uuid, UserUpdateRequest userUpdateRequest, HttpServletRequest request) {
        ResponseEntity<?> checkAuthorizationResult = checkAuthorization(request);
        if (checkAuthorizationResult.getStatusCode() != HttpStatus.OK) {
            return checkAuthorizationResult;
        }
        User user = userDAO.getUserById(uuid)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer with id [%s] not found".formatted(uuid))
                );
        updateIfNotNull(user::setFirstname, userUpdateRequest.firstname());
        updateIfNotNull(user::setLastname, userUpdateRequest.lastname());
        updateIfNotNull(user::setEmail, userUpdateRequest.email());
        updateIfNotNull(user::setCalendarUrl, userUpdateRequest.calendarUrl());
        updateIfNotNull(user::setAvailableFromHour, userUpdateRequest.availableFromHour());
        updateIfNotNull(user::setAvailableToHour, userUpdateRequest.availableToHour());
        updateIfNotNull(user::setAvailableDays, userUpdateRequest.availableDays());

        userDAO.updateUser(user);
        return ResponseEntity.ok("User updated successfully");
    }

    private <T> void updateIfNotNull(Consumer<T> setter, T value) {
        if (value != null) {
            setter.accept(value);
        }
    }


    public boolean hasExpired(LocalDateTime expiryDateTime) {
        LocalDateTime currentDateTime = LocalDateTime.now();
        return expiryDateTime.isAfter(currentDateTime);
    }


    public ResponseEntity<?> activationEmail(String refreshToken, TokenService tokenService, UserService userDetailsService, HttpServletRequest request) {
        ResponseEntity<?> checkAuthorizationResult = checkAuthorization(request);
        if (checkAuthorizationResult.getStatusCode() != HttpStatus.OK) {
            return checkAuthorizationResult;
        }
        // Token is valid, proceed to activate and send email
        User user = userDetailsService.getUserById(tokenService.getUserIdFromToken(refreshToken));
        mailService.sendEmail(user, "activate", refreshToken);
        return ResponseEntity.ok("Activation successful.");
    }

    public ResponseEntity<?> activateUser(String token, TokenService tokenService, UserService userDetailsService, UserRepository userRepository) {
        if (tokenService.isTokenExpired(token))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired");
        try {
            User user = userDetailsService.getUserById(tokenService.getUserIdFromToken(token));
            if (user.isActive())
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User already activated");
            user.setActive(true);
            userRepository.save(user);
            return ResponseEntity.ok("Account activated successfully.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Invalid token: User not found");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }


    public ResponseEntity<?> changePassword(Integer userId, ChangePasswordRequest changePasswordRequest) {
        User user = getUserById(userId);
        String currentPassword = changePasswordRequest.currentPassword();
        String newPassword = changePasswordRequest.newPassword();
        String retNewPassword = changePasswordRequest.retNewPassword();
        if (!BCrypt.checkpw(currentPassword, user.getPassword())) {
            ApiError error = new ApiError("Validation", "Password", "Invalid password");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        ResponseEntity<?> passwordValidationResult = passwordValidator(newPassword, retNewPassword);
        if (passwordValidationResult.getStatusCode() != HttpStatus.OK) {
            return passwordValidationResult;
        }
        String hashedNewPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt(12));
        user.setPassword(hashedNewPassword);
        userDAO.updateUser(user);
        tokenService.deleteAllTokens(userId);
        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> checkAuthorization(HttpServletRequest request) {
        if (checkAuthorizationHeader(request)) {
            try {
                if (checkLoggedUser(request)) {
                    return ResponseEntity.ok("Account logged in successfully.");
                } else {
                    ApiError error = new ApiError("Access", null, "Login failed");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
                }
            } catch (Exception e) {
                ApiError error = new ApiError("Access", null, "Invalid token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }
        } else {
            ApiError error = new ApiError("General", null, "Missing authorization");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    boolean checkAuthorizationHeader(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        return authorizationHeader != null && authorizationHeader.startsWith("Bearer ");
    }

    boolean checkLoggedUser(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7);
            return tokenService.validateAccessToken(jwtToken);
        }
        return false;
    }

    public int getUserIDFromAccessToken(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String jwtToken = authorizationHeader.substring(7);
            if (tokenService.validateAccessToken(jwtToken)) {
                return tokenService.getUserIdFromToken(jwtToken);
            }
        }
        return -1;
    }

    public User getUserIdFromCalendarUrl(String calendarUrl) {
        return userDAO.getUserByCalendarUrl(calendarUrl)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Customer with calendarUrl [%s] not found".formatted(calendarUrl))
                );
    }

    public ResponseEntity<?> getUserDetails(Integer uuid, UserService userService, HttpServletRequest request) {
        //Check if user is logged in
        ResponseEntity<?> checkAuthorizationResult = checkAuthorization(request);
        if (checkAuthorizationResult.getStatusCode() != HttpStatus.OK) {
            return checkAuthorizationResult;
        }
        var user = userService.getUserById(uuid);
        var userId = userService.getUserIDFromAccessToken(request);
        var userDTO = new UserDTO(user.getId(), user.getFirstname(), user.getLastname(),
                user.getEmail(), user.getPassword(), user.getCalendarUrl(),
                user.getAvailableFromHour(), user.getAvailableToHour(), user.getAvailableDays());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(userDTO);
    }
}
