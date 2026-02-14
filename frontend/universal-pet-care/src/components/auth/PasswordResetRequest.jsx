import React, { useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Button, Card, Container, Form } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import { requestPasswordReset } from "./AuthService";

const PasswordResetRequest = () => {
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await requestPasswordReset(email);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      setEmail("");
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ marginTop: "100px" }}
    >
      <Card style={{ maxWidth: "600px" }} className="w-100">
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        <Card.Body>
          <Card.Title>Şifremi Unuttum</Card.Title>
          <Form onSubmit={handleSubmit} noValidate>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>E-posta Adresi</Form.Label>
              <Form.Control
                type="email"
                placeholder="E-posta adresinizi girin"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Text className="text-muted">
                Şifre sıfırlama linki, e-posta adresinize gönderilecektir.
              </Form.Text>
            </Form.Group>
            <Button variant="outline-info" type="submit" className="mt-2">
              {isProcessing ? (
                <ProcessSpinner message="Doğrulama linki gönderiliyor..." />
              ) : (
                "Şifre Sıfırla"
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PasswordResetRequest;
