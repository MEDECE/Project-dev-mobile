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

const COLORS = [
  "#6C5DD3",
  "#FF754C",
  "#2ECC71",
  "#A0D7E7",
  "#F1C40F",
  "#E74C3C",
  "#9B59B6",
  "#1ABC9C",
];

const CustomerSegmentationWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/business/segmentation");
        setData(response.data);
      } catch (error) {
        console.error("Segmentation error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="widget customer-segmentation">
      <h3>👥 Segmentation Clientèle</h3>
      <p className="widget-subtitle">Taille maison × Nb personnes</p>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              nameKey="segment"
              label={({ segment, percent }) => `${(percent * 100).toFixed(0)}%`}
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
              formatter={(value, name) => [`${value} foyers`, name]}
            />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              formatter={(value) => (
                <span style={{ color: "#808191", fontSize: 11 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerSegmentationWidget;
