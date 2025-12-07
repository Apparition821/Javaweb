package com.minireddit.benutzerverwaltung.config;

import com.minireddit.benutzerverwaltung.model.User;
import com.minireddit.benutzerverwaltung.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class TestDataRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        userRepository.deleteAll();
        System.out.println("===All data deleted===");

        System.out.println("===Creating MYSQL Test data===");

        User user1 = new User("ganadiheart", "ganadi-heart@luvu.com",
                passwordEncoder.encode("123456"));
        user1.setDisplayName("Ganadi");
        user1.setBio("Puppy from South Korea");
        user1.setLocation("Seoul, South Korea");
        user1.setBeitraege(1);
        user1.setKommentare(5);
        user1.setKarma(6);
        user1.setAvatarPath("images/ganadi.jpg");
        user1.setEmailVerified(true);
        user1.setVerificationCode(null);

        User user2 = new User("testuser", "test@example.com",
                passwordEncoder.encode("password123"));
        user2.setDisplayName("Test User");
        user2.setBio("Just a test user");
        user2.setLocation("Berlin, Germany");
        user2.setBeitraege(3);
        user2.setKommentare(10);
        user2.setKarma(15);
        user2.setEmailVerified(true);
        user2.setVerificationCode(null);

        userRepository.save(user1);
        userRepository.save(user2);

        System.out.println("=== Test data created  ===");
        System.out.println("user1: ganadiheart / 123456");
        System.out.println("user2: testuser / password123");
    }
}