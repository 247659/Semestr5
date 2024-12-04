package org.ioad.spring.security.postgresql.user;

import org.ioad.spring.security.postgresql.models.User;
import org.ioad.spring.security.postgresql.payload.request.FillDataRequest;
import org.ioad.spring.security.postgresql.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {

//    @Autowired
//    private SignUserRepository signUserRepository;

    @Autowired
    private UserRepository userRepository;


    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User fillUserInformation(String username, FillDataRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setSurname(request.getSurname());
        user.setPesel(request.getPesel());

        return userRepository.save(user);
    }
}
