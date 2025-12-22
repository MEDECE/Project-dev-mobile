import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import api from "../../services/api";

const TopRiskyCountriesWidget = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/health/top-risky-countries");
        setData(response.data);
      } catch (error) {
        console.error("Top risky countries error:", error);
      }
    };
    fetchData();
  }, []);

  const getRiskColor = (pollution) => {
    if (pollution >= 70) return "#E74C3C";
    if (pollution >= 50) return "#F39C12";
    return "#2ECC71";
  };

  const getRiskLabel = (pollution) => {
    if (pollution >= 70) return "Critique";
    if (pollution >= 50) return "Élevé";
    return "Modéré";
  };

  return (
    <div className="widget top-risky-countries">
      <h3>⚠️ Top 5 Pays à Risque</h3>
      <p className="widget-subtitle">Pire pollution moyenne</p>
      <div style={{ marginTop: "16px" }}>
        {data.map((item, index) => (
          <div
            key={item.country}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px",
              marginBottom: "8px",
              background:
                index === 0
                  ? "rgba(231, 76, 60, 0.1)"
                  : "rgba(128, 129, 145, 0.1)",
              borderRadius: "8px",
              borderLeft: `4px solid ${getRiskColor(item.avgPollution)}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: index < 3 ? "#6C5DD3" : "#808191",
                  width: "24px",
                }}
              >
                {index + 1}
              </span>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontWeight: "500",
                    textTransform: "capitalize",
                    color: "#1B1D21",
                  }}
                >
                  {item.country}
                </p>
                <p style={{ margin: 0, fontSize: "11px", color: "#808191" }}>
                  {item.measureCount} mesures
                </p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  margin: 0,
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: getRiskColor(item.avgPollution),
                }}
              >
                {item.avgPollution} AQI
              </p>
              <span
                style={{
                  fontSize: "10px",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  background: getRiskColor(item.avgPollution),
                  color: "white",
                }}
              >
                {getRiskLabel(item.avgPollution)}
              </span>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p style={{ color: "#808191" }}>Aucune donnée.</p>
        )}
      </div>
    </div>
  );
};

export default TopRiskyCountriesWidget;
