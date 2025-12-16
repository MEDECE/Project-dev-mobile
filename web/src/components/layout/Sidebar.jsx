import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Settings, Activity, Users } from "lucide-react";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">P</div>
        <span className="logo-text">P.E.IoT</span>
      </div>

      <div className="nav-section">
        <span className="nav-title">MAIN NAVIGATION</span>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Settings size={20} />
            <span>Admin</span>
          </NavLink>
        </nav>
      </div>

      <div className="nav-section">
        <span className="nav-title">INSIGHTS</span>
        <nav>
          <div className="nav-item">
            <Activity size={20} />
            <span>Analytics</span>
          </div>
          <div className="nav-item">
            <Users size={20} />
            <span>Audience</span>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
