import React, { useState, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("tr", tr);

const AppointmentUpdateModal = ({
  show,
  handleClose,
  appointment,
  handleUpdate,
}) => {
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (appointment?.appointmentDate) {
      setDate(new Date(appointment.appointmentDate));
      setTime(
        new Date(
          `${appointment.appointmentDate}T${appointment.appointmentTime}`,
        ),
      );
      setReason(appointment.reason || "");
    }
  }, [appointment]);

  const handleSubmit = () => {
    if (!date || !time) return alert("Tarih ve saat seçmelisiniz.");
    const formattedDate = date.toLocaleDateString("en-CA");
    const formattedTime = time.toTimeString().slice(0, 5);

    handleUpdate({
      ...appointment,
      appointmentDate: formattedDate,
      appointmentTime: formattedTime,
      reason,
    });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Güncelle</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="me-2">Tarih</Form.Label>
            <DatePicker
              selected={date}
              onChange={setDate}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              locale="tr"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="me-2">Saat</Form.Label>
            <DatePicker
              selected={time}
              onChange={setTime}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Saat"
              dateFormat="HH:mm"
              className="form-control"
              locale="tr"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Sebep</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Kapat
        </Button>
        <Button variant="info" onClick={handleSubmit}>
          Güncelle
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentUpdateModal;
