package org.ioad.spring.security.postgresql.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.ioad.spring.security.postgresql.user.SingleUser;

@Entity
@Table(name = "volunteer")
public class Volunteer extends SingleUser {

    @Column(name = "active")
    private boolean active;

    @Column(name = "organization")
    private String organization;

    // Konstruktor
    public Volunteer() {}

    public Volunteer(String name, String surname, String pesel) {
        super(name, surname, pesel); // Wywołanie konstruktora klasy bazowej UserInfo
        this.active = true;
        this.organization = null;
    }

    // Gettery i settery
    public Boolean isActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }
}
