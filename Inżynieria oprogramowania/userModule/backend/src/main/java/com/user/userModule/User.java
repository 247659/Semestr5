package com.user.userModule;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "users")
public class User {
    @Id
    private String username;
    @Column(name = "role")
    private String role;
    @Setter
    @Column(name = "name")
    private String name;
    @Setter
    @Column(name = "surname")
    private String surname;
    @Setter
    @Column(name = "pesel")
    private String pesel;

}
