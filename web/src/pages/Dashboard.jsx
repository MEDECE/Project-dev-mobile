import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Wifi, Activity, CloudRain, ChevronRight } from "lucide-react";
import api from "../services/api";
import Layout from "../components/layout/Layout";
import KPICard from "../components/widgets/KPICard";
import WorldMapWidget from "../components/widgets/WorldMapWidget";
import AnalyticsChart from "../components/widgets/AnalyticsChart";
import TopCountriesWidget from "../components/widgets/TopCountriesWidget";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [kpi, setKpi] = useState({
    totalUsers: 0,
    totalSensors: 0,
    avgGlobalPollution: 0,
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const kpiRes = await api.get("/kpis");
        setKpi(kpiRes.data);

        const usersRes = await api.get("/users");
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Dashboard Data Error:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <div className="dashboard-grid">
        {/* Row 1: KPIs */}
        <KPICard
          label="Total Users"
          value={kpi.totalUsers}
          trend="+12%"
          icon={Users}
          color="108, 93, 211" // Violet
        />
        <KPICard
          label="Active Sensors"
          value={kpi.totalSensors}
          trend="+5%"
          icon={Wifi}
          color="255, 117, 76" // Orange
        />
        <KPICard
          label="Avg Global Pollution"
          value={kpi.avgGlobalPollution?.toFixed(2)}
          trend="-2%"
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

        {/* Row 3: Users List & Charts */}
        <div className="col-span-12 lg:col-span-4 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-4">
            Registered Households
          </h3>
          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto custom-scrollbar">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/house/${user._id}`)}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                    {user.personsInHouse}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white line-clamp-1">
                      {user._id}
                    </p>
                    <p className="text-xs text-gray-400capitalize">
                      {user.location} • {user.houseSize}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <AnalyticsChart />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
