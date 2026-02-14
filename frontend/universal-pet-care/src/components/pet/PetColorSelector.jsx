import React, { useState, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import AddItemModal from "../modals/AddItemModal";
import { getPetColors } from "./PetService";

const PetColorSelector = ({ value, onChange }) => {
  const [petColors, setPetColors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPetColors = async () => {
      try {
        const response = await getPetColors();
        setPetColors(response.data);
      } catch (error) {
        console.error("Renkler yüklenemedi");
      }
    };
    fetchPetColors();
  }, []);

  const handleColorChange = (e) => {
    if (e.target.value === "add-new-color") {
      setShowModal(true);
    } else {
      onChange(e);
    }
  };

  const handleSaveNewItem = (newColor) => {
    if (newColor && !petColors.includes(newColor)) {
      setPetColors([...petColors, newColor]);
      onChange({ target: { name: "color", value: newColor } });
      setShowModal(false);
    }
  };

  return (
    <React.Fragment>
      <Form.Group controlId="petColor">
        <Form.Control
          as="select"
          name="color"
          value={value}
          onChange={handleColorChange}
          required
        >
          <option value="">Renk Seçin</option>
          <option value="add-new-color" className="fw-bold text-primary">
            + Yeni Renk Ekle
          </option>
          {petColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveNewItem}
        itemLabel="Renk"
      />
    </React.Fragment>
  );
};

export default PetColorSelector;
