import React, { useEffect, useState } from "react";
import { getAggregateUsersByMonthAndType } from "../user/UserService";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import NoDataAvailable from "../common/NoDataAvailable";

const RegistrationChart = () => {
  const [userData, setUserData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const monthOrder = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await getAggregateUsersByMonthAndType();
        const rawData = response.data;

        const transformedData = Object.entries(rawData).map(
          ([month, counts]) => {
            return {
              name: month,
              Veterinerler: counts.VET || 0,
              "Evcil Hayvan Sahipleri": counts.PATIENT || 0,
            };
          },
        );

        transformedData.sort((a, b) => {
          return monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name);
        });

        setUserData(transformedData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    getUsers();
  }, []);
  return (
    <section className="d-flex flex-column align-items-center w-100">
      <h5 className="chart-title mb-4 mt-2">Kullanıcı Kayıtları (AYLIK)</h5>
      {userData && userData.length > 0 ? (
        <React.Fragment>
          {" "}
          <div style={{ width: "80%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  dy={10}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "10px",
                  }}
                  cursor={{ fill: "transparent" }}
                />
                <Legend verticalAlign="top" height={36} />
                <Bar
                  dataKey="Veterinerler"
                  fill="#2f6a32"
                  radius={[5, 5, 0, 0]}
                  barSize={30}
                />
                <Bar
                  dataKey="Evcil Hayvan Sahipleri"
                  fill="#d26161"
                  radius={[5, 5, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </React.Fragment>
      ) : (
        <NoDataAvailable
          dataType={"kullanıcı kaydı"}
          errorMessage={errorMessage}
        />
      )}
    </section>
  );
};

export default RegistrationChart;
