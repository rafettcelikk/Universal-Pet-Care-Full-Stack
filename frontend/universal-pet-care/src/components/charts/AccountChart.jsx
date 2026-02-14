import React, { useEffect, useState } from "react";
import { getAggregateUsersAccountByActiveStatus } from "../user/UserService";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const AccountChart = () => {
  const [accountData, setAccountData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const getAccountActivity = async () => {
      try {
        const response = await getAggregateUsersAccountByActiveStatus();
        const rawData = response.data;

        let activePatient = 0;
        let passivePatient = 0;
        let activeVet = 0;
        let passiveVet = 0;

        Object.entries(rawData).forEach(([status, counts]) => {
          if (status === "Enabled") {
            activePatient += counts.PATIENT || 0;
            activeVet += counts.VET || 0;
          } else {
            passivePatient += counts.PATIENT || 0;
            passiveVet += counts.VET || 0;
          }
        });

        const transformedData = [
          {
            name: "Aktif Evcil Hayvan Sahipleri",
            value: activePatient,
            color: "#d26161",
          },
          {
            name: "Pasif Evcil Hayvan Sahipleri",
            value: passivePatient,
            color: "#926262",
          },
          {
            name: "Aktif Veterinerler",
            value: activeVet,
            color: "#2f6a32",
          },
          {
            name: "Pasif Veterinerler",
            value: passiveVet,
            color: "#557a56",
          },
        ];
        setAccountData(transformedData);
      } catch (error) {
        setErrorMessage(error.message || "Veri çekilemedi.");
      }
    };
    getAccountActivity();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center w-100">
      <h5 className="mt-4 mb-4 chart-title text-center">
        Hesap Durum Dağılımı
      </h5>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={accountData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {accountData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke={"#fff"}
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                border: "1px solid #ddd",
              }}
              itemStyle={{ color: "#333" }}
            />

            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AccountChart;
