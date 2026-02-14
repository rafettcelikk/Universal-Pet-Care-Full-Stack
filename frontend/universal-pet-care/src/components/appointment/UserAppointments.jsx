import React, { useEffect, useState } from "react";
import { Accordion, Col, Container, Row } from "react-bootstrap";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale";
import PetsTable from "../pet/PetsTable";
import { formattedAppointmentStatuses, UserType } from "../utils/utilities";
import useColorMapping from "../hooks/ColorMapping";
import PatientActions from "../actions/PatientActions";
import VeterinarianActions from "../actions/VeterinarianActions";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import {
  updateAppointment,
  cancelAppointment,
  approveAppointment,
  declineAppointment,
  getAppointmentById,
} from "./AppointmentService";
import AlertMessage from "../common/AlertMessage";
import UserInformation from "../common/UserInformation";
import { Link } from "react-router-dom";
import AppointmentFilter from "./AppointmentFilter";
import Paginator from "../common/Paginator";

registerLocale("tr", tr);

const UserAppointments = ({ user, appointments: initialAppointments }) => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const colors = useColorMapping();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(2);
  const {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  } = UseMessageAlerts();

  const fetchAppointment = async (appointmentId) => {
    try {
      const response = await getAppointmentById(appointmentId);
      const updatedAppointment = response.data;
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? updatedAppointment
            : appointment,
        ),
      );
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  const handlePetsUpdate = async (updatedAppointmentId) => {
    try {
      await fetchAppointment(updatedAppointmentId);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const response = await approveAppointment(appointmentId);
      console.log("response", response);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const handleDeclineAppointment = async (appointmentId) => {
    try {
      const response = await declineAppointment(appointmentId);
      console.log("response", response);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    try {
      const response = await updateAppointment(
        updatedAppointment.id,
        updatedAppointment,
      );
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === updatedAppointment.id
            ? updatedAppointment
            : appointment,
        ),
      );
      console.log("response", response);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };
  const handleCancelAppointment = async (id) => {
    try {
      const response = await cancelAppointment(id);
      console.log("response", response);
      setSuccessMessage(response.message);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  const onSelectStatus = (status) => {
    setSelectedStatus(status);
  };

  const handleClearFilters = () => {
    setSelectedStatus("all");
  };

  const statuses = Array.from(
    new Set(appointments.map((appointment) => appointment.status)),
  );

  useEffect(() => {
    let filter = appointments;
    if (selectedStatus && selectedStatus !== "all") {
      filter = appointments.filter(
        (appointment) => appointment.status === selectedStatus,
      );
    }
    setFilteredAppointments(filter);
  }, [selectedStatus, appointments]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(
    indexOfFirstAppointment,
    indexOfLastAppointment,
  );
  return (
    <Container className="p-5">
      <AppointmentFilter
        statuses={statuses}
        selectedStatus={selectedStatus}
        onSelectStatus={onSelectStatus}
        onClearFilters={handleClearFilters}
      />
      <Accordion className="mt-4 mb-5">
        {currentAppointments.map((appointment, index) => {
          console.log("Randevu Verisi:", appointment);
          const colorKey = appointment.status.toLowerCase().replace(/_/g, "-");
          const statusColor = colors[colorKey] || colors["default"];
          const formattedStatuses = formattedAppointmentStatuses(
            appointment.status,
          );
          const isWaitingForApproval = formattedStatuses === "Onay Bekliyor";
          const isApproved = formattedStatuses === "Onaylandı";
          const recipientId = appointment.veterinarian?.id;
          return (
            <Accordion.Item eventKey={index} key={index} className="mb-2">
              <Accordion.Header>
                <div>
                  <div className="mb-3">
                    Tarih:{" "}
                    {appointment.appointmentDate
                      ? appointment.appointmentDate
                          .split("-")
                          .reverse()
                          .join("-")
                      : "Tarih Yok"}
                  </div>
                  <div style={{ color: statusColor }}>
                    Durum: {formattedStatuses}
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <Row>
                  <Col md={4} className="mt-2">
                    <p>
                      Randevu Numarası:{" "}
                      <span className="text-info">
                        {appointment.appointmentNo}
                      </span>
                    </p>
                    {(() => {
                      const dateStr = `${appointment.appointmentDate}T${appointment.appointmentTime}`;
                      const dateObj = new Date(dateStr);
                      const isValidDate = !isNaN(dateObj.getTime());

                      return (
                        <ReactDatePicker
                          selected={isValidDate ? dateObj : null}
                          onChange={(date) => {}}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeCaption="Saat"
                          timeIntervals={30}
                          dateFormat="dd-MM-yyyy"
                          inline
                          readOnly={true}
                          locale="tr"
                        />
                      );
                    })()}

                    <p>
                      Randevu Saati:
                      <span className="text-info">
                        {" "}
                        {appointment.appointmentTime}
                      </span>{" "}
                    </p>
                    <p>Sebep: {appointment.reason}</p>
                  </Col>
                  <Col md={8} className="mt-2">
                    <h4>Evcil Hayvanlar</h4>
                    <PetsTable
                      pets={appointment.pets}
                      appointmentId={appointment.id}
                      onPetsUpdate={handlePetsUpdate}
                      isEditTable={formattedStatuses}
                      isPatient={user.userType === UserType.PATIENT}
                    />
                  </Col>
                  {isApproved && (
                    <UserInformation
                      userType={user.userType}
                      appointment={appointment}
                    />
                  )}
                </Row>
                {showSuccessAlert && (
                  <AlertMessage type={"success"} message={successMessage} />
                )}
                {showErrorAlert && (
                  <AlertMessage type={"danger"} message={errorMessage} />
                )}
                {user && user.userType === UserType.PATIENT && (
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/book-appointment/${recipientId}/new-appointment`}
                  >
                    Yeni Randevu Oluştur
                  </Link>
                )}
                {user && user.userType === UserType.PATIENT && (
                  <div>
                    <PatientActions
                      onUpdate={handleUpdateAppointment}
                      onCancel={handleCancelAppointment}
                      isDisabled={!isWaitingForApproval}
                      appointment={appointment}
                    />
                  </div>
                )}
                {user && user.userType === UserType.VET && (
                  <div>
                    <VeterinarianActions
                      onApprove={handleApproveAppointment}
                      onDecline={handleDeclineAppointment}
                      isDisabled={!isWaitingForApproval}
                      appointment={appointment}
                    />
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <Paginator
        itemsPerPage={appointmentsPerPage}
        totalItems={filteredAppointments.length}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />
    </Container>
  );
};

export default UserAppointments;
