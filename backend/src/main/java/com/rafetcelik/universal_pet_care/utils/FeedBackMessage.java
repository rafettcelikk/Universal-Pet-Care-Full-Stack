package com.rafetcelik.universal_pet_care.utils;

public class FeedBackMessage {

    /* ========================================================================
       1. GENEL İŞLEM MESAJLARI (GENERAL CRUD & RESOURCE)
       ======================================================================== */
    public static final String CREATE_SUCCESS = "Başarıyla oluşturuldu.";
    public static final String UPDATE_SUCCESS = "Başarıyla güncellendi.";
    public static final String RESOURCE_FOUND = "Başarıyla bulundu.";
    public static final String DELETE_SUCCESS = "Başarıyla silindi.";
    public static final String RESOURCE_NOT_FOUND = "Kayıt bulunamadı.";
    public static String SERVER_ERROR = "Sunucu hatası. Lütfen daha sonra tekrar deneyiniz.";

    /* ========================================================================
       2. KİMLİK DOĞRULAMA VE HESAP YÖNETİMİ (AUTH & ACCOUNT)
       ======================================================================== */
    public static final String AUTHENTICATION_SUCCESS = "Başarıyla giriş yapıldı.";
    public static final String ACCOUNT_LOCKED = "Hesap başarıyla kilitlendi.";
    public static final String ACCOUNT_UNLOCKED = "Hesabın kilidi başarıyla açıldı.";
    public static final String ACCOUNT_DISABLED = "Hesap devre dışı bırakıldı. Lütfen destek ekibiyle iletişime geçin.";
    public static final String ROLE_NOT_FOUND = "Rol bulunamadı: ";
    public static final String SENDER_RECIPIENT_NOT_FOUND = "Gönderici veya alıcı bulunamadı.";

    /* ========================================================================
       3. TOKEN VE DOĞRULAMA İŞLEMLERİ (TOKENS & VERIFICATION)
       ======================================================================== */
    public static final String TOKEN_VALID = "TOKEN_VALID";
    public static final String TOKEN_INVALID = "TOKEN_INVALID";
    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String TOKEN_ALREADY_USED = "TOKEN_ALREADY_USED";
    public static final String TOKEN_VALIDATION_ERROR = "TOKEN_VALIDATION_ERROR";
    public static final String TOKEN_SAVED_SUCCESS = "Doğrulama token'ı başarıyla kaydedildi.";
    public static final String TOKEN_DELETE_SUCCESS = "Doğrulama token'ı başarıyla silindi.";
    public static final String NEW_VERIFICATION_TOKEN_SENT = "Geçersiz veya süresi dolmuş doğrulama token'ı. Yeni bir doğrulama token'ı gönderildi. Lütfen e-postanızı kontrol edin.";

    /* ========================================================================
       4. ŞİFRE İŞLEMLERİ (PASSWORD)
       ======================================================================== */
    public static final String CHANGE_PASSWORD_SUCCESS = "Şifre başarıyla değiştirildi.";
    public static final String PASSWORD_RESET_SUCCESS = "Şifre başarıyla sıfırlandı.";
    public static final String PASSWORD_RESET_EMAIL_SENT = "Şifre sıfırlama e-postası gönderildi. Lütfen e-postanızı kontrol edin.";
    public static final String INVALID_RESET_TOKEN = "Geçersiz veya süresi dolmuş şifre sıfırlama token'ı. Lütfen yeni bir şifre sıfırlama isteği gönderin.";

