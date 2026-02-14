import React, { useEffect, useState } from "react";
import { getUserById } from "../user/UserService";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import {
  uploadUserPhoto,
  updateUserPhoto,
} from "../photo/PhotoUploaderService";

const PhotoUploaderModal = ({ userId, show, handleClose }) => {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);

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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getUserData = async () => {
    try {
      const response = await getUserById(userId);
      setUser(response.data);
      console.log("Kullanıcı verisi:", response.data);
      console.log("Kullanıcı id'si:", userId);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    getUserData();
  }, [userId]);

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      let response;
      if (user && user.photo) {
        response = await updateUserPhoto(user.photoId, formData);
      } else {
        response = await uploadUserPhoto(formData);
      }

      setSuccessMessage(response.data);
      window.location.reload();
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      console.error("Yükleme Hatası:", error);
    }
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Fotoğraf Yükle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showErrorAlert && (
          <AlertMessage type={"danger"} message={errorMessage} />
        )}
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMessage} />
        )}
        <Form>
          <h6>Lütfen yüklemek istediğiniz fotoğrafı seçin:</h6>
          <InputGroup>
            <Form.Control type="file" onChange={handleFileChange} />
            <Button variant="secondary" onClick={handlePhotoUpload}>
              Fotoğrafı Yükle
            </Button>
          </InputGroup>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PhotoUploaderModal;
