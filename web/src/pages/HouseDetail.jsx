import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Home,
  Thermometer,
  Droplets,
  Wind,
  Activity,
} from "lucide-react";
import api from "../services/api";
import Layout from "../components/layout/Layout";

const HouseDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/house/${userId}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching house data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  if (loading)
    return (
      <Layout>
        <div className="p-10 text-white">Loading...</div>
      </Layout>
    );
  if (!data || !data.user)
    return (
      <Layout>
        <div className="p-10 text-white">User not found</div>
      </Layout>
    );

  const { user, sensors } = data;

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "temperature":
        return <Thermometer className="w-5 h-5 text-red-400" />;
      case "humidity":
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case "airpollution":
        return <Wind className="w-5 h-5 text-gray-400" />;
      default:
        return <Activity className="w-5 h-5 text-green-400" />;
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* User Info Card */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-indigo-500/20 p-3 rounded-lg">
              <Home className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">House {userId}</h1>
              <p className="text-gray-400">{user.location}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Residents</p>
              <p className="text-xl font-bold text-white">
                {user.personsInHouse}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Size</p>
              <p className="text-xl font-bold text-white capitalize">
                {user.houseSize}
              </p>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400">Total Sensors</p>
              <p className="text-xl font-bold text-white">{sensors.length}</p>
            </div>
          </div>
        </div>

        {/* Sensors Grid */}
        <h2 className="text-xl font-bold text-white mb-4">Installed Sensors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensors.map((sensor) => (
            <div
              key={sensor._id}
              className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-indigo-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-700 p-2 rounded-lg">
                    {getIcon(sensor.type)}
                  </div>
                  <div>
                    <p className="font-medium text-white capitalize">
                      {sensor.type || "Unknown Type"}
                    </p>
                    <p className="text-xs text-gray-400">{sensor.location}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 bg-gray-900 px-2 py-1 rounded">
                  {new Date(sensor.creationDate).getFullYear()}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-1">Last Measure</p>
                {sensor.lastMeasure ? (
                  <div className="flex justify-between items-end">
                    <span className="text-2xl font-bold text-white">
                      {sensor.lastMeasure.value}
                    </span>
                    <span className="text-xs text-gray-500 mb-1">
                      {new Date(
                        sensor.lastMeasure.creationDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-yellow-500">No data available</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default HouseDetail;