    /* ========================================================================
       5. RANDEVU İŞLEMLERİ (APPOINTMENTS)
       ======================================================================== */
    public static final String APPOINTMENT_BOOKED_SUCCESS = "Randevu başarıyla oluşturuldu.";
    public static final String APPOINTMENT_APPROVED_SUCCESS = "Randevu başarıyla onaylandı.";
    public static final String APPOINTMENT_DECLINED_SUCCESS = "Randevu başarıyla reddedildi.";
    public static final String APPOINTMENT_CANCELLED_SUCCESS = "Randevu başarıyla iptal edildi.";
    public static final String APPOINTMENT_UPDATE_SUCCESS = "Randevu başarıyla güncellendi.";
    public static final String APPOINTMENT_DELETE_SUCCESS = "Randevu başarıyla silindi.";
    public static final String APPOINTMENT_FOUND = "Randevu başarıyla bulundu.";
    public static final String APPPOINTMENT_NOT_FOUND = "Randevu bulunamadı."; // Not: Yazım hatası 'APPPOINTMENT' (3 P) korunmuştur.
    public static final String APPOINTMENT_ALREADY_APPROVED = "Bu randevu zaten onaylanmış.";
    public static final String ALREADY_APROVED = "Üzgünüz, sadece 'ONAY BEKLENİYOR' durumundaki randevular güncellenebilir.";
    public static final String CANNOT_CANCEL_APPOINTMENT = "Üzgünüz, sadece 'ONAY BEKLENİYOR' durumundaki randevular iptal edilebilir.";

    /* ========================================================================
       6. KULLANICI YÖNETİMİ (USER MANAGEMENT)
       ======================================================================== */
    public static final String CREATE_USER_SUCCESS = "Kullanıcı başarıyla oluşturuldu.";
    public static final String USER_UPDATE_SUCCESS = "Kullanıcı başarıyla güncellendi.";
    public static final String USER_FOUND = "Kullanıcı başarıyla bulundu.";
    public static final String DELETE_USER_SUCCESS = "Kullanıcı başarıyla silindi.";
    public static final String USER_NOT_FOUND = "Kullanıcı bulunamadı";
    public static final String NO_USER_FOUND = "Kullanıcı bulunamadı: ";

    /* ========================================================================
       7. EVCİL HAYVAN VE FOTOĞRAF İŞLEMLERİ (PETS & PHOTOS)
       ======================================================================== */
    public static final String PET_ADDED_SUCCESS = "Randevuya başarıyla evcil hayvan eklendi.";
    public static final String PET_FOUND = "Evcil hayvan başarıyla bulundu.";
    public static final String PET_UPDATE_SUCCESS = "Evcil hayvan başarıyla güncellendi.";
    public static final String PET_DELETE_SUCCESS = "Evcil hayvan başarıyla silindi.";
    public static final String PHOTO_UPDATE_SUCCESS = "Fotoğraf başarıyla güncellendi.";
    public static final String PHOTO_REMOVE_SUCCESS = "Fotoğraf başarıyla silindi.";

    /* ========================================================================
       8. DEĞERLENDİRME VE YORUM İŞLEMLERİ (REVIEWS)
       ======================================================================== */
    public static final String REVIEW_SUBMIT_SUCCESS = "Değerlendirme başarıyla gönderildi.";
    public static final String REVIEW_FOUND = "Değerlendirme başarıyla bulundu.";
    public static final String REVIEW_UPDATE_SUCCESS = "Değerlendirme başarıyla güncellendi.";
    public static final String REVIEW_DELETE_SUCCESS = "Değerlendirme başarıyla silindi.";
    public static String CANNOT_REVIEW_SELF = "Veterinerler kendilerini değerlendiremezler.";
    public static String REVIEW_ALREADY_EXISTS = "Bu veteriner için zaten bir değerlendirme yaptınız. Sadece mevcut değerlendirmeyi güncelleyebilirsiniz.";
    public static String NOT_ALLOWED_TO_REVIEW = "Bu veterineri değerlendirme izniniz yok.";
    public static String VET_OR_PATIENT_NOT_FOUND = "Veteriner veya hasta bulunamadı.";
    public static String NOT_VETS_AVAILABLE = "Belirtilen kriterlere uygun veteriner bulunamadı.";

    /* ========================================================================
       9. VALIDASYON VE HATA MESAJLARI (VALIDATION & ERRORS)
       ======================================================================== */
    public static final String INVALID_PASSWORD = "Geçersiz şifre. Lütfen geçerli bir şifre giriniz.";
    public static final String INVALID_EMAIL = "Geçersiz e-posta adresi. Lütfen geçerli bir e-posta adresi giriniz.";
    public static final String MISSING_PASSWORD = "Şifre alanı eksik. Lütfen şifreyi sağlayın.";
}