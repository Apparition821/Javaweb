package com.minireddit.benutzerverwaltung.controller;

import com.minireddit.benutzerverwaltung.model.User;
import com.minireddit.benutzerverwaltung.repository.UserRepository;
import com.minireddit.benutzerverwaltung.utils.FileUploadUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FileUploadUtil fileUploadUtil;

    @GetMapping("/profile")
    public ResponseEntity<?> getCurrentUserProfile() {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();

            User user = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> profile = new HashMap<>();
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("displayName", user.getDisplayName());
            profile.put("avatarPath", user.getAvatarPath());
            profile.put("bio", user.getBio());
            profile.put("location", user.getLocation());
            profile.put("beitraege", user.getBeitraege());
            profile.put("kommentare", user.getKommentare());
            profile.put("karma", user.getKarma());
            profile.put("gefolgt", user.getGefolgt());
            profile.put("mitgliedSeit", user.getMitgliedSeit());

            return ResponseEntity.ok(profile);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get user profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<Map<String, String>> updateProfile(@RequestBody Map<String, String> updateData) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (updateData.containsKey("displayName")) {
                user.setDisplayName(updateData.get("displayName"));
            }
            if (updateData.containsKey("bio")) {
                user.setBio(updateData.get("bio"));
            }
            if (updateData.containsKey("location")) {
                user.setLocation(updateData.get("location"));
            }

            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to update profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/password")
    public ResponseEntity<Map<String, String>> changePassword(@RequestBody Map<String, String> passwordData) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String oldPassword = passwordData.get("oldPassword");
            String newPassword = passwordData.get("newPassword");
            String confirmPassword = passwordData.get("confirmPassword");

            if (oldPassword == null || oldPassword.trim().isEmpty()) {
                throw new RuntimeException("Current password is required");
            }
            if (newPassword == null || newPassword.trim().isEmpty()) {
                throw new RuntimeException("New password is required");
            }
            if (confirmPassword == null || confirmPassword.trim().isEmpty()) {
                throw new RuntimeException("Confirm password is required");
            }

            if (!newPassword.equals(confirmPassword)) {
                throw new RuntimeException("New password and confirm password do not match");
            }

            if (newPassword.length() < 6) {
                throw new RuntimeException("New password must be at least 6 characters long");
            }

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }

            String encodedNewPassword = passwordEncoder.encode(newPassword);
            user.setPassword(encodedNewPassword);
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserProfile(@PathVariable String username) {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> publicProfile = new HashMap<>();
            publicProfile.put("username", user.getUsername());
            publicProfile.put("displayName", user.getDisplayName());
            publicProfile.put("bio", user.getBio());
            publicProfile.put("location", user.getLocation());
            publicProfile.put("beitraege", user.getBeitraege());
            publicProfile.put("kommentare", user.getKommentare());
            publicProfile.put("karma", user.getKarma());
            publicProfile.put("gefolgt", user.getGefolgt());
            publicProfile.put("mitgliedSeit", user.getMitgliedSeit());

            return ResponseEntity.ok(publicProfile);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to get user profile: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/account")
    public ResponseEntity<Map<String, String>> deleteAccount() {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            userRepository.delete(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Account deleted successfully");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to delete account: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/avatar")
    public ResponseEntity<?> uploadAvatar(@RequestParam("avatar") MultipartFile file) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!file.getContentType().startsWith("image/")) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Nur Bilddateien sind erlaubt");
                return ResponseEntity.badRequest().body(error);
            }

            fileUploadUtil.deleteOldAvatar(user.getAvatarPath());

            String avatarPath = fileUploadUtil.saveAvatar(file, currentUsername);
            user.setAvatarPath(avatarPath);
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Avatar erfolgreich hochgeladen");
            response.put("avatarPath", avatarPath);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Fehler beim Hochladen: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}