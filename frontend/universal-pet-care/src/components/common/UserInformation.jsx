import React from "react";

const UserInformation = ({ userType, appointment }) => {
  return (
    <div className="mt-2 mb-2" style={{ backgroundColor: "whiteSmoke" }}>
      <h5>{userType === "VET" ? "Hasta " : "Veteriner "} Bilgileri</h5>
      {userType === "VET" ? (
        <React.Fragment>
          <p className="text-info">Randevu No: {appointment.appointmentNo}</p>
          <p>
            Adı: {appointment.patient.firstName} {appointment.patient.lastName}
          </p>
          <p>E-posta: {appointment.patient.email}</p>
          <p className="text-info">
            Telefon Numarası: {appointment.patient.phoneNumber}
          </p>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <p className="text-info">Randevu No: {appointment.appointmentNo}</p>
          <p>
            Adı: Dr. {appointment.veterinarian.firstName}{" "}
            {appointment.veterinarian.lastName}
          </p>
          <p className="text-info">
            Uzmanlık: {appointment.veterinarian.specialization}
          </p>
          <p>E-posta: {appointment.veterinarian.email}</p>
          <p className="text-info">
            Telefon Numarası: {appointment.veterinarian.phoneNumber}
          </p>
        </React.Fragment>
      )}
    </div>
  );
};

export default UserInformation;
