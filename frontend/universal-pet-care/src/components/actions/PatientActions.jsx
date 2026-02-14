import React, { useState } from "react";
import ActionButtons from "./ActionButtons";
import AppointmentUpdateModal from "../modals/AppointmentUpdateModal";

const PatientActions = ({ onCancel, onUpdate, isDisabled, appointment }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const handleActionClick = (action) => {
    setIsProcessing(true);
    try {
      if (action === "Update") {
        setShowUpdateModal(true);
      } else {
        onCancel(appointment.id);
      }
    } catch (error) {
      console.error("Hata", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateAppointment = async (updatedAppointment) => {
    setIsProcessing(false);
    try {
      await onUpdate(updatedAppointment);
      handleCloseUpdateModal();
    } catch (error) {
      console.error("Hata", error);
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
  };
  return (
    <React.Fragment>
      <section className="d-flex justify-content-end gap-2 mt-2 mb-2">
        <ActionButtons
          title={"Randevuyu Güncelle"}
          variant={"warning"}
          onClick={() => handleActionClick("Update")}
          disabled={isDisabled}
          isProcessing={isProcessing}
        />
        <ActionButtons
          title={"Randevuyu İptal Et"}
          variant={"danger"}
          onClick={() => onCancel(appointment.id)}
          disabled={isDisabled}
          isProcessing={isProcessing}
        />
      </section>
      {showUpdateModal && (
        <AppointmentUpdateModal
          show={showUpdateModal}
          handleClose={handleCloseUpdateModal}
          appointment={appointment}
          handleUpdate={handleUpdateAppointment}
        />
      )}
    </React.Fragment>
  );
};

export default PatientActions;
