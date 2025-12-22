import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import api from "../../services/api";

const COLORS = ["#FF754C", "#6C5DD3", "#2ECC71"];

const PollutionBySizeWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/analytics/pollution-by-size");
        // Sort by size order: small, medium, big
        const order = { small: 1, medium: 2, big: 3 };
        const sorted = response.data.sort(
          (a, b) => (order[a.houseSize] || 99) - (order[b.houseSize] || 99)
        );
        setData(sorted);
      } catch (error) {
        console.error("Pollution by size error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="widget pollution-by-size">
      <h3>Qualité de Vie vs Densité</h3>
      <p className="widget-subtitle">Pollution moyenne par taille de maison</p>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E4E4E4"
              vertical={false}
            />
            <XAxis
              dataKey="houseSize"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#808191",
                fontSize: 12,
                textTransform: "capitalize",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 12 }}
              label={{
                value: "AQI",
                angle: -90,
                position: "insideLeft",
                fill: "#808191",
              }}
            />
            <Tooltip
              contentStyle={{
                background: "#11142D",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`${value} AQI`, "Pollution"]}
              labelFormatter={(label) => `Maison: ${label}`}
            />
            <Bar dataKey="avgPollution" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PollutionBySizeWidget;
