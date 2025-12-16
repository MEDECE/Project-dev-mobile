import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Widget.css";

const SensorsCountWidget = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        // Assuming proxy setup or CORS allowed from localhost:3000
        const response = await axios.get(
          "http://localhost:3000/api/kpi/sensor-count"
        );
        setCount(response.data.count);
      } catch (error) {
        console.error("Error fetching sensor count:", error);
      }
    };

    fetchCount();
  }, []);

  return (
    <div className="widget">
      <h3>Capteurs Actifs</h3>
      <div className="kpi-value">{count}</div>
    </div>
  );
};

export default SensorsCountWidget;
