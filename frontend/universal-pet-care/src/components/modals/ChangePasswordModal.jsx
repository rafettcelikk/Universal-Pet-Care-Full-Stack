import React, { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { changeUserPassword } from "../user/UserService";
import AlertMessage from "../common/AlertMessage";

const ChangePasswordModal = ({ userId, show, handleClose }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await changeUserPassword(
        userId,
        passwords.currentPassword,
        passwords.newPassword,
        passwords.confirmNewPassword,
      );
      setSuccessMessage(response.data.message);
      handleReset();
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Bir hata oluştu");
      setShowErrorAlert(true);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleReset = () => {
    setPasswords({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setShowPassword(false);
    setShowErrorAlert(false);
    setShowSuccessAlert(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Şifre Değiştir</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="currentPassword" className="mb-3">
            <Form.Label>Mevcut Şifre:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handleInputChange}
                placeholder="Mevcut şifrenizi girin"
                required
              />
              <InputGroup.Text
                onClick={togglePasswordVisibility}
                style={{ cursor: "pointer" }}
              >
                {showPassword ? <FiEye size={20} /> : <FiEyeOff size={20} />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="newPassword" className="mb-3">
            <Form.Label>Yeni Şifre:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleInputChange}
                placeholder="Yeni şifrenizi girin"
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="confirmNewPassword" className="mb-3">
            <Form.Label>Yeni Şifreyi Onayla:</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handleInputChange}
                placeholder="Yeni şifrenizi tekrar girin"
                required
              />
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-center mt-4">
            <div className="mx-2">
              <Button variant="secondary" size="sm" type="submit">
                Şifreyi Değiştir
              </Button>
            </div>
            <div className="mx-2 mb-4">
              <Button variant="danger" size="sm" onClick={handleReset}>
                Sıfırla
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
