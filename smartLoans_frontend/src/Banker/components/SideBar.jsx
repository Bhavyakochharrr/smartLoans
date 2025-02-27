import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaFileAlt, FaUser, FaSignOutAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const SideBar = () => {
    return (
        <nav className="sidebar text-white vh-100 p-3">
            <h3 className="text-center">Banker Panel</h3>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link className="nav-link text-white" to="/banker-dashboard">
                        <FaTachometerAlt className="me-2" /> Dashboard
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-white" to="/loans">
                        <FaFileAlt className="me-2" /> Loan Applications
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link text-white" to="/profile">
                        <FaUser className="me-2" /> Profile
                    </Link>
                </li>
                <li className="nav-item mt-auto">
                    <Link className="nav-link text-white" to="/logout">
                        <FaSignOutAlt className="me-2" /> Logout
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default SideBar;
