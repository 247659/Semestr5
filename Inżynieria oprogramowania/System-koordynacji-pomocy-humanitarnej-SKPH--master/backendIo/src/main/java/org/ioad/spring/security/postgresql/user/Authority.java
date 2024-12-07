//package org.ioad.spring.security.postgresql.user;
//
//import jakarta.persistence.*;
//
//@Entity
//@Table(name = "authorities")
//public class Authority extends SingleUser {
//
//    @Column(name = "position")
//    private String position;
//
//    // Konstruktor
//    public Authority() {}
//
//    public Authority(String name, String surname, String pesel, String position) {
//        super(name, surname, pesel); // Wywołanie konstruktora klasy bazowej UserInfo
//        this.position = position;
//    }
//
//    // Gettery i settery
//    public String getPosition() {
//        return position;
//    }
//
//    public void setPosition(String position) {
//        this.position = position;
//    }
//}
