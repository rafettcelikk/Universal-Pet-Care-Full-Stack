import { useState } from "react";
import { dateTimeFormatter } from "../utils/utilities";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { tr } from "date-fns/locale";
import DatePicker, { registerLocale } from "react-datepicker";
import PetEntry from "../pet/PetEntry";
import { FaPlus } from "react-icons/fa";
import { bookAppointment } from "./AppointmentService";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";

registerLocale("tr", tr);

const BookAppointment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const initialPet = {
    name: "",
    type: "",
    color: "",
    breed: "",
    age: "",
  };

  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    pets: [initialPet],
  });

  const {
    successMessage,
    setSuccessMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    errorMessage,
    setErrorMessage,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const { recipientId } = useParams();
  const senderId = localStorage.getItem("userId");

  const handleDateChange = (date) => {
    setFormData((prevState) => ({
      ...prevState,
      appointmentDate: date,
    }));
  };

  const handleTimeChange = (time) => {
    setFormData((prevState) => ({
      ...prevState,
      appointmentTime: time,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePetChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      pets: prevState.pets.map((pet, i) =>
        i === index ? { ...pet, [name]: value } : pet,
      ),
    }));
  };

  const addPet = () => {
    setFormData((prevState) => ({
      ...prevState,
      pets: [...prevState.pets, { ...initialPet }],
    }));
  };

  const removePet = (index) => {
    const filteredPets = formData.pets.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      pets: filteredPets,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recipientId || recipientId === "undefined") {
      setErrorMessage("Veteriner bilgisi bulunamadı. Lütfen tekrar deneyiniz.");
      setShowErrorAlert(true);
      return;
    }

    const { appointmentDate, appointmentTime } = formData;
    const { formattedDate, formattedTime } = dateTimeFormatter(
      appointmentDate,
      appointmentTime,
    );

    const request = {
      appointment: {
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        reason: formData.reason,
      },
      pets: formData.pets,
    };

    setIsProcessing(true);
    try {
      console.log(
        "Backend'e Giden Ham Veri:",
        JSON.stringify(request, null, 2),
      );

      const response = await bookAppointment(senderId, recipientId, request);
      setSuccessMessage(response.message);
      handleReset();
      setShowSuccessAlert(true);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Bir hata oluştu.";
      if (error.response?.status === 401) {
        setErrorMessage("Yetkisiz işlem. Lütfen giriş yapınız.");
      } else {
        setErrorMessage(errorMsg);
      }
      setShowErrorAlert(true);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  const handleReset = () => {
    setFormData({
      appointmentDate: "",
      appointmentTime: "",
      reason: "",
      pets: [{ ...initialPet }],
    });
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col lg={8} md={10} sm={12}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header
                as="h5"
                className="text-center bg-primary text-white"
              >
                Randevu Kayıt Formu
              </Card.Header>
              <Card.Body>
                <fieldset className="field-set mb-4 p-3 border rounded">
                  <legend className="text-center px-2">
                    Randevu Bilgileri
                  </legend>
                  <Form.Group
                    as={Row}
                    className="mb-4 justify-content-center gap-3"
                  >
                    <Col xs="auto">
                      <DatePicker
                        selected={formData.appointmentDate}
                        onChange={handleDateChange}
                        dateFormat="dd-MM-yyyy"
                        className="form-control"
                        locale="tr"
                        minDate={new Date()}
                        placeholderText="Randevu Tarihi"
                        required
                      />
                    </Col>
                    <Col xs="auto">
                      <DatePicker
                        selected={formData.appointmentTime}
                        onChange={handleTimeChange}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Saat"
                        locale="tr"
                        dateFormat="HH:mm"
                        className="form-control"
                        placeholderText="Randevu Saati"
                        required
                      />
                    </Col>
                  </Form.Group>
                </fieldset>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Randevu Nedeni</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    placeholder="Randevu nedeninizi giriniz..."
                    required
                  />
                </Form.Group>

                <h5 className="text-center mb-3">Evcil Hayvan Bilgileri</h5>
                <hr />
                {formData.pets.map((pet, index) => (
                  <PetEntry
                    key={index}
                    pet={pet}
                    index={index}
                    handleInputChange={(e) => handlePetChange(index, e)}
                    removePet={removePet}
                    canRemove={formData.pets.length > 1}
                  />
                ))}

                {showErrorAlert && (
                  <AlertMessage type="danger" message={errorMessage} />
                )}
                {showSuccessAlert && (
                  <AlertMessage type="success" message={successMessage} />
                )}

                <div className="d-flex justify-content-center mb-3 mt-4">
                  <OverlayTrigger overlay={<Tooltip>Yeni Hayvan Ekle</Tooltip>}>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={addPet}
                      className="me-3"
                    >
                      <FaPlus /> Hayvan Ekle
                    </Button>
                  </OverlayTrigger>

                  <Button
                    type="submit"
                    variant="primary"
                    className="me-3 px-4"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="Kaydediliyor..." />
                    ) : (
                      "Randevuyu Tamamla"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleReset}
                  >
                    Temizle
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;
