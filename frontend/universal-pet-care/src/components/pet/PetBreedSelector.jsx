import React, { useState, useEffect } from "react";
import { Col, Form } from "react-bootstrap";
import AddItemModal from "../modals/AddItemModal";
import { getPetBreeds } from "./PetService";

const PetBreedSelector = ({ petType, value, onChange }) => {
  const [petBreeds, setPetBreeds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (petType) {
      const fetchPetBreeds = async () => {
        try {
          const response = await getPetBreeds(petType);
          setPetBreeds(response.data);
        } catch (error) {
          console.error("Irklar yüklenemedi");
        }
      };
      fetchPetBreeds();
    } else {
      setPetBreeds([]);
    }
  }, [petType]);

  const handleBreedChange = (e) => {
    if (e.target.value === "add-new-breed") {
      setShowModal(true);
    } else {
      onChange(e);
    }
  };

  const handleSaveNewItem = (newBreed) => {
    if (newBreed && !petBreeds.includes(newBreed)) {
      setPetBreeds([...petBreeds, newBreed]);
      onChange({ target: { name: "breed", value: newBreed } });
      setShowModal(false);
    }
  };

  return (
    <React.Fragment>
      <Form.Group controlId="petBreed">
        <Form.Control
          as="select"
          name="breed"
          value={value}
          onChange={handleBreedChange}
          required
        >
          <option value="">Irk Seçin</option>
          <option value="add-new-breed" className="fw-bold text-primary">
            + Yeni Irk Ekle
          </option>
          {petBreeds.map((breed) => (
            <option key={breed} value={breed}>
              {breed}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveNewItem}
        itemLabel="Irk"
      />
    </React.Fragment>
  );
};

export default PetBreedSelector;
