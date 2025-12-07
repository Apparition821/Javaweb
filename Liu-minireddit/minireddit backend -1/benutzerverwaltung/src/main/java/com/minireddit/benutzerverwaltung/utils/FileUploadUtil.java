package com.minireddit.benutzerverwaltung.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Component
public class FileUploadUtil {
    
    private final String UPLOAD_DIR = "uploads/avatars/";
    
    public String saveAvatar(MultipartFile file, String username) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        String fileExtension = getFileExtension(file.getOriginalFilename());
        String fileName = username + "_" + UUID.randomUUID() + fileExtension;
        
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);
        
        return UPLOAD_DIR + fileName;
    }
    
    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf(".") == -1) {
            return ".jpg"; 
        }
        return fileName.substring(fileName.lastIndexOf("."));
    }
    
    public void deleteOldAvatar(String oldAvatarPath) throws IOException {
        if (oldAvatarPath != null && !oldAvatarPath.isEmpty()) {
            Path oldFilePath = Paths.get(oldAvatarPath);
            if (Files.exists(oldFilePath)) {
                Files.delete(oldFilePath);
            }
        }
    }
}