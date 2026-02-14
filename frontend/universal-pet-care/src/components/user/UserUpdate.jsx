import React, { useEffect, useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "./UserService";
import { Card, Col, Container, Form, Button } from "react-bootstrap";
import VetSpecializationSelector from "../veterinarian/VetSpecializationSelector";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";

const UserUpdate = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    userType: "",
    gender: "",
    phoneNumber: "",
    specialization: "",
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

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getUserById(userId);
        setUser(response.data);
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setShowErrorAlert(true);
      }
    };
    getUser();
  }, [userId]);

  const handleUserInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleUserUpdate = async (e) => {
    e.preventDefault();
    const updatedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userType: user.userType,
      gender: user.gender,
      phoneNumber: user.phoneNumber,
      specialization: user.specialization,
    };
    try {
      setIsProcessing(true);
      const response = await updateUser(updatedUser, userId);
      console.log("Api response", response);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelEdit = () => {
    navigate(`/user-dashboard/${userId}/my-dashboard`);
  };
  return (
    <Container md={6} className="d-flex justify-content-center mt-5">
      <Col md={6}>
        <Form onSubmit={handleUserUpdate}>
          <Card className="shadow mb-5">
            <Card.Header className="text-center mb-2">
              Kullanıcı Bilgilerini Güncelle
            </Card.Header>
            <Card.Body>
              <fieldset className="field-set">
                <legend>Kullanıcı Bilgileri</legend>
                <Form.Group
                  as={Col}
                  controlId="nameFields"
                  className="mb-2 d-flex"
                >
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleUserInputChange}
                    style={{ marginRight: "10px" }}
                  />
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleUserInputChange}
                  />
                </Form.Group>
              </fieldset>
              <Form.Group as={Col} controlId="gender" className="mb-2">
                <Form.Label className="legend">Cinsiyet</Form.Label>
                <Form.Control
                  as="select"
                  name="gender"
                  value={user.gender}
                  onChange={handleUserInputChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="Male">Erkek</option>
                  <option value="Female">Kadın</option>
                  <option value="Other">Diğer</option>
                </Form.Control>
              </Form.Group>
              <Form.Group as={Col} controlId="userType" className="mb-2">
                <Form.Label className="legend">Kullanıcı Türü</Form.Label>
                <Form.Control
                  type="text"
                  name="userType"
                  value={
                    user.userType === "VET"
                      ? "Veteriner"
                      : user.userType === "PATIENT"
                        ? "Hasta"
                        : user.userType === "ADMIN"
                          ? "Yönetici"
                          : ""
                  }
                  onChange={handleUserInputChange}
                  disabled
                />
              </Form.Group>
              <fieldset className="field-set mb-2 mt-2">
                <legend>İletişim Bilgileri</legend>
                <Form.Group
                  as={Col}
                  controlId="emailPhoneFields"
                  className="mb-2 d-flex"
                >
                  <Form.Control
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleUserInputChange}
                    style={{ marginRight: "10px" }}
                    disabled
                  />
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    placeholder="Mobil İletişim"
                    value={user.phoneNumber}
                    onChange={handleUserInputChange}
                  />
                </Form.Group>
              </fieldset>

              {user.userType === "VET" && (
                <Form.Group controlId="specialization" className="mb-4">
                  <Form.Label className="legend">Uzmanlık Alanı</Form.Label>
                  <VetSpecializationSelector
                    onChange={handleUserInputChange}
                    user={user}
                    set={setUser}
                  />
                </Form.Group>
              )}
              {showErrorAlert && (
                <AlertMessage type="danger" message={errorMessage} />
              )}
              {showSuccessAlert && (
                <AlertMessage type="success" message={successMessage} />
              )}

              <div className="d-flex justify-content-center">
                <div className="mx-2">
                  <Button
                    type="submit"
                    variant="outline-warning"
                    size="sm"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="Süreç devam ediyor..." />
                    ) : (
                      "Güncelle"
                    )}
                  </Button>
                </div>
                <div className="mx-2">
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    Profiline Geri Dön
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Form>
      </Col>
    </Container>
  );
};

export default UserUpdate;
