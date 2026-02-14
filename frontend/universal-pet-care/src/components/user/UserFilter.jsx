import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

const UserFilter = ({
  label,
  values = [],
  selectedValue,
  onSelectValue,
  onClearFilters,
}) => {
  return (
    <InputGroup className="mb-4">
      <InputGroup.Text>{label}na Göre Filtrele</InputGroup.Text>
      <Form.Select
        className="form-control"
        value={selectedValue}
        onChange={(e) => onSelectValue(e.target.value)}
      >
        <option value="" disabled>
          {label.toLowerCase()} seçiniz
        </option>
        {values.map((value, index) => (
          <option key={index} value={value}>
            {value}
          </option>
        ))}
      </Form.Select>
      <Button variant="secondary" onClick={onClearFilters}>
        Filtreleri Temizle
      </Button>
    </InputGroup>
  );
};

export default UserFilter;
