import React, { useEffect, useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import {
  deleteUser,
  lockUserAccount,
  unlockUserAccount,
  updateUser,
} from "../user/UserService";
import { getPatients } from "../patient/PatientService"; // Servis ismini kontrol et
import DeleteConfirmation from "../modals/DeleteConfirmationModal";
import AlertMessage from "../common/AlertMessage";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  BsEyeFill,
  BsPlusSquareFill,
  BsPencilFill,
  BsTrashFill,
  BsUnlockFill,
  BsLockFill,
} from "react-icons/bs";
import { dateTimeFormatter } from "../utils/utilities";
import PatientEditTableRow from "../patient/PatientEditTableRow";
import UserFilter from "../user/UserFilter";
import Paginator from "../common/Paginator";

const PatientComponent = () => {
  const [patients, setPatients] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [editPatientId, setEditPatientId] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(7);

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient,
  );

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

  const handleEditClick = (patientId) => {
    setEditPatientId(patientId);
  };

  const handleCancelClick = () => {
    setEditPatientId(null);
  };

  const handleSaveUpdate = async (patientId, editedPatient) => {
    try {
      const response = await updateUser(editedPatient, patientId);

      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === patientId ? { ...patient, ...editedPatient } : patient,
        ),
      );
      setEditPatientId(null);
      setSuccessMessage(response.message);
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const fetchPatients = () => {
    getPatients()
      .then((data) => {
        setPatients(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDeleteAccount = async () => {
    if (patientToDelete) {
      try {
        const response = await deleteUser(patientToDelete);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
        fetchPatients();
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      }
    }
  };

  const handleShowDeleteModal = (patientId) => {
    setPatientToDelete(patientId);
    setShowDeleteModal(true);
  };

  const handleToggleAccountLock = async (patient) => {
    try {
      let response;
      if (patient.enabled) {
        response = await lockUserAccount(patient.id);
      } else {
        response = await unlockUserAccount(patient.id);
      }

      setPatients(
        patients.map((p) =>
          p.id === patient.id ? { ...p, enabled: !p.enabled } : p,
        ),
      );
      setSuccessMessage(response.message);
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowSuccessAlert(false);
      setShowErrorAlert(true);
    }
  };

  useEffect(() => {
    let filtered = patients;
    if (selectedEmail) {
      filtered = filtered.filter((p) => p.email === selectedEmail);
    }
    setFilteredPatients(filtered);
  }, [patients, selectedEmail]);

  const patientEmails = Array.from(new Set(patients.map((p) => p.email)));

  const handleClearFilters = () => {
    setSelectedEmail("");
  };

  return (
    <main className="mt-2">
      <DeleteConfirmation
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        itemToDelete={"patient"}
      />
      <Row className="align-items-center mb-4 mt-3">
        <Col md={6}>
          <div className="d-flex align-items-center gap-3">
            <h4 className="mb-0 text-dark fw-bold">Hastalar</h4>
            <span className="badge bg-info text-dark rounded-pill px-3">
              Toplam: {filteredPatients.length}
            </span>
          </div>
          <div className="mt-2">
            {showSuccessAlert && (
              <AlertMessage type={"success"} message={successMessage} />
            )}
            {showErrorAlert && (
              <AlertMessage type={"danger"} message={errorMessage} />
            )}
          </div>
        </Col>
        <Col md={6} className="d-flex justify-content-end gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={fetchPatients}
            className="d-flex align-items-center gap-2 shadow-sm"
          >
            <i className="bi bi-arrow-clockwise"></i> Yenile
          </Button>

          <Link
            to={"/user-registration"}
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm"
          >
            <BsPlusSquareFill /> Yeni Hasta Kaydı
          </Link>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <UserFilter
            values={patientEmails}
            selectedValue={selectedEmail}
            onSelectValue={setSelectedEmail}
            onClearFilters={handleClearFilters}
            label={"E-Posta Adresi"}
          />
        </Col>
      </Row>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>E-Posta</th>
            <th>Telefon Numarası</th>
            <th>Cinsiyet</th>
            <th>Kayıt Tarihi</th>
            <th colSpan={4}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((patient, index) =>
            editPatientId === patient.id ? (
              <PatientEditTableRow
                key={patient.id}
                patient={patient}
                onSave={handleSaveUpdate}
                onCancel={handleCancelClick}
              />
            ) : (
              <tr key={patient.id}>
                <td>{patient.firstName}</td>
                <td>{patient.lastName}</td>
                <td>{patient.email}</td>
                <td>{patient.phoneNumber}</td>
                <td>
                  {patient.gender === "Male"
                    ? "Erkek"
                    : patient.gender === "Female"
                      ? "Kadın"
                      : patient.gender === "Other"
                        ? "Diğer"
                        : "Belirtilmemiş"}
                </td>
                <td>{dateTimeFormatter(patient.createdAt).formattedDate}</td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`v-${index}`}>Profili Görüntüle</Tooltip>
                    }
                  >
                    <Link
                      to={`/user-dashboard/${patient.id}/my-dashboard`}
                      className="text-info"
                    >
                      <BsEyeFill />
                    </Link>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`e-${index}`}>Profili Düzenle</Tooltip>
                    }
                  >
                    <Link to={"#"} className="text-warning">
                      <BsPencilFill
                        onClick={() => handleEditClick(patient.id)}
                      />
                    </Link>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`l-${index}`}>
                        {patient.enabled
                          ? "Hesabı Kilitle"
                          : "Hesabın Kilidini Aç"}
                      </Tooltip>
                    }
                  >
                    <span
                      onClick={() => handleToggleAccountLock(patient)}
                      style={{ cursor: "pointer" }}
                    >
                      {patient.enabled ? <BsUnlockFill /> : <BsLockFill />}
                    </span>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={<Tooltip id={`d-${index}`}>Hesabı Sil</Tooltip>}
                  >
                    <Link
                      to={"#"}
                      className="text-danger"
                      onClick={() => handleShowDeleteModal(patient.id)}
                    >
                      <BsTrashFill />
                    </Link>
                  </OverlayTrigger>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
      <Paginator
        itemsPerPage={patientsPerPage}
        totalItems={filteredPatients.length}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />
    </main>
  );
};

export default PatientComponent;
