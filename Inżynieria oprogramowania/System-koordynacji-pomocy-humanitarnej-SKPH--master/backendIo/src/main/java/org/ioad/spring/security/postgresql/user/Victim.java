package org.ioad.spring.security.postgresql.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "victim")
public class Victim extends SingleUser {
    // Konstruktor
    public Victim() {}

    public Victim(String name, String surname, String pesel) {
        super(name, surname, pesel); // Wywołanie konstruktora klasy bazowej UserInfo
    }
}
