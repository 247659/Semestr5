package org.ioad.spring.security.postgresql.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.ioad.spring.security.postgresql.models.User;
import org.springframework.stereotype.Repository;

import org.ioad.spring.security.postgresql.models.UserInfo;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findByUser(User user);
}
