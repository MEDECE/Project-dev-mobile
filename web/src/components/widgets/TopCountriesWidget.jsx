import React, { useState, useEffect } from "react";
import axios from "axios";

const TopCountriesWidget = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        // Reuse map endpoint which is now sorted
        const response = await axios.get("http://localhost:3000/api/stats/map");
        // Take top 4 and calculate percentage if needed, or just values
        // For simplicity let's show raw count and a calculated %
        const total = response.data.reduce((acc, curr) => acc + curr.value, 0);

        const top4 = response.data.slice(0, 4).map((c) => ({
          ...c,
          percent: total > 0 ? Math.round((c.value / total) * 100) : 0,
        }));

        setCountries(top4);
      } catch (error) {
        console.error("Top countries error:", error);
      }
    };
    fetchTop();
  }, []);

  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
      }}
    >
      <h3>Top Countries</h3>
      <ul style={{ marginTop: "20px", color: "#808191" }}>
        {countries.map((c, index) => (
          <li
            key={index}
            style={{
              marginBottom: "15px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ textTransform: "capitalize" }}>
              {/* Simple flag mapping or just name */}
              {index === 0 && "🥇 "}
              {index === 1 && "🥈 "}
              {index === 2 && "🥉 "}
              {c.name}
            </span>
            <span
              style={{
                background: "rgba(108, 93, 211, 0.1)",
                color: "#6C5DD3",
                padding: "4px 8px",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "12px",
              }}
            >
              {c.percent}%
            </span>
          </li>
        ))}
        {countries.length === 0 && <p>Aucune donnée.</p>}
      </ul>
    </div>
  );
};

export default TopCountriesWidget;
