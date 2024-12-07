package org.ioad.spring.security.postgresql.repository;

import java.util.List;
import java.util.Optional;

import org.ioad.spring.security.postgresql.models.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.ioad.spring.security.postgresql.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);
  List<User> findByRoles_Name(ERole role);
}
