package com.rafetcelik.universal_pet_care.email;

import java.io.UnsupportedEncodingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void sendEmail(String to, String subject, String senderName, String mailContent) 
            throws UnsupportedEncodingException, MessagingException {
        
        MimeMessage message = mailSender.createMimeMessage();
        
        MimeMessageHelper messageHelper = new MimeMessageHelper(message, true, "UTF-8");
        
        messageHelper.setFrom(senderEmail, senderName);
        messageHelper.setTo(to);
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        
        mailSender.send(message);
    }
}