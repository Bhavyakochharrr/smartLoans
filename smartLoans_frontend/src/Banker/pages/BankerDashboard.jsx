import React, { useState, useEffect } from "react";
import { Button, Nav } from "react-bootstrap";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../Home/contexts/AuthContext";
import LoanDetailsModal from "../modals/LoanDetailsModal";
import { BankerProvider } from "../contexts/BankerContext"; 

const BankerDashboard = () => {
  const { logout, user, token } = useAuth();
  const [darkMode, setDarkMode] = useState(() => {
    return sessionStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    document.body.className = darkMode ? "bg-dark text-light" : "bg-light text-dark";
    sessionStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <BankerProvider token={token} user={user}>
      <div className="d-flex">
        <div
          className={`p-3 vh-100 ${darkMode ? "bg-secondary text-white border-right border-light" : "bg text-white border-right"}`}
          style={{
            width: "250px",
            boxShadow: darkMode ? "2px 0px 5px rgba(255, 255, 255, 0.1)" : "2px 0px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h4>Banker Dashboard</h4>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="dashboard" className="text-white-50">
              Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="loans" className="text-white-50">
              Loan Applications
            </Nav.Link>
            <Nav.Link as={Link} to="reviewed" className="text-white-50">
              Reviewed Applications
            </Nav.Link>
            <Nav.Link as={Link} to="profile" className="text-white-50">
              Profile
            </Nav.Link>
            <Nav.Link className="text-white" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <FiSun /> : <FiMoon />} Toggle Theme
            </Nav.Link>
            <Nav.Link className="text-white" onClick={logout}>
              <FiLogOut /> Logout
            </Nav.Link>
          </Nav>
        </div>

        <div className="flex-grow-1 p-4">
          <Outlet />
        </div>
      </div>
      <LoanDetailsModal />
    </BankerProvider>
  );
};

export default BankerDashboard;
