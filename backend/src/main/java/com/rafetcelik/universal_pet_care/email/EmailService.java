package com.rafetcelik.universal_pet_care.email;

import java.io.UnsupportedEncodingException;
import java.util.Properties;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailService {
	
	private JavaMailSender mailSender;
	
	@PostConstruct
	private void init() {
		mailSender = createMailSender();
	}
	
	public void sendEmail(String to, String subject, String senderName, String mailContent) throws UnsupportedEncodingException, MessagingException {
		MimeMessage message = mailSender.createMimeMessage();
		var messageHelper = new MimeMessageHelper(message);
		messageHelper = new MimeMessageHelper(message, "UTF-8");
		messageHelper.setFrom(EmailProperties.DEFAULT_USERNAME, senderName);
		messageHelper.setTo(to);
		messageHelper.setSubject(subject);
		messageHelper.setText(mailContent, true);
		mailSender.send(message);
	}
	
	private JavaMailSender createMailSender() {
		JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
		mailSender.setHost(EmailProperties.DEFAULT_HOST);
		mailSender.setPort(EmailProperties.DEFAULT_PORT);
		mailSender.setUsername(EmailProperties.DEFAULT_USERNAME);
		mailSender.setPassword(EmailProperties.DEFAULT_PASSWORD);
		Properties props = mailSender.getJavaMailProperties();
		props.put("mail.smtp.auth", String.valueOf(EmailProperties.DEFAULT_AUTH));
		props.put("mail.smtp.starttls.enable", String.valueOf(EmailProperties.DEFAULT_STARTTLS_ENABLE));
		props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
	    props.put("mail.debug", "true");
		return mailSender;
	}
}
