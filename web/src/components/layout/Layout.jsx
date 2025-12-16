import React from "react";
import Sidebar from "./Sidebar";
import "./Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <header className="top-header">
          <div className="search-bar">
            {/* Mock Search */}
            <input type="text" placeholder="Search for anything..." />
          </div>
          <div className="user-profile">
            <span className="user-name">Roméo Admin</span>
            <div className="user-avatar">RA</div>
          </div>
        </header>
        <div className="content-wrapper">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
