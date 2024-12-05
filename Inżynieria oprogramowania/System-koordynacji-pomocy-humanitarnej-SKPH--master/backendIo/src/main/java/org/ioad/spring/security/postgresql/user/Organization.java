package org.ioad.spring.security.postgresql.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.ioad.spring.security.postgresql.models.UserInfo;

@Entity
@Table(name = "organization")
public class Organization extends UserInfo {


    @Column(name = "name")
    private String name;

    public Organization() {
    }

    public Organization(String name) {
        super();
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
