import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import api from "../../services/api";

const COLORS = ["#6C5DD3", "#FF754C", "#A0D7E7", "#2ECC71", "#F1C40F"];

const SensorDistributionWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        const response = await api.get("/sensors/distribution");
        setData(response.data);
      } catch (error) {
        console.error("Distribution fetch error:", error);
      }
    };
    fetchDistribution();
  }, []);

  return (
    <div className="widget sensor-distribution">
      <h3>Répartition du Parc</h3>
      <p className="widget-subtitle">Par type de pièce</p>
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) =>
                `${name} (${(percent * 100).toFixed(0)}%)`
              }
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#11142D",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value, name) => [`${value} capteurs`, name]}
            />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: "#808191", textTransform: "capitalize" }}>
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SensorDistributionWidget;
