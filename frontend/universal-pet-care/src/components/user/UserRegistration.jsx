import { useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import { Link } from "react-router-dom";
import VetSpecializationSelector from "../veterinarian/VetSpecializationSelector";
import { registerUser } from "./UserService";

const UserRegistration = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    phoneNumber: "",
    email: "",
    password: "",
    userType: "",
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

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const response = await registerUser(user);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      setIsProcessing(false);
      handleReset();
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUser({
      firstName: "",
      lastName: "",
      gender: "",
      phoneNumber: "",
      email: "",
      password: "",
      userType: "",
      specialization: "",
    });
    set;
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header className="text-center">
                Kullanıcı Kayıt Formu
              </Card.Header>
              <Card.Body>
                <fieldset>
                  <legend>Kullanıcı Bilgileri</legend>
                  <Row>
                    <Col xs={6} className="mb-2 mb-sm-0">
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={user.firstName}
                        onChange={handleInputChange}
                        placeholder="Ad"
                        required
                      />
                    </Col>
                    <Col xs={6} className="mb-2 mb-sm-0">
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={user.lastName}
                        onChange={handleInputChange}
                        placeholder="Soyad"
                        required
                      />
                    </Col>
                  </Row>
                </fieldset>
                <Form.Group as={Row} className="mb-3" controlId="gender">
                  <Col>
                    <Form.Label>Cinsiyet</Form.Label>
                    <Form.Control
                      as="select"
                      name="gender"
                      required
                      value={user.gender}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Cinsiyet Seçiniz
                      </option>
                      <option value="Male">Erkek</option>
                      <option value="Female">Kadın</option>
                      <option value="Other">Diğer</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                <fieldset>
                  <legend>İletişim Bilgileri</legend>
                  <Row>
                    <Col sm={6} className="mb-2 mb-sm-0">
                      <Form.Control
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        placeholder="E-posta"
                        required
                      />
                    </Col>
                    <Col sm={6} className="mb-2 mb-sm-0">
                      <Form.Control
                        type="text"
                        name="phoneNumber"
                        value={user.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Telefon Numarası"
                        required
                      />
                    </Col>
                  </Row>
                </fieldset>
                <Form.Group as={Row} className="mb-3" controlId="password">
                  <Col>
                    <Form.Label>Şifre</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleInputChange}
                      placeholder="Şifre"
                      required
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="user-type">
                  <Col>
                    <Form.Label>Kullanıcı Türü</Form.Label>
                    <Form.Control
                      as="select"
                      name="userType"
                      required
                      value={user.userType}
                      onChange={handleInputChange}
                    >
                      <option value="" disabled>
                        Kullanıcı Türü Seçiniz
                      </option>
                      <option value="PATIENT">Evcil Hayvan Sahibi</option>
                      <option value="VET">Veteriner</option>
                    </Form.Control>
                  </Col>
                </Form.Group>
                {user.userType === "VET" && (
                  <Form.Group>
                    <Row>
                      <Col>
                        <VetSpecializationSelector
                          value={user.specialization}
                          onChange={handleInputChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                )}
                <div className="d-flex justify-content-center mb-3">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="Kayıt Yapılıyor..." />
                    ) : (
                      "Kaydol"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-info"
                    size="sm"
                    onClick={handleReset}
                  >
                    Sıfırla
                  </Button>
                </div>
                {showSuccessAlert && (
                  <div className="mb-3">
                    <AlertMessage type="success" message={successMessage} />
                  </div>
                )}
                {showErrorAlert && (
                  <div className="mb-3">
                    <AlertMessage type="danger" message={errorMessage} />
                  </div>
                )}
                <div className="text-center">
                  Zaten kayıtlı mısınız?{" "}
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    Giriş Yap
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegistration;
