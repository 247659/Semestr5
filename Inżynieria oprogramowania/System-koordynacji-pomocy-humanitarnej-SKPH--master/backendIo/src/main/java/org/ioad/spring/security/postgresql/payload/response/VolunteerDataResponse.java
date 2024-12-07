package org.ioad.spring.security.postgresql.payload.response;

public class VolunteerDataResponse {
    private String name;
    private String surname;


    public VolunteerDataResponse(String name, String surname) {
        this.name = name;
        this.surname = surname;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }
}
