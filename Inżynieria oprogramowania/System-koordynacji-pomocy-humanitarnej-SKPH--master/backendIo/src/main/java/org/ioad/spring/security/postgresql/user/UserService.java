package org.ioad.spring.security.postgresql.user;

import org.ioad.spring.security.postgresql.models.ERole;
import org.ioad.spring.security.postgresql.models.UserInfo;
import org.ioad.spring.security.postgresql.models.Role;
import org.ioad.spring.security.postgresql.models.User;
import org.ioad.spring.security.postgresql.payload.request.FillDataRequest;
import org.ioad.spring.security.postgresql.repository.RoleRepository;
import org.ioad.spring.security.postgresql.repository.UserInfoRepository;
import org.ioad.spring.security.postgresql.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;


    public List<UserInfo> getAllUsers() {
        return userInfoRepository.findAll();
    }

    public UserInfo fillUserInformation(String username, FillDataRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserInfo userInfo = userInfoRepository.findByUser(user)
                .orElseGet(() -> {

                    UserInfo newUser;
                    if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
                        newUser = new Organization();
                        newUser.setUser(user);
                        ((Organization) newUser).setName(request.getName());
                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
                        newUser = new Donor();
                        newUser.setUser(user);
                        ((Donor) newUser).setName(request.getName());
                        ((Donor) newUser).setSurname(request.getSurname());
                        ((Donor) newUser).setPesel(request.getPesel());
                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
                        newUser = new Victim();
                        newUser.setUser(user);
                        ((Victim) newUser).setName(request.getName());
                        ((Victim) newUser).setSurname(request.getSurname());
                        ((Victim) newUser).setPesel(request.getPesel());
                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
                        newUser = new Authority();
                        newUser.setUser(user);
                        ((Authority) newUser).setName(request.getName());
                        ((Authority) newUser).setSurname(request.getSurname());
                        ((Authority) newUser).setPesel(request.getPesel());
                        ((Authority) newUser).setPosition(request.getPesel());
                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_ADMIN))){
                        newUser = new Volunteer();
                        newUser.setUser(user);
                        ((Volunteer) newUser).setName(request.getName());
                        ((Volunteer) newUser).setSurname(request.getSurname());
                        ((Volunteer) newUser).setPesel(request.getPesel());
                    } else {
                        throw new RuntimeException("Role not found");
                    }

                    return newUser;
                });

        if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
            userInfo.setUser(user);
            ((Organization) userInfo).setName(request.getName());
        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
            ((Donor) userInfo).setName(request.getName());
            ((Donor) userInfo).setSurname(request.getSurname());
            ((Donor) userInfo).setPesel(request.getPesel());
        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
            ((Victim) userInfo).setName(request.getName());
            ((Victim) userInfo).setSurname(request.getSurname());
            ((Victim) userInfo).setPesel(request.getPesel());
        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
            ((Authority) userInfo).setName(request.getName());
            ((Authority) userInfo).setSurname(request.getSurname());
            ((Authority) userInfo).setPesel(request.getPesel());
            ((Authority) userInfo).setPosition(request.getPesel());
        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_ADMIN))){
            ((Volunteer) userInfo).setName(request.getName());
            ((Volunteer) userInfo).setSurname(request.getSurname());
            ((Volunteer) userInfo).setPesel(request.getPesel());
        }

        return userInfoRepository.save(userInfo);
    }
}
