import React from "react";
import { Button, Modal } from "react-bootstrap";

const DeleteConfirmationModal = ({
  show,
  onHide,
  onConfirm,
  itemToDelete,
  loading,
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Silme İşlemini Onayla</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bu {itemToDelete} silmek istediğinizden emin misiniz? Bu işlem geri
        alınamaz.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          İptal
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Sil
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteConfirmationModal;
