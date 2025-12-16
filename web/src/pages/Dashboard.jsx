import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Wifi, Activity, CloudRain } from "lucide-react";
import Layout from "../components/layout/Layout";
import KPICard from "../components/widgets/KPICard";
import WorldMapWidget from "../components/widgets/WorldMapWidget";
import AnalyticsChart from "../components/widgets/AnalyticsChart";
import TopCountriesWidget from "../components/widgets/TopCountriesWidget";
import "./Dashboard.css";

const Dashboard = () => {
  const [kpi, setKpi] = useState({
    users: { value: 0, trend: "", label: "Total Users" },
    sensors: { value: 0, trend: "", label: "Active Sensors" },
    measures: { value: 0, trend: "", label: "Data Points" },
  });

  useEffect(() => {
    const fetchKpi = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/stats/kpi");
        setKpi(response.data);
      } catch (error) {
        console.error("KPI Error:", error);
      }
    };
    fetchKpi();
  }, []);

  return (
    <Layout>
      <div className="dashboard-grid">
        {/* Row 1: KPIs */}
        <KPICard
          label={kpi.users.label}
          value={kpi.users.value}
          trend={kpi.users.trend}
          icon={Users}
          color="108, 93, 211" // Violet
        />
        <KPICard
          label={kpi.sensors.label}
          value={kpi.sensors.value}
          trend={kpi.sensors.trend}
          icon={Wifi}
          color="255, 117, 76" // Orange
        />
        <KPICard
          label={kpi.measures.label}
          value={kpi.measures.value}
          trend={kpi.measures.trend}
          icon={Activity}
          color="46, 204, 113" // Green
        />
        <KPICard
          label="Weather (Paris)"
          value="12°C"
          trend=""
          icon={CloudRain}
          color="160, 215, 231" // Blue
        />

        {/* Row 2: Map & Analytics */}
        <WorldMapWidget />
        <TopCountriesWidget />

        {/* Row 3: Full Width Chart */}
        <AnalyticsChart />
      </div>
    </Layout>
  );
};

export default Dashboard;
