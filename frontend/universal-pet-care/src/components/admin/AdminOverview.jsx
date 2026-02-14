import React, { useEffect, useState } from "react";
import CardComponent from "../cards/CardComponent";
import { BsCalendarCheck, BsPersonFill } from "react-icons/bs";
import {
  countVeterinarians,
  countPatients,
  countAllUsers,
} from "../user/UserService";
import { countAppointments } from "../appointment/AppointmentService";
import RegistrationChart from "../charts/RegistrationChart";
import AppointmentChart from "../charts/AppointmentChart";
import AccountChart from "../charts/AccountChart";
import VeterinarianSpecializationChart from "../charts/VeterinarianSpecializationChart";

const AdminOverview = () => {
  const [veterinariansCount, setVeterinariansCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const vets = await countVeterinarians();
        const patients = await countPatients();
        const users = await countAllUsers();
        const appointments = await countAppointments();
        setVeterinariansCount(vets);
        setPatientsCount(patients);
        setUserCount(users);
        setAppointmentsCount(appointments);
      } catch (error) {
        console.error("Hata: ", error);
      }
    };
    fetchCounts();
  }, []);
  return (
    <main>
      <h5 className="chart-title">İzleme Aktiviteleri</h5>
      <div className="main-cards">
        <CardComponent
          label={"Kullanıcılar"}
          count={userCount}
          IconComponent={BsPersonFill}
        />
        <CardComponent
          label={"Randevular"}
          count={appointmentsCount}
          IconComponent={BsCalendarCheck}
        />
        <CardComponent
          label={"Veterinerler"}
          count={veterinariansCount}
          IconComponent={BsPersonFill}
        />
        <CardComponent
          label={"Evcil Hayvan Sahipleri"}
          count={patientsCount}
          IconComponent={BsPersonFill}
        />
      </div>
      <div className="charts">
        <div className="chart-container">
          <RegistrationChart />
        </div>
        <div className="chart-container">
          <AppointmentChart />
        </div>
        <div className="chart-container">
          <AccountChart />
        </div>
        <div className="chart-container">
          <VeterinarianSpecializationChart />
        </div>
      </div>
    </main>
  );
};

export default AdminOverview;
