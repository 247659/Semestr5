package org.ioad.spring.user.user;

import org.ioad.spring.user.models.Organization;
import org.ioad.spring.user.models.UserInfo;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    public Optional<UserInfo> getUser(String username);
    public List<Organization> getAllOrganizations();
    public List<UserInfo> getAllVolunteer();
}
