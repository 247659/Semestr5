package org.ioad.spring.security.postgresql.controllers;

import org.ioad.spring.security.postgresql.models.User;
import org.ioad.spring.security.postgresql.payload.request.FillDataRequest;
import org.ioad.spring.security.postgresql.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{username}/update-data")
    public ResponseEntity<User> fillUserInformation(@PathVariable String username, @RequestBody FillDataRequest request) {
        User updatedUser = userService.fillUserInformation(username, request);
        return ResponseEntity.ok(updatedUser);
    }
}
