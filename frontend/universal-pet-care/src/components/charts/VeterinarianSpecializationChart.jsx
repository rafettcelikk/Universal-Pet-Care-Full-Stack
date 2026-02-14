import React, { useEffect, useState } from "react";
import { generateColor } from "../utils/utilities";
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getAggregateVetBySpecialization } from "../user/UserService";
import NoDataAvailable from "../common/NoDataAvailable";

const VeterinarianSpecializationChart = () => {
  const [vetSpecializationData, setVetSpecializationData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVeterinariansAndProcessData = async () => {
      try {
        const response = await getAggregateVetBySpecialization();
        const veterinarians = response;
        const processedData = veterinarians.map((vet) => ({
          ...vet,
          color: generateColor(vet.specialization),
        }));
        setVetSpecializationData(processedData);
      } catch (error) {
        setErrorMessage(error.message);
      }
    };
    fetchVeterinariansAndProcessData();
  }, []);
  return (
    <section className="d-flex flex-column align-items-center w-100">
      <h5 className="mb-4 mt-4 chart-title">Veteriner Uzmanlık Dağılımı</h5>
      {vetSpecializationData && vetSpecializationData.length > 0 ? (
        <React.Fragment>
          <div style={{ width: "80%", height: 400 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vetSpecializationData}
                margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="specialization"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  dy={15}
                />
                <YAxis allowDecimals={false} />
                <Tooltip
                  content={(props) => {
                    const { payload } = props;
                    if (payload && payload.length) {
                      return (
                        <div
                          className="p-3 rounded"
                          style={{
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #ddd",
                          }}
                        >
                          <p className="mb-0 text-dark fw-bold">
                            {payload[0].payload.specialization}:{" "}
                            <span className="text-primary">
                              {payload[0].payload.count}
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{ fill: "transparent" }}
                />
                <Legend layout="horizontal" verticalAlign="top" height={36} />
                <Bar
                  dataKey="count"
                  name={"Kişi sayısı"}
                  fill="#8884d8"
                  barSize={40}
                  radius={[5, 5, 0, 0]}
                >
                  {vetSpecializationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </React.Fragment>
      ) : (
        <NoDataAvailable
          dataType={"Veteriner Uzmanlık Dağılımı"}
          errorMessage={errorMessage}
        />
      )}
    </section>
  );
};

export default VeterinarianSpecializationChart;
