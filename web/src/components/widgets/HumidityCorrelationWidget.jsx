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
} from "recharts";
import api from "../../services/api";

const HumidityCorrelationWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/analytics/humidity-correlation");
        setData(response.data);
      } catch (error) {
        console.error("Humidity correlation error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="widget humidity-correlation">
      <h3>Confort vs Occupation</h3>
      <p className="widget-subtitle">Corrélation Personnes / Humidité</p>
      <div style={{ width: "100%", height: 280 }}>
        <ResponsiveContainer>
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E4" />
            <XAxis
              type="number"
              dataKey="x"
              name="Personnes"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 12 }}
              label={{
                value: "Nb Personnes",
                position: "bottom",
                fill: "#808191",
                offset: -5,
              }}
              domain={[0, "dataMax + 1"]}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Humidité"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 12 }}
              label={{
                value: "Humidité %",
                angle: -90,
                position: "insideLeft",
                fill: "#808191",
              }}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <ZAxis range={[100, 100]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: "#11142D",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value, name) => {
                if (name === "Personnes")
                  return [`${value} pers.`, "Occupation"];
                return [`${value}%`, "Humidité"];
              }}
            />
            <Scatter name="Foyers" data={data} fill="#6C5DD3" shape="circle" />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HumidityCorrelationWidget;
