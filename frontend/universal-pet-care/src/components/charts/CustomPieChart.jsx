import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import useColorMapping from "../hooks/ColorMapping";
import { getStatusKeyForColor } from "../utils/utilities";

const CustomPieChart = ({
  data,
  dataKey = "value",
  nameKey = "name",
  width = "100%",
  height = 400,
}) => {
  const colors = useColorMapping();
  return (
    <section className="mb-5 mt-5">
      <h4 className="text-center mt-2">Randevu İstatistikleri</h4>
      <ResponsiveContainer width={width} height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={120}
            label={({ [nameKey]: name }) => name}
          >
            {data.map((entry, index) => {
              const statusName = entry[nameKey];
              const colorKey = getStatusKeyForColor(statusName);
              const color = colors[colorKey] || colors["default"] || "#ccc";
              return <Cell key={`cell-${index}`} fill={color} stroke="none" />;
            })}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </section>
  );
};

export default CustomPieChart;
