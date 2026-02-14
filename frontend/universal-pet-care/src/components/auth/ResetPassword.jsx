import React, { useEffect, useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Card, Container, Form, Button } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import { validateToken, resetPassword } from "./AuthService";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenStatus, setTokenStatus] = useState("PENDING"); // PENDING, VALID, EXPIRED
  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("token");

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

  useEffect(() => {
    if (token) {
      validateToken(token)
        .then((response) => {
          setTokenStatus(response.message);
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          setShowErrorAlert(true);
        });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await resetPassword(token, newPassword);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ marginTop: "100px" }}
    >
      <Card style={{ maxWidth: "600px" }} className="w-100">
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}

        {tokenStatus === "TOKEN_VALID" ? (
          <Card.Body>
            <Card.Title>Şifreni sıfırla</Card.Title>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="emailInput">
                <Form.Label>Yeni Şifre</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Yeni şifrenizi girin"
                />
              </Form.Group>

              <Button variant="outline-info" type="submit" className="mt-2">
                {isProcessing ? (
                  <ProcessSpinner message="Şifre sıfırlanıyor, lütfen bekleyin..." />
                ) : (
                  "Şifre Sıfırla"
                )}
              </Button>
            </Form>
          </Card.Body>
        ) : tokenStatus === "PENDING" ? (
          <Card.Body>
            <ProcessSpinner message="Token doğrulanıyor, lütfen bekleyin..." />
          </Card.Body>
        ) : (
          <Card.Body>
            <AlertMessage
              type={"danger"}
              message={
                "Geçersiz veya süresi dolmuş token. Lütfen şifre sıfırlama talebinizi tekrar gönderin."
              }
            />
          </Card.Body>
        )}
      </Card>
    </Container>
  );
};

export default ResetPassword;
