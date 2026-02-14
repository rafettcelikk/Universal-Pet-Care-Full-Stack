import React, { useState, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import AddItemModal from "../modals/AddItemModal";
import { getPetTypes } from "./PetService";

const PetTypeSelector = ({ value, onChange }) => {
  const [petTypes, setPetTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPetTypes = async () => {
      try {
        const response = await getPetTypes();
        setPetTypes(response.data);
      } catch (error) {
        console.error("Türler yüklenemedi:", error.response?.data?.message);
      }
    };
    fetchPetTypes();
  }, []);

  const handleTypeChange = (e) => {
    if (e.target.value === "add-new-type") {
      setShowModal(true);
    } else {
      onChange(e);
    }
  };

  const handleSaveNewItem = (newType) => {
    if (newType && !petTypes.includes(newType)) {
      setPetTypes([...petTypes, newType]);
      onChange({ target: { name: "type", value: newType } });
      setShowModal(false);
    }
  };

  return (
    <React.Fragment>
      <Form.Group controlId="petType">
        <Form.Control
          as="select"
          name="type"
          value={value}
          onChange={handleTypeChange}
          required
        >
          <option value="">Tür Seçin</option>
          <option value="add-new-type" className="fw-bold text-primary">
            + Yeni Tür Ekle
          </option>
          {petTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveNewItem}
        itemLabel="Tür"
      />
    </React.Fragment>
  );
};

export default PetTypeSelector;
