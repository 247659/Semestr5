package com.user.userModule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin("http://localhost:8081")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @PutMapping("/{username}/update-data")
    public ResponseEntity<User> fillUserInformation(@PathVariable String username, @RequestBody UserRequest request) {
        User updatedUser = userService.updateUserData(username, request);
        return ResponseEntity.ok(updatedUser);
    }
}
