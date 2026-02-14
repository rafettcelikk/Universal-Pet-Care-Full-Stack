import React, { useEffect, useState } from "react";
import { verifyEmail, resendVerificationToken } from "./AuthService";
import ProcessSpinner from "../common/ProcessSpinner";
import { Button } from "react-bootstrap";

const EmailVerification = () => {
  const [verificationMessage, setVerificationMessage] = useState(
    "E-postanız doğrulanıyor. Lütfen bekleyin...",
  );
  const [alertType, setAlertType] = useState("alert-info");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (token) {
      verifyEmailToken(token);
    } else if (!token) {
      setVerificationMessage(
        "Doğrulama bağlantısında bir sorun var. Lütfen doğrulama e-postasını tekrar kontrol edin.",
      );
      setAlertType("alert-danger");
    }
  }, []);

  const handleResponse = (message) => {
    switch (message) {
      case "TOKEN_VALID":
        setVerificationMessage("✅ E-posta doğrulandı! Giriş yapabilirsiniz.");
        setAlertType("alert-success");
        break;
      case "TOKEN_ALREADY_USED":
        setVerificationMessage(
          "ℹ️ Bu bağlantı zaten kullanılmış. E-posta zaten doğrulanmış olabilir.",
        );
        setAlertType("alert-info");
        break;

      case "TOKEN_INVALID":
        setVerificationMessage("❌ Geçersiz bağlantı.");
        setAlertType("alert-danger");
        break;

      default:
        setVerificationMessage("Bir hata oluştu.");
        setAlertType("alert-danger");
    }
  };

  const verifyEmailToken = async (token) => {
    setIsProcessing(true);
    try {
      const response = await verifyEmail(token);
      handleResponse(response.message);
    } catch (error) {
      if (error.response && error.response.data) {
        const message = error.response.data.message;
        handleResponse(message);
      } else {
        setVerificationMessage("Sunucuya bağlanılamadı.");
        setAlertType("alert-danger");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleResendToken = async () => {
    setIsProcessing(true);
    const queryParams = new URLSearchParams(location.search);
    const oldToken = queryParams.get("token");
    try {
      if (!oldToken) {
        return;
      }

      const response = await resendVerificationToken(oldToken);
      setVerificationMessage(response.message);
      setAlertType("alert-success");
    } catch (error) {
      console.log("Hata:", error);
      let message = "Bir hata oluştu.";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      setVerificationMessage(message);
      setAlertType("alert-danger");
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <div className="d-flex justify-content-center mt-lg-5">
      {isProcessing ? (
        <ProcessSpinner message="İsteğiniz işleniyor, lütfen bekleyin..." />
      ) : (
        <div className="col-12 col-md-6">
          <div className={`alert ${alertType}`} role="alert">
            {verificationMessage}
            {alertType === "alert-danger" && (
              <Button onClick={handleResendToken} className="btn btn-link">
                Doğrulama e-postasını tekrar gönder
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailVerification;
