import React, { useEffect, useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import {
  deleteUser,
  lockUserAccount,
  unlockUserAccount,
  updateUser,
} from "../user/UserService";
import { getVeterinarians } from "../veterinarian/VeterinarianService";
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
import VeterinarianEditTableRow from "../veterinarian/VeterinarianEditTableRow";
import UserFilter from "../user/UserFilter";
import Paginator from "../common/Paginator";

const VeterinarianComponent = () => {
  const [veterinarians, setVeterinarians] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [veterinarianToDelete, setVeterinarianToDelete] = useState(null);
  const [editVetId, setEditVetId] = useState(null);
  const [filteredVets, setFilteredVets] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [vetsPerPage] = useState(7);

  const indexOfLastVet = currentPage * vetsPerPage;
  const indexOfFirstVet = indexOfLastVet - vetsPerPage;
  const currentVets = filteredVets.slice(indexOfFirstVet, indexOfLastVet);

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

  const handleEditClick = (veterinarianId) => {
    setEditVetId(veterinarianId);
  };

  const handleCancelClick = () => {
    setEditVetId(null);
  };

  const handleSaveUpdate = async (veterinarianId, editedVet) => {
    try {
      const response = await updateUser(editedVet, veterinarianId);

      setVeterinarians((prevVets) =>
        prevVets.map((vet) =>
          vet.id === veterinarianId ? { ...vet, ...editedVet } : vet,
        ),
      );
      setEditVetId(null);
      setSuccessMessage(response.message);
      setShowErrorAlert(false);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.message);
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
    }
  };

  const fetchVeterinarians = () => {
    getVeterinarians()
      .then((data) => {
        console.log("Fetched veterinarians:", data.data);
        setVeterinarians(data.data);
      })
      .catch((error) => {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      });
  };
  useEffect(() => {
    fetchVeterinarians();
  }, []);

  const handleDeleteAccount = async () => {
    if (veterinarianToDelete) {
      try {
        const response = await deleteUser(veterinarianToDelete);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
        fetchVeterinarians();
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorAlert(true);
      }
    }
  };

  const handleShowDeleteModal = (veterinarianId) => {
    setVeterinarianToDelete(veterinarianId);
    setShowDeleteModal(true);
  };

  const handleToggleAccountLock = async (veterinarian) => {
    try {
      let response;
      if (veterinarian.enabled) {
        response = await lockUserAccount(veterinarian.id);
      } else {
        response = await unlockUserAccount(veterinarian.id);
      }

      setVeterinarians(
        veterinarians.map((vet) =>
          vet.id === veterinarian.id ? { ...vet, enabled: !vet.enabled } : vet,
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
    let filtered = veterinarians;
    if (selectedSpecialization) {
      filtered = filtered.filter(
        (vet) => vet.specialization === selectedSpecialization,
      );
    }
    setFilteredVets(filtered);
  }, [veterinarians, selectedSpecialization]);

  const specializations = Array.from(
    new Set(veterinarians.map((vet) => vet.specialization)),
  );

  const handleClearFilters = () => {
    setSelectedSpecialization("");
  };
  return (
    <main className="mt-2">
      <DeleteConfirmation
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        itemToDelete={"veterinarian"}
      />
      <Row className="align-items-center mb-4 mt-3">
        <Col md={6}>
          <div className="d-flex align-items-center gap-3">
            <h4 className="mb-0 text-dark fw-bold">Veteriner Hekimler</h4>
            <span className="badge bg-info text-dark rounded-pill px-3">
              Toplam: {filteredVets.length}
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
            onClick={fetchVeterinarians}
            className="d-flex align-items-center gap-2 shadow-sm"
          >
            <i className="bi bi-arrow-clockwise"></i> Yenile
          </Button>

          <Link
            to={"/user-registration"}
            className="btn btn-primary btn-sm d-flex align-items-center gap-2 shadow-sm"
          >
            <BsPlusSquareFill /> Yeni Veteriner Kaydı
          </Link>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <UserFilter
            values={specializations}
            selectedValue={selectedSpecialization}
            onSelectValue={setSelectedSpecialization}
            onClearFilters={handleClearFilters}
            label={"Uzmanlık Alanı"}
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
            <th>Uzmanlık Alanı</th>
            <th>Kayıt Tarihi</th>
            <th colSpan={4}>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {currentVets.map((veterinarian, index) =>
            editVetId === veterinarian.id ? (
              <VeterinarianEditTableRow
                key={veterinarian.id}
                vet={veterinarian}
                onSave={handleSaveUpdate}
                onCancel={handleCancelClick}
              />
            ) : (
              <tr key={veterinarian.id}>
                <td>Dr. {veterinarian.firstName}</td>
                <td>{veterinarian.lastName}</td>
                <td>{veterinarian.email}</td>
                <td>{veterinarian.phoneNumber}</td>
                <td>
                  {veterinarian.gender === "Male"
                    ? "Erkek"
                    : veterinarian.gender === "Female"
                      ? "Kadın"
                      : veterinarian.gender === "Other"
                        ? "Diğer"
                        : "Belirtilmemiş"}
                </td>
                <td>{veterinarian.specialization}</td>
                <td>
                  {dateTimeFormatter(veterinarian.createdAt).formattedDate}
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Profili Görüntüle
                      </Tooltip>
                    }
                  >
                    <Link
                      to={`/user-dashboard/${veterinarian.id}/my-dashboard`}
                      className="text-info"
                    >
                      <BsEyeFill />
                    </Link>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Profili Düzenle
                      </Tooltip>
                    }
                  >
                    <Link to={"#"} className="text-warning">
                      <BsPencilFill
                        onClick={() => handleEditClick(veterinarian.id)}
                      />
                    </Link>
                  </OverlayTrigger>
                </td>

                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        {veterinarian.enabled
                          ? "Hesabı Kilitle"
                          : "Hesabın Kilidini Aç"}{" "}
                      </Tooltip>
                    }
                  >
                    <span
                      onClick={() => handleToggleAccountLock(veterinarian)}
                      style={{ cursor: "pointer" }}
                    >
                      {veterinarian.enabled ? <BsUnlockFill /> : <BsLockFill />}
                    </span>
                  </OverlayTrigger>
                </td>

                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        Veteriner hesabını sil
                      </Tooltip>
                    }
                  >
                    <Link
                      to={"#"}
                      className="text-danger"
                      onClick={() => handleShowDeleteModal(veterinarian.id)}
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
        itemsPerPage={vetsPerPage}
        totalItems={filteredVets.length}
        currentPage={currentPage}
        paginate={setCurrentPage}
      />
    </main>
  );
};

export default VeterinarianComponent;
