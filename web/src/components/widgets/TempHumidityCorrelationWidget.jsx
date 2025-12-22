import React, { useState, useEffect } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  ReferenceLine,
} from "recharts";
import api from "../../services/api";

const TempHumidityCorrelationWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/technical/temp-humidity-correlation");
        setData(response.data);
      } catch (error) {
        console.error("Temp-humidity correlation error:", error);
      }
    };
    fetchData();
  }, []);

  // Detect potential anomalies (unusual combinations)
  const isAnomaly = (point) => {
    // Hot + Very Humid = suspicious
    if (point.x > 30 && point.y > 80) return true;
    // Cold + Very Humid = suspicious
    if (point.x < 10 && point.y > 80) return true;
    return false;
  };

  const normalData = data.filter((p) => !isAnomaly(p));
  const anomalyData = data.filter(isAnomaly);

  return (
    <div className="widget temp-humidity-correlation">
      <h3>🔬 Matrice de Corrélation</h3>
      <p className="widget-subtitle">
        Température × Humidité (détection anomalies)
      </p>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E4" />
            <XAxis
              type="number"
              dataKey="x"
              name="Température"
              unit="°C"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 11 }}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Humidité"
              unit="%"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 11 }}
              domain={[0, 100]}
            />
            <ZAxis range={[60, 60]} />

            {/* Reference lines for danger zones */}
            <ReferenceLine y={80} stroke="#F39C12" strokeDasharray="5 5" />
            <ReferenceLine x={30} stroke="#E74C3C" strokeDasharray="5 5" />

            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#11142D",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value, name) => {
                if (name === "Température") return [`${value}°C`, name];
                return [`${value}%`, name];
              }}
            />

            {/* Normal points */}
            <Scatter name="Normal" data={normalData} fill="#6C5DD3" />

            {/* Anomaly points */}
            <Scatter
              name="Anomalie"
              data={anomalyData}
              fill="#E74C3C"
              shape="diamond"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#808191" }}>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#6C5DD3",
              marginRight: 4,
            }}
          ></span>
          Normal
        </span>
        <span style={{ fontSize: "11px", color: "#808191" }}>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              background: "#E74C3C",
              marginRight: 4,
              transform: "rotate(45deg)",
            }}
          ></span>
          Anomalie potentielle
        </span>
      </div>
    </div>
  );
};

export default TempHumidityCorrelationWidget;
