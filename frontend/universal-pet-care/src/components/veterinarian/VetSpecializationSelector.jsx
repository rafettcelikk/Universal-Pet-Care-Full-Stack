import React, { useEffect, useState } from "react";
import { getAllSpecializations } from "./VeterinarianService";
import { Col, Form } from "react-bootstrap";
import AddItemModal from "../modals/AddItemModal";

const VetSpecializationSelector = ({ value, onChange }) => {
  const [specializations, setSpecializations] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAllSpecializations = async () => {
      try {
        const response = await getAllSpecializations();
        console.log("Javadan ne geldi: ", response.data);
        const actualData = response.data.data || response.data;
        if (Array.isArray(actualData)) {
          setSpecializations(actualData);
        } else {
          console.log("Beklenmeyen veri formatı:", actualData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchAllSpecializations();
  }, []);

  const handleSpecializationChange = (e) => {
    if (e.target.value === "Yeni Uzmanlık Ekle") {
      setShowModal(true);
    } else {
      onChange(e);
    }
  };

  const handleSaveNewItem = (newItem) => {
    if (newItem && !specializations.includes(newItem)) {
      setSpecializations([...specializations, newItem]);
      onChange({ target: { value: newItem, name: "specialization" } });
    }
  };
  return (
    <React.Fragment>
      <Form.Group as={Col} controlId="specialization" className="mb-4">
        <Form.Control
          as="select"
          name="specialization"
          value={value}
          required
          onChange={handleSpecializationChange}
        >
          <option value="" disabled>
            Uzmanlık Seçiniz
          </option>
          {specializations.map((specialization) => (
            <option key={specialization} value={specialization}>
              {specialization}
            </option>
          ))}
          <option value="Yeni Uzmanlık Ekle">Yeni Uzmanlık Ekle</option>
        </Form.Control>
      </Form.Group>
      <AddItemModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        itemLabel={"Uzmanlık"}
        handleSave={handleSaveNewItem}
      />
    </React.Fragment>
  );
};

export default VetSpecializationSelector;
