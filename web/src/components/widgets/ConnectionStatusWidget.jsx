import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Widget.css";

const ConnectionStatusWidget = () => {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await axios.get("http://localhost:3000/api/users"); // Simple ping query
        setOnline(true);
      } catch (error) {
        setOnline(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="widget"
      style={{ alignItems: "center", justifyContent: "center" }}
    >
      <h3>État Serveur</h3>
      <div
        style={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          backgroundColor: online ? "#2ecc71" : "#e74c3c",
          boxShadow: online ? "0 0 10px #2ecc71" : "none",
          marginBottom: "10px",
        }}
      ></div>
      <span
        style={{ fontWeight: "bold", color: online ? "#27ae60" : "#c0392b" }}
      >
        {online ? "Connecté" : "Déconnecté"}
      </span>
    </div>
  );
};

export default ConnectionStatusWidget;
