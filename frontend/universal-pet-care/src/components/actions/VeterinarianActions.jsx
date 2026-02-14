import React, { useState } from "react";
import ActionButtons from "./ActionButtons";
import ProcessSpinner from "../common/ProcessSpinner";

const VeterinarianActions = ({
  onApprove,
  onDecline,
  isDisabled,
  appointment,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingAction, setProcessingAction] = useState(null);

  const handleActionClick = (action) => {
    setIsProcessing(true);
    setProcessingAction(action);
    if (action === "Approve") {
      onApprove(appointment.id)
        .then(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        })
        .catch(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        });
    } else {
      onDecline(appointment.id)
        .then(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        })
        .catch(() => {
          setIsProcessing(false);
          setProcessingAction(null);
        });
    }
  };
  return (
    <section className="d-flex justify-content-end gap-2 mt-2 mb-2">
      <ActionButtons
        title={
          isProcessing && processingAction === "Approve" ? (
            <ProcessSpinner message="Randevu Onaylanıyor" />
          ) : (
            "Randevuyu Onayla"
          )
        }
        onClick={() => handleActionClick("Approve")}
        variant={"success"}
        disabled={isDisabled}
        isProcessing={isProcessing}
      />
      <ActionButtons
        title={
          isProcessing && processingAction === "Decline" ? (
            <ProcessSpinner message="Randevu Reddediliyor" />
          ) : (
            "Randevuyu Reddet"
          )
        }
        onClick={() => handleActionClick("Decline")}
        variant={"secondary"}
        disabled={isDisabled}
        isProcessing={isProcessing}
      />
    </section>
  );
};

export default VeterinarianActions;
