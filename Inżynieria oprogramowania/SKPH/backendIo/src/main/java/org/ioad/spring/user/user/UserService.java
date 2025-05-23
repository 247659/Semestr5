package org.ioad.spring.user.user;

import org.ioad.spring.user.models.Organization;
import org.ioad.spring.user.models.UserInfo;
import org.ioad.spring.security.postgresql.models.User;
import org.ioad.spring.user.payload.request.AuthorityDataRequest;
import org.ioad.spring.user.payload.request.FillDataRequest;
import org.ioad.spring.user.payload.request.OrganizationDataRequest;
import org.ioad.spring.user.payload.response.VolunteerDataResponse;
import org.ioad.spring.user.repository.OrganizationRepository;
import org.ioad.spring.user.repository.UserInfoRepository;
import org.ioad.spring.security.postgresql.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService implements IUserService {

    @Autowired
    private UserInfoRepository userInfoRepository;
    @Autowired
    private OrganizationRepository organizationRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    @Override
    public List<UserInfo> getAllVolunteers() {
        List<User> users = userRepository.getAllUsersByRole("ROLE_VOLUNTEER");
        List<UserInfo> volunteers = new ArrayList<>();
        for (User user : users) {
            Optional<UserInfo> userInfo = userInfoRepository.findByUser(user);
            userInfo.ifPresent(volunteers::add);
        }
        return volunteers;
    }


    public List<VolunteerDataResponse> getAllVolunteersInfo(Boolean activity) {
        List<VolunteerDataResponse> volunteerDataResponses = new ArrayList<>();
        List<UserInfo> volunteers = this.getAllVolunteers();

        for (UserInfo userInfo : volunteers) {
            if (activity == null || userInfo.isActivity() == activity) {
                VolunteerDataResponse response = new VolunteerDataResponse(
                        userInfo.getName(),
                        userInfo.getSurname(),
                        userInfo.isActivity()
                );
                volunteerDataResponses.add(response);
            }
        }
        return volunteerDataResponses;
    }

    @Override
    public Optional<UserInfo> getUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

       return (userInfoRepository.findByUser(user));
    }

    @Override
    public void addOrganizationInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Organization organization = new Organization();
        organization.setUser(user);
        organizationRepository.save(organization);
    }

    @Override
    public void addUserInfo(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserInfo userInfo = new UserInfo();
        userInfo.setUser(user);
        userInfoRepository.save(userInfo);
    }

    public void fillOrganizationInformation(String username, OrganizationDataRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow(()
                -> new RuntimeException("Organization not found"));

        Optional<Organization> organization = organizationRepository.findByUser(user);
        organization.ifPresent(value -> {
            value.setName(request.getName());
            organizationRepository.save(value);
        });
    }

    public void fillAuthorityInformation(String username, AuthorityDataRequest request) {
        User user = userRepository.findByUsername(username).orElseThrow(()
                -> new RuntimeException("Authority not found"));

        UserInfo userInfo = userInfoRepository.findByUser(user).orElseGet(()
                -> {
            UserInfo newUserInfo = new UserInfo();
            newUserInfo.setUser(user);
            newUserInfo.setName(request.getName());
            newUserInfo.setSurname(request.getSurname());
            newUserInfo.setPesel(request.getPesel());
//            newUserInfo.setPosition(request.getPosition());

            return newUserInfo;
        });

        userInfo.setUser(user);
        userInfo.setName(request.getName());
        userInfo.setSurname(request.getSurname());
        userInfo.setPesel(request.getPesel());
//        userInfo.setPosition(request.getPosition());
        userInfoRepository.save(userInfo);
    }

    public void fillUserInformation(String username, FillDataRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserInfo> userInfo = userInfoRepository.findByUser(user);
        userInfo.ifPresent(value -> {
                    value.setName(request.getName());
                    value.setSurname(request.getSurname());
                    value.setPesel(request.getPesel());
                    userInfoRepository.save(value);
                });
    }
}
