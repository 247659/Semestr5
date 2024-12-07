//package org.ioad.spring.security.postgresql.user;
//
//import jakarta.persistence.*;
//import org.ioad.spring.security.postgresql.models.User;
//import org.ioad.spring.security.postgresql.models.UserInfo;
//
//@Entity
//@Table(name = "singleUser")
//public abstract class SingleUser extends UserInfo {
//
//    @Column(name = "name")
//    private String name;
//
//    @Column(name = "surname")
//    private String surname;
//
//    @Column(name = "pesel")
//    private String pesel;
//
//
//    public SingleUser() {
//    }
//
//    public SingleUser(String name, String surname, String pesel) {
//        super();
//        this.name = name;
//        this.surname = surname;
//        this.pesel = pesel;
//    }
//
//    public String getPesel() {
//        return pesel;
//    }
//
//    public void setPesel(String pesel) {
//        this.pesel = pesel;
//    }
//
//    public String getSurname() {
//        return surname;
//    }
//
//    public void setSurname(String surname) {
//        this.surname = surname;
//    }
//
//    public String getName() {
//        return name;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }
//}
