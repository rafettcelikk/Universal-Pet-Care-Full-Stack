import React, { useState } from "react";
import { Button, Card, Col, ListGroup, Row, Container } from "react-bootstrap";
import UserPhoto from "../common/UserPhoto";
import { Link } from "react-router-dom";
import PhotoUploaderModal from "../modals/PhotoUploaderModal";
import ChangePasswordModal from "../modals/ChangePasswordModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import style from "../user/UserProfile.module.css";

const UserProfile = ({ user, handleRemovePhoto, handleDeleteAccount }) => {
  const [showPhotoUploaderModal, setShowPhotoUploaderModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const currentUserId = localStorage.getItem("userId");

  const isCurrentUser = user.id == currentUserId;

  const handleShowPhotoUploaderModal = () => {
    setShowPhotoUploaderModal(true);
  };

  const handleClosePhotoUploaderModal = () => {
    setShowPhotoUploaderModal(false);
  };

  const handleShowChangePasswordModal = () => {
    setShowChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleShowDeleteModal = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteAndCloseModal = async () => {
    try {
      await handleDeleteAccount();
      setShowDeleteModal(false);
    } catch (error) {
      console.error(error.message);
    }
  };

  const roleLabels = {
    ADMIN: "Yönetici",
    PATIENT: "Hasta",
    VET: "Veteriner",
  };
  return (
    <Container>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={handleCloseDeleteModal}
        onConfirm={handleDeleteAndCloseModal}
        itemToDelete={"kullanıcı hesabını"}
      />
      <React.Fragment>
        <Row>
          <Col md={3}>
            <Card className="text-center mb-3 shadow">
              <Card.Body>
                <UserPhoto userId={user.id} userPhoto={user.photo} />
              </Card.Body>
              {isCurrentUser && (
                <div className="text-center">
                  <p>
                    <Link
                      to={"#"}
                      onClick={handleShowPhotoUploaderModal}
                      style={{ textDecoration: "none" }}
                    >
                      Fotoğrafı Değiştir
                    </Link>
                  </p>
                  <PhotoUploaderModal
                    userId={user.id}
                    show={showPhotoUploaderModal}
                    handleClose={handleClosePhotoUploaderModal}
                  />
                  <p>
                    <Link
                      to={"#"}
                      onClick={handleRemovePhoto}
                      style={{ textDecoration: "none" }}
                    >
                      Fotoğrafı Kaldır
                    </Link>
                  </p>
                  <p>
                    <Link
                      to={"#"}
                      onClick={handleShowChangePasswordModal}
                      style={{ textDecoration: "none" }}
                    >
                      Şifre Değiştir
                    </Link>
                  </p>
                  <ChangePasswordModal
                    userId={user.id}
                    show={showChangePasswordModal}
                    handleClose={handleCloseChangePasswordModal}
                  />
                </div>
              )}
            </Card>
            {isCurrentUser && (
              <Card.Body>
                <div className="d-flex justify-content-center mb-4">
                  <div className="mx-2">
                    <Link
                      to={`/user-update/${user.id}/update`}
                      className="btn btn-warning btn-sm"
                    >
                      Profili Düzenle
                    </Link>
                  </div>
                  <div className="mx-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleShowDeleteModal}
                    >
                      Hesabı Sil
                    </Button>
                  </div>
                </div>
              </Card.Body>
            )}
          </Col>
          <Col md={8}>
            <Card>
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Ad:</Col>
                <Col md={4}>
                  <Card.Text>{user.firstName}</Card.Text>
                </Col>
              </Card.Body>
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Soyad:</Col>
                <Col md={4}>
                  <Card.Text>{user.lastName}</Card.Text>
                </Col>
              </Card.Body>
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Cinsiyet:</Col>
                <Col md={4}>
                  <Card.Text>
                    {user?.gender === "female"
                      ? "Kadın"
                      : user?.gender === "male"
                        ? "Erkek"
                        : "Diğer"}
                  </Card.Text>
                </Col>
              </Card.Body>
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>E-posta:</Col>
                <Col md={4}>
                  <Card.Text>{user.email}</Card.Text>
                </Col>
              </Card.Body>
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Telefon Numarası:</Col>
                <Col md={4}>
                  <Card.Text>{user.phoneNumber}</Card.Text>
                </Col>
              </Card.Body>
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Kullanıcı Türü:</Col>
                <Col md={4}>
                  <Card.Text>
                    {user?.userType === "VET"
                      ? "Veteriner"
                      : user?.userType === "PATIENT"
                        ? "Hasta"
                        : user?.userType === "ADMIN"
                          ? "Yönetici"
                          : ""}
                  </Card.Text>
                </Col>
              </Card.Body>
              {user?.userType === "VET" && (
                <Card.Body className="d-flex align-items-center">
                  <Col md={4}>Uzmanlık Dalı:</Col>
                  <Col md={4}>
                    <Card.Text>{user.specialization}</Card.Text>
                  </Col>
                </Card.Body>
              )}
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>Hesap Durumu:</Col>
                <Col md={4}>
                  <Card.Text
                    className={user.enabled ? style.active : style.inactive}
                  >
                    {user.enabled ? "Aktif" : "Pasif"}
                  </Card.Text>
                </Col>
              </Card.Body>
            </Card>
            <Card className="mb-3 shadow">
              <Card.Body className="d-flex align-items-center">
                <Col md={2}>Roller: </Col>
                <Col md={4}>
                  <ListGroup variant="flush">
                    {user.roles?.map((role, index) => {
                      const cleanRole = role ? role.replace("ROLE_", "") : "";
                      const translatedRole = roleLabels[cleanRole] || cleanRole;
                      return (
                        <ListGroup.Item key={index} className="text-success">
                          {translatedRole}
                        </ListGroup.Item>
                      );
                    })}
                  </ListGroup>
                </Col>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
