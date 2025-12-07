package com.minireddit.benutzerverwaltung.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendVerificationEmail(String toEmail, String verificationCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("MiniReddit - Email Verification");
        message.setText("Your verification code is: " + verificationCode + 
                       "\nThis code will expire in 15 minutes.");
        
        mailSender.send(message);
        System.out.println("Verification email sent to: " + toEmail);
    }
}