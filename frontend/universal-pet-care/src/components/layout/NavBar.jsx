import React from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logout } from "../auth/AuthService";

const NavBar = () => {
  const isLoggedIn = localStorage.getItem("authToken");
  const userRoles = localStorage.getItem("userRoles") || [];
  const userId = localStorage.getItem("userId") || "";

  const handleLogout = () => {
    logout();
  };
  return (
    <Navbar expand="lg" sticky="top" className="nav-bg">
      <Container>
        <Navbar.Brand to={"/"} as={Link} className="nav-home">
          Evrensel Evcil Hayvan Bakımı
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to={"/veterinarians"} as={Link}>
              Veterinerlerimizle Tanışın
            </Nav.Link>
          </Nav>
          <Nav>
            <NavDropdown title="Hesap" id="basic-nav-dropdown">
              {!isLoggedIn ? (
                <React.Fragment>
                  <NavDropdown.Item to={"/register"} as={Link}>
                    Kaydol
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"/login"} as={Link}>
                    Giriş Yap
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NavDropdown.Item
                    to={`/user-dashboard/${userId}/my-dashboard`}
                    as={Link}
                  >
                    Kullanıcı Panelim
                  </NavDropdown.Item>
                  {userRoles.includes("ROLE_ADMIN") && (
                    <React.Fragment>
                      <NavDropdown.Divider />
                      <NavDropdown.Item
                        to={`/admin-dashboard/${userId}/admin-dashboard`}
                        as={Link}
                      >
                        Yönetici Panelim
                      </NavDropdown.Item>
                    </React.Fragment>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item to={"/"} as={Link} onClick={handleLogout}>
                    Çıkış Yap
                  </NavDropdown.Item>
                </React.Fragment>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
