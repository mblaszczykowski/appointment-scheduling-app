package com.calendly.controllers;

import com.calendly.entities.User;
import com.calendly.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/calendar")
public class CalendarController {

    @Autowired
    private UserService userService;

    @GetMapping("/{calendarUrl}")
    public ResponseEntity<?> getUserByCalendarUrl(@PathVariable("calendarUrl") String calendarUrl) {
        User user = userService.getUserIdFromCalendarUrl(calendarUrl);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok().body(user);
    }
}
