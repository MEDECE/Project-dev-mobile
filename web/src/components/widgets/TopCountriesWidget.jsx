import React, { useState, useEffect } from "react";
import api from "../../services/api";

const TopCountriesWidget = () => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await api.get("/analysis");
        // Sort by pollution (airPollution avg) descending to show most polluted?
        // Or number of users? The brief said "Analyse par Pays".
        // Let's assume we show pollution level.

        const countriesData = response.data.map((c) => {
          const pollution =
            c.averages.find((m) => m.type === "airPollution")?.avg || 0;
          return {
            name: c.country,
            value: pollution,
            percent: 0, // Placeholder or calculate relative to max
          };
        });

        // Calculate max for progress bar
        const maxVal = Math.max(...countriesData.map((c) => c.value)) || 1;

        const top4 = countriesData
          .sort((a, b) => b.value - a.value)
          .slice(0, 4)
          .map((c) => ({
            ...c,
            percent: Math.round((c.value / maxVal) * 100),
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
