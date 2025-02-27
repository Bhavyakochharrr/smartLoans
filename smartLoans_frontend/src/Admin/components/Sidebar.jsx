import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi";
import { useAuth } from "../../Home/contexts/AuthContext";

const Sidebar = () => {
  const {logout} =useAuth();
  return (
    <div className="d-flex flex-column fixed top-16 z-10 p-3" style={{ width: "250px", backgroundColor: "#41B3A2" }}>
      <h3 className="text-white mb-4">Admin Panel</h3>
      <Nav className="flex-column w-100">
      <Nav.Link as={Link} to="/admin-dashboard" className="text-white" style={{ fontSize: "1.2rem" }}>Home</Nav.Link> 
        <Nav.Link as={Link} to="/admin-dashboard/loans" className="text-white" style={{ fontSize: "1.2rem" }}>Loans</Nav.Link>
        <Nav.Link as={Link} to="/admin-dashboard/customers" className="text-white" style={{ fontSize: "1.2rem" }}>Customers</Nav.Link>
        <Nav.Link as={Link} to="/admin-dashboard/bankers" className="text-white" style={{ fontSize: "1.2rem" }}>Bankers</Nav.Link>
        <Nav.Link as={Link} onClick={logout} className="text-white" style={{ fontSize: "1.2rem" }}><FiLogOut/>Logout</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
