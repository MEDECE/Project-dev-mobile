import React, { useState, useEffect } from "react";
import { AlertTriangle, Thermometer, Droplets, Wind } from "lucide-react";
import api from "../../services/api";

const CriticalAlertsWidget = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/technical/critical-alerts");
        setAlerts(response.data);
      } catch (error) {
        console.error("Critical alerts error:", error);
      }
    };
    fetchData();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "temperature":
        return <Thermometer size={16} />;
      case "humidity":
        return <Droplets size={16} />;
      case "airPollution":
        return <Wind size={16} />;
      default:
        return <AlertTriangle size={16} />;
    }
  };

  const getAlertColor = (type, value) => {
    if (type === "airPollution" && value > 90) return "#E74C3C";
    if (type === "temperature" && (value < 5 || value > 35)) return "#E74C3C";
    if (type === "humidity" && value > 85) return "#F39C12";
    return "#F39C12";
  };

  const formatValue = (type, value) => {
    switch (type) {
      case "temperature":
        return `${value}°C`;
      case "humidity":
        return `${value}%`;
      case "airPollution":
        return `${value} AQI`;
      default:
        return value;
    }
  };

  return (
    <div className="widget critical-alerts">
      <h3>🚨 Alertes Critiques</h3>
      <p className="widget-subtitle">10 dernières anomalies détectées</p>
      <div
        style={{
          marginTop: "12px",
          maxHeight: "300px",
          overflowY: "auto",
          paddingRight: "8px",
        }}
      >
        {alerts.map((alert, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 12px",
              marginBottom: "6px",
              background: "rgba(231, 76, 60, 0.05)",
              borderRadius: "8px",
              borderLeft: `3px solid ${getAlertColor(alert.type, alert.value)}`,
            }}
          >
            <div style={{ color: getAlertColor(alert.type, alert.value) }}>
              {getIcon(alert.type)}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "#1B1D21",
                }}
              >
                {alert.type === "airPollution" && "Pollution élevée"}
                {alert.type === "temperature" &&
                  (alert.value < 10
                    ? "Température basse"
                    : "Température élevée")}
                {alert.type === "humidity" && "Humidité excessive"}
              </p>
              <p style={{ margin: 0, fontSize: "11px", color: "#808191" }}>
                {alert.room} • {alert.country}
              </p>
            </div>
            <div
              style={{
                fontWeight: "bold",
                fontSize: "14px",
                color: getAlertColor(alert.type, alert.value),
              }}
            >
              {formatValue(alert.type, alert.value)}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <p style={{ color: "#2ECC71", textAlign: "center", padding: "20px" }}>
            ✅ Aucune alerte critique
          </p>
        )}
      </div>
    </div>
  );
};

export default CriticalAlertsWidget;
