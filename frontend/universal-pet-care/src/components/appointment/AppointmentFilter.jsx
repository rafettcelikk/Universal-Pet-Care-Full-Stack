import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { formattedAppointmentStatuses } from "../utils/utilities";

const AppointmentFilter = ({
  statuses = [],
  selectedStatus,
  onSelectStatus,
  onClearFilters,
}) => {
  return (
    <Container className="mt-5">
      <Row>
        <Col xs={12} md={6}>
          <Form>
            <Form.Group>
              <Form.Label>Randevu Durumuna Göre Filtrele</Form.Label>
              <InputGroup>
                <Form.Select
                  value={selectedStatus}
                  onChange={(e) => onSelectStatus(e.target.value)}
                >
                  <option value="all">Tüm Durumlar</option>
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>
                      {formattedAppointmentStatuses(status)}
                    </option>
                  ))}
                </Form.Select>
                <Button
                  className="ms-4"
                  variant="secondary"
                  type="button"
                  onClick={onClearFilters}
                >
                  Temizle
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AppointmentFilter;
