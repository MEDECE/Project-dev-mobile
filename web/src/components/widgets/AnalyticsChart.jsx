import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import "./AnalyticsChart.css";

const AnalyticsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Mock data for POC visualization (Endpoint not requested in specs)
    const mockData = [
      { name: "00:00", value: 400 },
      { name: "04:00", value: 300 },
      { name: "08:00", value: 550 },
      { name: "12:00", value: 450 },
      { name: "16:00", value: 600 },
      { name: "20:00", value: 700 },
      { name: "23:59", value: 500 },
    ];
    setData(mockData);
  }, []);

  return (
    <div className="widget analytics-chart">
      <div className="widget-header">
        <h3>Analytics</h3>
        <select>
          <option>Last 24h</option>
          <option>Last Week</option>
        </select>
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke="#E4E4E4"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#808191", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                background: "#11142D",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#fff" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#6C5DD3"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;
