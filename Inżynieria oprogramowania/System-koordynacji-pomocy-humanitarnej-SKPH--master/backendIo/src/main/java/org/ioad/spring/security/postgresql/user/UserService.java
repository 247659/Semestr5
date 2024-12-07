package org.ioad.spring.security.postgresql.user;

import org.ioad.spring.security.postgresql.models.ERole;
import org.ioad.spring.security.postgresql.models.UserInfo;
import org.ioad.spring.security.postgresql.models.User;
import org.ioad.spring.security.postgresql.payload.request.AuthorityDataRequest;
import org.ioad.spring.security.postgresql.payload.request.FillDataRequest;
import org.ioad.spring.security.postgresql.payload.request.OrganizationDataRequest;
import org.ioad.spring.security.postgresql.payload.response.VolunteerDataResponse;
import org.ioad.spring.security.postgresql.repository.OrganizationRepository;
import org.ioad.spring.security.postgresql.repository.RoleRepository;
import org.ioad.spring.security.postgresql.repository.UserInfoRepository;
import org.ioad.spring.security.postgresql.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class UserService {

    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public List<VolunteerDataResponse> getAllVolunteers() {
        List<User> users = userRepository.findByRoles_Name(ERole.ROLE_VOLUNTEER);
        List<VolunteerDataResponse> volunteerDataResponses = new ArrayList<>();

        for (User user : users) {
            Optional<UserInfo> userInfo = userInfoRepository.findByUser(user);

            if (userInfo.isPresent()) {
                VolunteerDataResponse response = new VolunteerDataResponse(userInfo.get().getName(), userInfo.get().getSurname());
                volunteerDataResponses.add(response);
            }
        }
        return volunteerDataResponses;
    }

    public Optional<UserInfo> getUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

       return (userInfoRepository.findByUser(user));
    }

    public Organization fillOrganizationInformation(String username, OrganizationDataRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow(()
                -> new RuntimeException("Organization not found"));

        Organization organization = organizationRepository.findByUser(user).orElseGet(()
                -> {
                    Organization newOrganization = new Organization();
                    newOrganization.setUser(user);
                    newOrganization.setName(request.getName());

                    return newOrganization;
        });

        organization.setName(request.getName());
        return organizationRepository.save(organization);
    }

    public UserInfo fillAuthorityInformation(String username, AuthorityDataRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow(()
                -> new RuntimeException("Organization not found"));

        UserInfo userInfo = userInfoRepository.findByUser(user).orElseGet(()
                -> {
            UserInfo newUserInfo = new UserInfo();
            newUserInfo.setUser(user);
            newUserInfo.setName(request.getName());
            newUserInfo.setSurname(request.getSurname());
            newUserInfo.setPesel(request.getPesel());
            newUserInfo.setPosition(request.getPosition());

            return newUserInfo;
        });

        userInfo.setUser(user);
        userInfo.setName(request.getName());
        userInfo.setSurname(request.getSurname());
        userInfo.setPesel(request.getPesel());
        userInfo.setPosition(request.getPosition());
        return userInfoRepository.save(userInfo);
    }

    public UserInfo fillUserInformation(String username, FillDataRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserInfo userInfo = userInfoRepository.findByUser(user).orElseGet(()
                -> {
            UserInfo newUserInfo = new UserInfo();
            newUserInfo.setUser(user);
            newUserInfo.setName(request.getName());
            newUserInfo.setSurname(request.getSurname());
            newUserInfo.setPesel(request.getPesel());

            return newUserInfo;
        });

        userInfo.setUser(user);
        userInfo.setName(request.getName());
        userInfo.setSurname(request.getSurname());
        userInfo.setPesel(request.getPesel());
        return userInfoRepository.save(userInfo);
    }

}


//    public UserInfo fillUserInformation(String username, FillDataRequest request) {
//        User user = userRepository.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        UserInfo userInfo = userInfoRepository.findByUser(user)
//                .orElseGet(() -> {
//
//                    UserInfo newUser;
//                    if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
//                        newUser = new Organization();
//                        newUser.setUser(user);
//                        ((Organization) newUser).setName(request.getName());
//                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
//                        newUser = new Donor();
//                        newUser.setUser(user);
//                        ((Donor) newUser).setName(request.getName());
//                        ((Donor) newUser).setSurname(request.getSurname());
//                        ((Donor) newUser).setPesel(request.getPesel());
//                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
//                        newUser = new Victim();
//                        newUser.setUser(user);
//                        ((Victim) newUser).setName(request.getName());
//                        ((Victim) newUser).setSurname(request.getSurname());
//                        ((Victim) newUser).setPesel(request.getPesel());
//                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
//                        newUser = new Authority();
//                        newUser.setUser(user);
//                        ((Authority) newUser).setName(request.getName());
//                        ((Authority) newUser).setSurname(request.getSurname());
//                        ((Authority) newUser).setPesel(request.getPesel());
//                        ((Authority) newUser).setPosition(request.getPesel());
//                    } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_ADMIN))){
//                        newUser = new Volunteer();
//                        newUser.setUser(user);
//                        ((Volunteer) newUser).setName(request.getName());
//                        ((Volunteer) newUser).setSurname(request.getSurname());
//                        ((Volunteer) newUser).setPesel(request.getPesel());
//                    } else {
//                        throw new RuntimeException("Role not found");
//                    }
//
//                    return newUser;
//                });
//
//        if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
//            userInfo.setUser(user);
//            ((Organization) userInfo).setName(request.getName());
//        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))) {
//            ((Donor) userInfo).setName(request.getName());
//            ((Donor) userInfo).setSurname(request.getSurname());
//            ((Donor) userInfo).setPesel(request.getPesel());
//        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
//            ((Victim) userInfo).setName(request.getName());
//            ((Victim) userInfo).setSurname(request.getSurname());
//            ((Victim) userInfo).setPesel(request.getPesel());
//        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_USER))){
//            ((Authority) userInfo).setName(request.getName());
//            ((Authority) userInfo).setSurname(request.getSurname());
//            ((Authority) userInfo).setPesel(request.getPesel());
//            ((Authority) userInfo).setPosition(request.getPesel());
//        } else if ((user.getRoles().stream().anyMatch(role -> role.getName() == ERole.ROLE_ADMIN))){
//            ((Volunteer) userInfo).setName(request.getName());
//            ((Volunteer) userInfo).setSurname(request.getSurname());
//            ((Volunteer) userInfo).setPesel(request.getPesel());
//        }
//
//        return userInfoRepository.save(userInfo);
//    }

