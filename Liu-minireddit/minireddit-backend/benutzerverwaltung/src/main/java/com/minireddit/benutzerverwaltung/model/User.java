package com.minireddit.benutzerverwaltung.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    @Column(name = "email_verified")
    private Boolean emailVerified = false;
    @Column(name = "verification_code")
    private String verificationCode;
    @Column(name = "verification_code_expiry")
    private LocalDateTime verificationCodeExpiry;
    @Column(name = "avatar_path")
    private String avatarPath;
    private String displayName;
    private String bio;
    private String location;
    private Integer beitraege = 0;
    private Integer kommentare = 0;
    private Integer karma = 0;
    private Integer gefolgt = 0;
    private LocalDateTime mitgliedSeit = LocalDateTime.now();

    public User() {
        super();
    }

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.displayName = username;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getDisplayName() {
        return displayName;
    }

     public Boolean getEmailVerified() { 
        return emailVerified; 
     }

    public String getBio() {
        return bio;
    }

    public String getLocation() {
        return location;
    }

    public Integer getBeitraege() {
        return beitraege;
    }

    public Integer getKommentare() {
        return kommentare;
    }

    public Integer getKarma() {
        return karma;
    }

    public Integer getGefolgt() {
        return gefolgt;
    }

    public LocalDateTime getMitgliedSeit() {
        return mitgliedSeit;
    }

    public String getAvatarPath() {
        return avatarPath;
    }

    public void setAvatarPath(String avatarPath) {
        this.avatarPath = avatarPath;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isEmailVerified() {
        return Boolean.TRUE.equals(emailVerified);
    }


    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public LocalDateTime getVerificationCodeExpiry() {
        return verificationCodeExpiry;
    }

    public void setVerificationCodeExpiry(LocalDateTime verificationCodeExpiry) {
        this.verificationCodeExpiry = verificationCodeExpiry;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setBeitraege(Integer beitraege) {
        this.beitraege = beitraege;
    }

    public void setKommentare(Integer kommentare) {
        this.kommentare = kommentare;
    }

    public void setKarma(Integer karma) {
        this.karma = karma;
    }

    public void setGefolgt(Integer gefolgt) {
        this.gefolgt = gefolgt;
    }

    public void setMitgliedSeit(LocalDateTime mitgliedSeit) {
        this.mitgliedSeit = mitgliedSeit;
    }

    @Override
    public String toString() {
        return "User{" + "id=" + id + ", username='" + username + '\'' + ", displayName='" + displayName + '\''
                + ", beitraege=" + beitraege + ", karma=" + karma + '}';
    }

}