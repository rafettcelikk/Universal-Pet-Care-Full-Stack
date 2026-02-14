import React, { useEffect, useState } from "react";
import { tr } from "date-fns/locale";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import { Button, Col, Form, Row } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertMessage from "../common/AlertMessage";
import {
  findAvailableVeterinarians,
  getAllSpecializations,
  getVeterinarians,
} from "./VeterinarianService";
import { dateTimeFormatter } from "../utils/utilities";

registerLocale("tr", tr);

const VeterinarianSearch = ({ onSearchResults }) => {
  const [specializations, setSpecializations] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    date: null,
    time: null,
    specialization: "",
  });
  const [showDateTime, setShowDateTime] = useState(false);
  const { errorMessage, setErrorMessage, showErrorAlert, setShowErrorAlert } =
    UseMessageAlerts();

  const handleInputChange = (e) => {
    setSearchQuery({
      ...searchQuery,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setSearchQuery((prevState) => ({
      ...prevState,
      date: date,
    }));
  };

  const handleTimeChange = (time) => {
    setSearchQuery((prevState) => ({
      ...prevState,
      time: time,
    }));
  };

  const handleDateTimeToggle = (e) => {
    const isChecked = e.target.checked;
    setShowDateTime(isChecked);
    if (!isChecked) {
      setSearchQuery({
        ...searchQuery,
        date: null,
        time: null,
      });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const { date, time, specialization } = searchQuery;

    let searchParams = {
      specialization,
    };
    if (date && time) {
      const { formattedDate, formattedTime } = dateTimeFormatter(date, time);
      searchParams.date = formattedDate;
      searchParams.time = formattedTime;
    }

    try {
      const response = await findAvailableVeterinarians(searchParams);
      onSearchResults(response.data);
      setShowErrorAlert(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    getAllSpecializations()
      .then((response) => {
        setSpecializations(response.data.data || []);
      })
      .catch((error) => {
        console.error("Uzmanlıklar alınırken hata oluştu:", error);
      });
  }, []);

  const handleClearSearch = async () => {
    setSearchQuery({
      date: null,
      time: null,
      specialization: "",
    });
    setShowDateTime(false);
    setShowErrorAlert(false);

    try {
      const response = await getVeterinarians();
      onSearchResults(response.data);
    } catch (error) {
      setErrorMessage("Veterinerler yüklenirken bir hata oluştu.");
      setShowErrorAlert(true);
    }
  };
  return (
    <section className="stickyFormContainer">
      <h3>Veteriner Arama</h3>
      <Form onSubmit={handleSearch}>
        <Form.Group>
          <Form.Label>Uzmanlık</Form.Label>
          <Form.Control
            as="select"
            name="specialization"
            value={searchQuery.specialization}
            onChange={handleInputChange}
          >
            <option value="">Uzmanlık Seçiniz</option>
            {specializations?.map((spec) => (
              <option key={spec} value={spec}>
                {spec}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <fieldset>
          <Row className="mb-3">
            <Col>
              <Form.Group className="mb-3 mt-3">
                <Form.Check
                  type="checkbox"
                  label="Tarih ve Saat Göster"
                  checked={showDateTime}
                  onChange={handleDateTimeToggle}
                />
              </Form.Group>
              {showDateTime && (
                <React.Fragment>
                  <legend>Tarih ve Saat Seçimi</legend>
                  <Form.Group className="mb-3">
                    <Form.Label className="searchText">Tarih</Form.Label>
                    <DatePicker
                      selected={searchQuery.date}
                      onChange={handleDateChange}
                      dateFormat="dd-MM-yyyy"
                      locale="tr"
                      minDate={new Date()}
                      className="form-control"
                      placeholderText="Tarih Seçiniz"
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="searchText">Saat</Form.Label>
                    <DatePicker
                      selected={searchQuery.time}
                      onChange={handleTimeChange}
                      showTimeSelect
                      showTimeSelectOnly
                      timeCaption="Saat"
                      timeIntervals={30}
                      dateFormat="HH:mm"
                      locale="tr"
                      className="form-control"
                      placeholderText="Saat Seçiniz"
                      required
                    />
                  </Form.Group>
                </React.Fragment>
              )}
            </Col>
          </Row>
        </fieldset>
        <div className="d-flex justify-content-center mb-4">
          <Button type="submit" variant="outline-primary">
            Ara
          </Button>
          <div className="mx-2">
            <Button
              type="button"
              variant="outline-info"
              onClick={handleClearSearch}
            >
              Temizle
            </Button>
          </div>
        </div>
      </Form>
      <div>
        {showErrorAlert && (
          <AlertMessage type="danger" message={errorMessage} />
        )}
      </div>
    </section>
  );
};

export default VeterinarianSearch;
