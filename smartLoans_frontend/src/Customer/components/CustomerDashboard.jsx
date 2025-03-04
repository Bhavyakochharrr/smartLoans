import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FiSun, FiMoon, FiChevronLeft, FiChevronRight } from "react-icons/fi";
 
const CustomerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
 
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
 
  return (
    <div className={`dashboard-container ${theme}`}>
      {/* Sidebar */}
      <div className={`sidebar-container ${isSidebarOpen ? "open" : "closed"}`}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
      </div>
 
      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <Button variant="outline-primary" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
          </Button>
 
          <div className="theme-toggle">
            <Button
              variant="outline-secondary"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? <FiMoon /> : <FiSun />}
            </Button>
          </div>
        </div>
 
        <div className="content">
          <Outlet /> {/* Render nested routes here */}
        </div>
      </div>
    </div>
  );
};
 
export default CustomerDashboard;