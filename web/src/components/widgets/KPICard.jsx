import React from "react";
import "./KPICard.css";

const KPICard = ({ label, value, trend, icon: Icon, color }) => {
  return (
    <div className="kpi-card">
      <div
        className="kpi-icon-wrapper"
        style={{ background: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div className="kpi-content">
        <h3 className="kpi-value">{value}</h3>
        <p className="kpi-label">{label}</p>
        {trend && (
          <div className="kpi-trend">
            <span
              className="trend-badge"
              style={{ color: "#27AE60", background: "rgba(39, 174, 96, 0.1)" }}
            >
              ↗ {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
