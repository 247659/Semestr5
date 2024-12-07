package org.ioad.spring.security.postgresql.repository;

import org.ioad.spring.security.postgresql.models.User;
import org.ioad.spring.security.postgresql.models.UserInfo;
import org.ioad.spring.security.postgresql.user.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByUser(User user);
}
