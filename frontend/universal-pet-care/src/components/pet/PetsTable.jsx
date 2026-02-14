import React, { useState } from "react";
import UseMessageAlerts from "../hooks/UseMessageAlerts";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import AddPetModal from "../modals/AddPetModal";
import AlertMessage from "../common/AlertMessage";
import { Button, Table } from "react-bootstrap";
import EditTablePetRow from "./EditTablePetRow";
import { BsPenFill, BsTrashFill, BsPlusCircleFill } from "react-icons/bs";
import { deletePet, savePet, updatePet } from "./PetService";

const PetsTable = ({
  pets,
  appointmentId,
  onPetsUpdate,
  isEditTable,
  isPatient,
}) => {
  const [editModeId, setEditModeId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

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

  const handleEditClick = (petId) => setEditModeId(petId);
  const handleCancelEdit = () => setEditModeId(null);

  const handleShowDeleteModal = (petId) => {
    setPetToDelete(petId);
    setShowDeleteModal(true);
  };

  const handleDeletePet = async () => {
    if (petToDelete) {
      try {
        const response = await deletePet(petToDelete);
        onPetsUpdate(appointmentId);
        setSuccessMessage(response.message);
        setShowDeleteModal(false);
        setShowSuccessAlert(true);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || "Silme hatası");
        setShowErrorAlert(true);
      }
    }
  };

  const handleSavePetUpdate = async (petId, updatedPet) => {
    try {
      const response = await updatePet(petId, updatedPet);
      onPetsUpdate(appointmentId);
      setSuccessMessage(response.message);
      setEditModeId(null);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Güncelleme hatası");
      setShowErrorAlert(true);
    }
  };

  const handleSaveNewPet = async (appointmentId, newPetData) => {
    try {
      const response = await savePet(appointmentId, newPetData);
      onPetsUpdate(appointmentId);
      setSuccessMessage(response.message);
      setShowAddModal(false);
      setShowSuccessAlert(true);
    } catch (error) {
      setErrorMessage(error.response.data.message);
      setShowErrorAlert(true);
    }
  };

  return (
    <section>
      <DeleteConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePet}
        itemToDelete="evcil hayvanı"
      />

      <AddPetModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAddPet={handleSaveNewPet}
        appointmentId={appointmentId}
      />

      {showSuccessAlert && (
        <AlertMessage type="success" message={successMessage} />
      )}
      {showErrorAlert && <AlertMessage type="danger" message={errorMessage} />}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Adı</th>
            <th>Türü</th>
            <th>Irkı</th>
            <th>Rengi</th>
            <th>Yaşı</th>
            {isPatient && (
              <th colSpan={3} className="text-center align-middle">
                <div className="d-flex justify-content-between align-items-center">
                  <span>İşlemler</span>
                  {isEditTable && (
                    <Button
                      variant="success"
                      size="sm"
                      className="ms-2"
                      onClick={() => setShowAddModal(true)}
                      title="Yeni Evcil Hayvan Ekle"
                    >
                      <BsPlusCircleFill />
                    </Button>
                  )}
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(pets) &&
            pets.map((pet, index) =>
              editModeId === pet.id ? (
                <EditTablePetRow
                  key={index}
                  pet={pet}
                  index={index}
                  onSave={handleSavePetUpdate}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <tr key={pet.id}>
                  <td>{pet.name}</td>
                  <td>{pet.type}</td>
                  <td>{pet.breed}</td>
                  <td>{pet.color}</td>
                  <td>{pet.age}</td>
                  {isPatient && (
                    <React.Fragment>
                      <td>
                        <Button
                          className="btn btn-sm btn-warning"
                          disabled={!isEditTable}
                          onClick={() => handleEditClick(pet.id)}
                        >
                          <BsPenFill />
                        </Button>
                      </td>
                      <td>
                        <Button
                          className="btn btn-sm btn-danger"
                          disabled={!isEditTable}
                          onClick={() => handleShowDeleteModal(pet.id)}
                        >
                          <BsTrashFill />
                        </Button>
                      </td>
                    </React.Fragment>
                  )}
                </tr>
              ),
            )}
        </tbody>
      </Table>
    </section>
  );
};

export default PetsTable;
