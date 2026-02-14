import React, { useState } from "react";
import { useAlertWithTimeout } from "../utils/utilities";

const UseMessageAlerts = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useAlertWithTimeout();
  const [showErrorAlert, setShowErrorAlert] = useAlertWithTimeout();
  return {
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    showSuccessAlert,
    setShowSuccessAlert,
    showErrorAlert,
    setShowErrorAlert,
  };
};

export default UseMessageAlerts;
