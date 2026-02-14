import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import PetTypeSelector from "../pet/PetTypeSelector";
import PetBreedSelector from "../pet/PetBreedSelector";
import PetColorSelector from "../pet/PetColorSelector";

const AddPetModal = ({ show, onHide, onAddPet, appointmentId }) => {
  const initialState = {
    name: "",
    type: "",
    breed: "",
    color: "",
    age: "",
  };

  const [newPet, setNewPet] = useState(initialState);

  useEffect(() => {
    if (!show) setNewPet(initialState);
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPet = () => {
    onAddPet(appointmentId, newPet);
    console.log("Kaydedilen Hayvan: ", newPet);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="text-primary">
          Yeni Evcil Hayvan Ekle
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <Form>
          <Row>
            <Col md={12} className="mb-3">
              <Form.Label className="fw-bold">Hayvan Adı</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newPet.name}
                onChange={handleChange}
                placeholder="Pamuk, Karabaş vb."
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label className="fw-bold">Türü</Form.Label>
              <PetTypeSelector value={newPet.type} onChange={handleChange} />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label className="fw-bold">Irkı</Form.Label>
              <PetBreedSelector
                petType={newPet.type}
                value={newPet.breed}
                onChange={handleChange}
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label className="fw-bold">Rengi</Form.Label>
              <PetColorSelector value={newPet.color} onChange={handleChange} />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label className="fw-bold">Yaşı</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={newPet.age}
                onChange={handleChange}
                placeholder="0"
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button variant="secondary" onClick={onHide}>
          İptal
        </Button>
        <Button variant="success" onClick={handleAddPet} className="px-4">
          Kaydet
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddPetModal;
