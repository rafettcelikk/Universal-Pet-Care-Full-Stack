import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { BsLockFill, BsPersonFill } from "react-icons/bs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { loginUser } from "./AuthService";
import AlertMessage from "../common/AlertMessage";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      setShowErrorAlert(true);
      return;
    }

    try {
      const result = await loginUser(credentials.email, credentials.password);
      const token = result.data.token;
      if (token) {
        localStorage.setItem("authToken", token);
        const decoded = jwtDecode(token);
        localStorage.setItem("userRoles", JSON.stringify(decoded.roles));
        localStorage.setItem("userId", decoded.id);
        clearLoginForm();
        //navigate(from, { replace: true });
        window.location.href = from;
      } else {
        setErrorMessage(result.data.message);
        setShowErrorAlert(true);
      }
    } catch (error) {
      console.error("Giriş Hatası:", error);

      let errorMsg = "Beklenmedik bir hata oluştu.";

      if (error.response?.status === 401) {
        errorMsg = "E-posta adresiniz veya şifreniz hatalı.";
      } else {
        errorMsg =
          error.response?.data?.message ||
          error.response?.data?.data ||
          error.message ||
          errorMsg;
      }

      setErrorMessage(errorMsg);
      setShowErrorAlert(true);
    }
  };

  const clearLoginForm = () => {
    setCredentials({
      email: "",
      password: "",
    });
    setShowErrorAlert(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("authToken");
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={6}>
          <Card>
            {showErrorAlert && (
              <AlertMessage type={"danger"} message={errorMessage} />
            )}
            <Card.Body>
              <Card.Title className="mb-4 text-center">
                Kullanıcı Girişi
              </Card.Title>
              <Form onSubmit={handleLogin} noValidate>
                <Form.Group className="mt-3" controlId="username">
                  <Form.Label>Kullanıcı Adı</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsPersonFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="email"
                      value={credentials.email}
                      onChange={handleInputChange}
                      placeholder="E-posta adresi"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mt-3" controlId="password">
                  <Form.Label>Şifre</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsLockFill />
                    </InputGroup.Text>
                    <Form.Control
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      placeholder="Şifre"
                    />
                  </InputGroup>
                </Form.Group>
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="mt-4 w-100"
                >
                  Giriş Yap
                </Button>
              </Form>
              <div className="text-center mt-2">
                Hesabınız yok mu?{" "}
                <Link to="/register" style={{ textDecoration: "none" }}>
                  Kaydolun
                </Link>
                <div className="mt-2">
                  <Link
                    to="/password-reset-request"
                    style={{ textDecoration: "none" }}
                  >
                    Şifremi Unuttum?
                  </Link>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
