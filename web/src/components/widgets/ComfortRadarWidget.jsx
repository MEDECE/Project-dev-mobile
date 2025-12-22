import React, { useState, useEffect } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import api from "../../services/api";

const COLORS = ["#6C5DD3", "#FF754C", "#2ECC71", "#A0D7E7"];

const ComfortRadarWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/health/comfort-radar");

        // Transform data for radar chart: metrics as axes, rooms as series
        const metrics = ["temperature", "humidity", "airPollution"];
        const rooms = response.data;

        // Normalize values to 0-100 scale for radar
        const normalize = (value, type) => {
          switch (type) {
            case "temperature":
              return Math.min(100, Math.max(0, (value / 40) * 100));
            case "humidity":
              return value; // Already 0-100
            case "airPollution":
              return value; // Already 0-100
            default:
              return value;
          }
        };

        const chartData = metrics.map((metric) => {
          const point = {
            metric:
              metric === "airPollution"
                ? "Pollution"
                : metric.charAt(0).toUpperCase() + metric.slice(1),
          };
          rooms.forEach((room) => {
            const metricData = room.metrics.find((m) => m.metric === metric);
            point[room.room] = metricData
              ? normalize(metricData.value, metric)
              : 0;
          });
          return point;
        });

        setData({ chartData, rooms: rooms.map((r) => r.room) });
      } catch (error) {
        console.error("Comfort radar error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="widget comfort-radar">
      <h3>🎯 Radar du Confort Intérieur</h3>
      <p className="widget-subtitle">Comparaison par pièce</p>
      <div style={{ width: "100%", height: 320 }}>
        <ResponsiveContainer>
          <RadarChart data={data.chartData || []}>
            <PolarGrid stroke="#E4E4E4" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: "#808191", fontSize: 11 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: "#808191", fontSize: 10 }}
            />
            {(data.rooms || []).map((room, index) => (
              <Radar
                key={room}
                name={room}
                dataKey={room}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.2}
                strokeWidth={2}
              />
            ))}
            <Legend
              formatter={(value) => (
                <span style={{ color: "#808191", textTransform: "capitalize" }}>
                  {value}
                </span>
              )}
            />
            <Tooltip
              contentStyle={{
                background: "#11142D",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ComfortRadarWidget;
