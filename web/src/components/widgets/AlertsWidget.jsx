import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Widget.css";

const AlertsWidget = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        // Logic: Find measures where value > 30 (just as an example threshold)
        const response = await axios.get("http://localhost:3000/api/measures");
        const highTemp = response.data
          .filter((m) => m.type === "temperature" && m.value > 30)
          .slice(0, 3);
        setAlerts(highTemp);
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };

    fetchAlerts();
  }, []);

  return (
    <div className="widget alert-widget">
      <h3 style={{ color: "#e74c3c" }}>Alertes Température</h3>
      {alerts.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {alerts.map((alert) => (
            <li key={alert._id} style={{ padding: "8px 0", color: "#c0392b" }}>
              ⚠️ {alert.value}°C détecté !
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "#27ae60" }}>Aucune alerte.</p>
      )}
    </div>
  );
};

export default AlertsWidget;
