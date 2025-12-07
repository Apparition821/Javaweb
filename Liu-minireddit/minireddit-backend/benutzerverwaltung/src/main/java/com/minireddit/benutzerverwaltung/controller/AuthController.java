package com.minireddit.benutzerverwaltung.controller;

import com.minireddit.benutzerverwaltung.model.User;
import com.minireddit.benutzerverwaltung.repository.UserRepository;
import com.minireddit.benutzerverwaltung.utils.EmailService;
import com.minireddit.benutzerverwaltung.utils.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String email = request.get("email");
            String password = request.get("password");

            if (userRepository.existsByUsername(username)) {
                return ResponseEntity.badRequest().body("username already exists");
            }

            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("email already exists");
            }

            String encodedPassword = passwordEncoder.encode(password);
            User user = new User(username, email, encodedPassword);
            String verificationCode = generateVerificationCode();
            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            emailService.sendVerificationEmail(email, verificationCode);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Registration successful. Please check your email for verification code.");
            response.put("username", username);
            response.put("needsVerification", "true");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.isEmailVerified()) {
                return ResponseEntity.badRequest().body("Email already verified");
            }

            String newVerificationCode = generateVerificationCode();
            user.setVerificationCode(newVerificationCode);
            user.setVerificationCodeExpiry(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);

            emailService.sendVerificationEmail(user.getEmail(), newVerificationCode);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Verification code sent successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to resend verification code: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
 System.out.println("=== Test data  ===");
        System.out.println("username: " + username);
        System.out.println("password: " + password);
            User user = userRepository.findByUsername(username)
                    .orElse(null);
                    
                     System.out.println("用户是否存在: " + (user != null));

            if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.badRequest().body("username or password is incorrect");
            }

            if (!user.isEmailVerified()) {
                Map<String, Object> response = new HashMap<>();
                response.put("error", "EMAIL_NOT_VERIFIED");
                response.put("message", "Please verify your email first");
                response.put("username", username);
                return ResponseEntity.badRequest().body(response);
            }

            String token = jwtUtil.createToken(username);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "successfully logged in");
            response.put("token", token);
            response.put("user", createUserResponse(user));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userResponse = new HashMap<>();
        userResponse.put("id", user.getId());
        userResponse.put("username", user.getUsername());
        userResponse.put("email", user.getEmail());
        userResponse.put("displayName", user.getDisplayName());
        userResponse.put("avatarPath", user.getAvatarPath());
        userResponse.put("bio", user.getBio());
        userResponse.put("location", user.getLocation());
        userResponse.put("beitraege", user.getBeitraege());
        userResponse.put("kommentare", user.getKommentare());
        userResponse.put("karma", user.getKarma());
        userResponse.put("gefolgt", user.getGefolgt());
        userResponse.put("mitgliedSeit", user.getMitgliedSeit());
        return userResponse;
    }
}