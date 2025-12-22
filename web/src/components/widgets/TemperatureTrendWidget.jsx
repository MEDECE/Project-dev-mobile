import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import api from "../../services/api";

const TemperatureTrendWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/analytics/temperature-trend");
        setData(response.data);
      } catch (error) {
        console.error("Temperature trend error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="widget temperature-trend">
      <h3>Tendances Temporelles</h3>
      <p className="widget-subtitle">Évolution température 2025</p>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E4E4E4"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 12 }}
              label={{
                value: "°C",
                angle: -90,
                position: "insideLeft",
                fill: "#808191",
              }}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip
              contentStyle={{
                background: "#11142D",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value) => [`${value}°C`]}
            />
            <Legend
              wrapperStyle={{ paddingTop: "10px" }}
              formatter={(value) => (
                <span style={{ color: "#808191" }}>{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="max"
              stroke="#FF754C"
              strokeWidth={2}
              dot={false}
              name="Max"
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#6C5DD3"
              strokeWidth={3}
              dot={{ fill: "#6C5DD3", strokeWidth: 2 }}
              name="Moyenne"
            />
            <Line
              type="monotone"
              dataKey="min"
              stroke="#A0D7E7"
              strokeWidth={2}
              dot={false}
              name="Min"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TemperatureTrendWidget;
