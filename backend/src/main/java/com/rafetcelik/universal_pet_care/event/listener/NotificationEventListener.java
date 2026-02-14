package com.rafetcelik.universal_pet_care.event.listener;

import java.io.UnsupportedEncodingException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import com.rafetcelik.universal_pet_care.email.EmailService;
import com.rafetcelik.universal_pet_care.event.AppointmentApprovedEvent;
import com.rafetcelik.universal_pet_care.event.AppointmentBookedEvent;
import com.rafetcelik.universal_pet_care.event.AppointmentDeclinedEvent;
import com.rafetcelik.universal_pet_care.event.PasswordResetEvent;
import com.rafetcelik.universal_pet_care.event.RegistrationCompleteEvent;
import com.rafetcelik.universal_pet_care.model.Appointment;
import com.rafetcelik.universal_pet_care.model.User;
import com.rafetcelik.universal_pet_care.service.token.IVerificationTokenService;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    private final EmailService emailService;
    private final IVerificationTokenService verificationTokenService;

    @Value("${frontend.base.url}")
    private String frontendBaseUrl;

    @EventListener
    public void handleRegistrationCompleteEvent(RegistrationCompleteEvent event) throws MessagingException, UnsupportedEncodingException {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        
        verificationTokenService.saveVerificationTokenForUser(token, user);
        
        String verificationUrl = frontendBaseUrl + "/email-verification?token=" + token;
        
        log.info("Kayıt doğrulama maili gönderiliyor: {}", user.getEmail());
        sendRegistrationVerificationEmail(user, verificationUrl);
    }

    @EventListener
    public void handleAppointmentBookedEvent(AppointmentBookedEvent event) throws MessagingException, UnsupportedEncodingException {
        Appointment appointment = event.getAppointment();
        User vet = appointment.getVeterinarian();

        log.info("Randevu bildirim maili gönderiliyor (Vet): {}", vet.getEmail());
        sendAppointmentBookedNotification(vet, frontendBaseUrl);
    }

    @EventListener
    public void handleAppointmentApprovedEvent(AppointmentApprovedEvent event) throws MessagingException, UnsupportedEncodingException {
        Appointment appointment = event.getAppointment();
        User patient = appointment.getPatient();
        
        log.info("Randevu onay maili gönderiliyor: {}", patient.getEmail());
        sendAppointmentApprovedNotification(patient, frontendBaseUrl);
    }

    @EventListener
    public void handleAppointmentDeclinedEvent(AppointmentDeclinedEvent event) throws MessagingException, UnsupportedEncodingException {
        Appointment appointment = event.getAppointment();
        User patient = appointment.getPatient();
        
        log.info("Randevu red maili gönderiliyor: {}", patient.getEmail());
        sendAppointmentDeclinedNotification(patient, frontendBaseUrl);
    }
    
    @EventListener
    public void handlePasswordResetEvent(PasswordResetEvent event) {
        User user = event.getUser();
        String token = UUID.randomUUID().toString();
        verificationTokenService.saveVerificationTokenForUser(token, user);
        
        String resetUrl = frontendBaseUrl + "/reset-password?token=" + token;
        
        try {
            log.info("Şifre sıfırlama maili gönderiliyor: {}", user.getEmail());
            sendPasswordResetEmail(user, resetUrl);
        } catch (MessagingException | UnsupportedEncodingException e) {
            log.error("Şifre sıfırlama e-postası gönderilemedi: {}", e.getMessage());
            throw new RuntimeException("E-posta gönderimi sırasında teknik bir sorun oluştu.", e);
        }
    }

    private void sendRegistrationVerificationEmail(User user, String verificationUrl) 
            throws UnsupportedEncodingException, MessagingException {
        String subject = "Hesabınızı Doğrulayın | Evrensel Evcil Hayvan Bakımı";
        String senderName = "Evrensel Evcil Hayvan Bakımı";
        
        String mailContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<h2>Hoş Geldiniz, " + user.getFirstName() + " " + user.getLastName() + "!</h2>" +
                "<p>Evrensel Evcil Hayvan Bakımı platformuna kayıt olduğunuz için teşekkür ederiz.</p>" +
                "<p>Hesabınızı aktif hale getirmek ve güvenli bir şekilde kullanmaya başlamak için lütfen aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın:</p>" +
                "<div style='margin: 30px 0;'>" +
                "   <a href=\"" + verificationUrl + "\" style='background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;'>" +
                "       Hesabımı Doğrula" +
                "   </a>" +
                "</div>" +
                "<p>Eğer butona tıklayamıyorsanız, bu bağlantıyı tarayıcınıza kopyalayabilirsiniz:</p>" +
                "<p style='word-break: break-all; color: #2196F3;'>" + verificationUrl + "</p>" +
                "<br/>" +
                "<hr style='border: 0; border-top: 1px solid #eee;'>" +
                "<p style='font-size: 13px; color: #777;'>Bu e-posta otomatik olarak gönderilmiştir. Lütfen bu adrese yanıt vermeyiniz.</p>" +
                "<p><strong>Evrensel Evcil Hayvan Bakımı Ekibi</strong></p>" +
                "</div>";

        emailService.sendEmail(user.getEmail(), subject, senderName, mailContent);
    }

    private void sendAppointmentBookedNotification(User user, String url) 
            throws MessagingException, UnsupportedEncodingException {
        String subject = "Yeni Randevu Talebi! | Evrensel Evcil Hayvan Bakımı";
        String senderName = "Evrensel Evcil Hayvan Bakımı";

        String mailContent = "<div style='font-family: Arial, sans-serif; color: #333;'>" +
                "<h2>Sayın Veteriner Hekim " + user.getFirstName() + " " + user.getLastName() + ",</h2>" +
                
                "<p>Bir hasta tarafından adınıza <strong>yeni bir randevu talebi</strong> oluşturuldu.</p>" +
                
                "<p>Randevu detaylarını incelemek, hastayı görüntülemek ve randevuyu <strong>Onaylamak</strong> veya <strong>Reddetmek</strong> için lütfen panelinize giriş yapın:</p>" +
                
                "<div style='margin: 25px 0;'>" +
                "   <a href=\"" + url + "\" style='background-color: #2196F3; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;'>" +
                "       Randevu Talebini Yönet" +
                "   </a>" +
                "</div>" +
                
                "<p>Eğer butona tıklayamıyorsanız, aşağıdaki bağlantıyı tarayıcınıza kopyalayabilirsiniz:</p>" +
                "<p style='word-break: break-all;'><a href=\"" + url + "\">" + url + "</a></p>" +
                "<br/>" +
                "<hr style='border: 0; border-top: 1px solid #eee;'>" +
                "<p>Saygılarımızla,<br><strong>Evrensel Evcil Hayvan Bakımı Ekibi</strong></p>" +
                "</div>";

        emailService.sendEmail(user.getEmail(), subject, senderName, mailContent);
    }

    private void sendAppointmentApprovedNotification(User user, String url) 
            throws MessagingException, UnsupportedEncodingException {
        String subject = "Randevunuz Onaylandı | Evrensel Evcil Hayvan Bakımı";
        String senderName = "Evrensel Evcil Hayvan Bakımı";

        String mailContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<h2>Merhaba " + user.getFirstName() + ",</h2>" +
                "<p>Güzel haber! <strong>Randevunuz onaylandı.</strong></p>" +
                "<p>Randevu detaylarını ve veteriner hekim bilgilerinizi görüntülemek için aşağıdaki bağlantıya tıklayarak klinik portalına ulaşabilirsiniz:</p>" +
                "<p><a href=\"" + url + "\" style='color: #2196F3; font-weight: bold;'>Randevu Detaylarını ve Veteriner Bilgilerini Görüntüle</a></p>" +
                "<br/>" +
                "<p>Herhangi bir sorunuz olursa bizimle iletişime geçmekten çekinmeyin.</p>" +
                "<p>Saygılarımızla,<br><strong>Evrensel Evcil Hayvan Bakımı Ekibi</strong></p>" +
                "</div>";

        emailService.sendEmail(user.getEmail(), subject, senderName, mailContent);
    }

    private void sendAppointmentDeclinedNotification(User user, String url) 
            throws MessagingException, UnsupportedEncodingException {
        String subject = "Randevu Talebiniz Hakkında | Evrensel Evcil Hayvan Bakımı";
        String senderName = "Evrensel Evcil Hayvan Bakımı";
        
        String mailContent = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                "<h2>Merhaba " + user.getFirstName() + ",</h2>" +
                "<p>Üzgünüz, randevu talebiniz şu an için <strong>onaylanamadı.</strong></p>" +
                "<p>Lütfen farklı bir tarih veya saat için klinik portalımız üzerinden yeniden randevu planlaması yapın.</p>" +
                "<p>Detayları incelemek ve yeni randevu oluşturmak için aşağıdaki bağlantıyı kullanabilirsiniz:</p>" +
                "<p><a href=\"" + url + "\" style='color: #E53935; font-weight: bold;'>Randevu Detaylarını Görüntüle ve Yeniden Planla</a></p>" +
                "<br/>" +
                "<p>Anlayışınız için teşekkür ederiz.</p>" +
                "<p>Saygılarımızla,<br><strong>Evrensel Evcil Hayvan Bakımı Ekibi</strong></p>" +
                "</div>";

        emailService.sendEmail(user.getEmail(), subject, senderName, mailContent);
    }

    private void sendPasswordResetEmail(User user, String resetUrl) throws MessagingException, UnsupportedEncodingException {
        String subject = "Şifre Sıfırlama Talebi";
        String senderName = "Evrensel Evcil Hayvan Bakımı";
        String mailContent = "<p>Merhaba " + user.getFirstName() + ",</p>" +
                "<p>Şifrenizi sıfırlama talebinde bulundunuz. İşlemi tamamlamak için lütfen aşağıdaki bağlantıya tıklayın:</p>" +
                "<a href=\"" + resetUrl + "\">Şifremi Sıfırla</a><br/>" +
                "<p>Eğer bu talebi siz yapmadıysanız, lütfen bu e-postayı görmezden gelin; hesabınız güvendedir.</p>" +
                "<p>Saygılarımızla,<br> Evrensel Evcil Hayvan Bakımı Ekibi</p>";
                
        emailService.sendEmail(user.getEmail(), subject, senderName, mailContent);
    }
}