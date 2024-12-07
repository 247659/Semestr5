package org.ioad.spring.user.user;

import org.ioad.spring.security.postgresql.models.ERole;
import org.ioad.spring.user.models.Organization;
import org.ioad.spring.user.models.UserInfo;
import org.ioad.spring.security.postgresql.models.User;
import org.ioad.spring.user.payload.request.AuthorityDataRequest;
import org.ioad.spring.user.payload.request.FillDataRequest;
import org.ioad.spring.user.payload.request.OrganizationDataRequest;
import org.ioad.spring.user.payload.response.VolunteerDataResponse;
import org.ioad.spring.user.repository.OrganizationRepository;
import org.ioad.spring.security.postgresql.repository.RoleRepository;
import org.ioad.spring.user.repository.UserInfoRepository;
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
