import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddItemModal = ({ show, handleClose, handleSave, itemLabel }) => {
  const [itemValue, setItemValue] = useState("");

  const handleSaveItem = () => {
    handleSave(itemValue);
    setItemValue("");
    handleClose();
  };

  const handleInputChange = (e) => {
    setItemValue(e.target.value);
  };
  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Yeni {itemLabel} Ekle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{itemLabel} Adı</Form.Label>
              <Form.Control
                type="text"
                placeholder={`${itemLabel.toLowerCase()} adını girin`}
                value={itemValue}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
          <Modal.Footer className="mt-2">
            <Button variant="secondary" onClick={handleSaveItem}>
              Kaydet
            </Button>
            <Button variant="danger" onClick={handleClose}>
              Kapat
            </Button>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddItemModal;
