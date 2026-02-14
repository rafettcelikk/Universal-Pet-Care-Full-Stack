import React, { useEffect, useState } from "react";
import CustomPieChart from "./CustomPieChart";
import { getAppointmentSummary } from "../appointment/AppointmentService";
import { formattedAppointmentStatuses } from "../utils/utilities";
import NoDataAvailable from "../common/NoDataAvailable";

const AppointmentChart = () => {
  const [appointmentData, setAppointmentData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const getAppointmentsInfo = async () => {
      try {
        const response = await getAppointmentSummary();
        setAppointmentData(response.data.data);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getAppointmentsInfo();
  }, []);

  const chartData = appointmentData.map((item) => ({
    name: formattedAppointmentStatuses(item.name || item.key),
    value: item.value || item.count || 0,
  }));

  return (
    <section>
      <h5 className="mb-4 chart-title">Randevuların Durum Özeti</h5>
      {chartData && chartData.length > 0 ? (
        <React.Fragment>
          <CustomPieChart data={chartData} />
        </React.Fragment>
      ) : (
        <NoDataAvailable
          dataType={"randevu bilgisi"}
          errorMessage={errorMessage}
        />
      )}
    </section>
  );
};

export default AppointmentChart;
