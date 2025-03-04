import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../Home/contexts/AuthContext";
import LoanDetailsModal from "../modals/LoanDetailsModal";
import { BankerProvider } from "../contexts/BankerContext";
import SideBar from "../components/SideBar"; // Import the SideBar component
 
const BankerDashboard = () => {
  const { logout, user, token } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
 
  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-light" : "bg-light text-dark";
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);
 
  return (
    <BankerProvider token={token} user={user}>
      <div className="d-flex">
        <SideBar darkMode={darkMode} setDarkMode={setDarkMode} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} /> {/* Use the SideBar component */}
        <div className="flex-grow-1 p-4" style={{ marginLeft: isSidebarOpen ? "250px" : "80px", transition: "margin-left 0.3s" }}>
          <Outlet />
        </div>
      </div>
      <LoanDetailsModal />
    </BankerProvider>
  );
};
 
export default BankerDashboard;