import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { BsCheck, BsX } from "react-icons/bs";

const PatientEditTableRow = ({ patient, onSave, onCancel }) => {
  const [editedPatient, setEditedPatient] = useState(patient);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(patient.id, editedPatient, onCancel);
  };
  return (
    <tr>
      <td>
        <Form.Control
          type="text"
          name="firstName"
          value={editedPatient.firstName}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="lastName"
          value={editedPatient.lastName}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type="email"
          name="email"
          value={editedPatient.email}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          type="text"
          name="phoneNumber"
          value={editedPatient.phoneNumber}
          onChange={handleInputChange}
        />
      </td>
      <td>
        <Form.Control
          as={"select"}
          name="gender"
          value={editedPatient.gender}
          onChange={handleInputChange}
        >
          <option value="" disabled>
            Seçiniz
          </option>
          <option value="Male">Erkek</option>
          <option value="Female">Kadın</option>
          <option value="Other">Diğer</option>
        </Form.Control>
      </td>
      <td>
        <Button
          variant="success"
          size="sm"
          onClick={handleSave}
          className="me-2"
        >
          <BsCheck />
        </Button>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          <BsX />
        </Button>
      </td>
    </tr>
  );
};

export default PatientEditTableRow;
