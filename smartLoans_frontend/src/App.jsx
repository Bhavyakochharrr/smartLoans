import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Outlet } from "react-router-dom";
import LoanDetails from "./Customer/components/LoanDetails";
import Profile from "./Customer/components/Profile";
import Login from "./Home/components/Login";
import Registration from "./Home/components/Registration";
import ProtectedRoute from "./commons/components/ProtectedRoute";
import EmiCalculator from "./Home/components/EmiCalculator";
import Home from "./Home/components/Home";
import LoanApplication from "./Customer/components/LoanApplication";
import ForgotPassword from "./Home/components/ForgotPassword";
import NotFoundPage from "./commons/components/NotFoundPage";
import RoleBasedNavBar from "./commons/components/RoleBasedNavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import BankerDashboard from "./Banker/pages/BankerDashboard";
import BankerHome from "./Banker/components/BankerHome";
import LoanApplications from "./Banker/components/LoanApplications";
import ReviewedApplications from "./Banker/components/ReviewedApplications";
import RoleBasedFooter from "./commons/components/RoleBasedFooter";
import Dashboard from "./Admin/pages/Dashboard";
import Loans from "./Admin/pages/Loans";
import Customers from "./Admin/pages/Customers";
import Bankers from "./Admin/pages/Bankers";
import Sidebar from "./Admin/components/Sidebar";
import CustomerDashboard from "./Customer/components/CustomerDashboard";
import ApplicationStatus from "./Customer/components/ApplicationStatus";
import CustomerHome from "./Customer/components/CustomerHome";
// import AdminDashboard from "./Admin/pages/Dashboard";
import EMIPayment from "./Customer/components/EMIPayments";
import PreClosure from "./Customer/components/PreClosure";
import ChatbotComponent from "./Home/components/ChatbotComponent";
import RoleSelection from "./commons/components/RoleSelection";
import { useAuth } from "./Home/contexts/AuthContext";
 
// Component for Redirecting Users Based on Role
const NavigateToRole = () => {
  const navigate = useNavigate();
  const { role, activeRole } = useAuth();
 
  useEffect(() => {
    console.log("Role:", role);
    console.log("Active Role:", activeRole);
 
    if (!role || role.length === 0) {
      navigate('/home');
      return;
    }
 
    if (role.length > 1 && !activeRole) {
      navigate('/role-selection');
      return;
    }
 
    // Single role navigation or active role is already set
    if (activeRole) {
      if (activeRole === "banker") navigate("/banker-dashboard");
      else if (activeRole === "user") navigate("/customer-dashboard");
      else if (activeRole === "admin") navigate("/admin-dashboard");
      else navigate("/home");
    } else {
      if (role.includes("banker")) navigate("/banker-dashboard");
      else if (role.includes("user")) navigate("/customer-dashboard");
      else if (role.includes("admin")) navigate("/admin-dashboard");
      else navigate("/home");
    }
  }, [navigate, role, activeRole]);
 
  return null;
};
 
// Layout for Admin Dashboard with Sidebar
const AdminLayout = () => {
  return (
      <div className="d-flex">
          <Sidebar /> {/* Sidebar is always visible in the admin dashboard */}
          <div className="p-4 flex-grow-1" style={{ width: "100%" }}>
              <Outlet />
             
          </div>
      </div>
  );
};
 
const App = () => {
  const { token } = useAuth();
 
  useEffect(() => {
    const preventBackButton = () => {
      window.history.pushState(null, null, window.location.pathname);
      window.history.forward();
    };
 
    const handlePopState = () => {
      if (token) {
        preventBackButton();
      }
    };
 
    if (token) {
      // Push initial state
      window.history.pushState(null, null, window.location.pathname);
     
      // Add event listeners
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('load', preventBackButton);
    }
 
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('load', preventBackButton);
    };
  }, [token]);
 
  return (
    <Router>
      <RoleBasedNavBar />
      <Routes>
        <Route path="/" element={<NavigateToRole />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/banker-dashboard" element={<ProtectedRoute component={BankerDashboard} allowedRoles={["banker"]} />}>
          <Route path="dashboard" element={<BankerHome />} />
          <Route path="loans" element={<LoanApplications />} />
          <Route path="reviewed" element={<ReviewedApplications />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Registration />} />
        <Route path="/emi-calculator" element={<EmiCalculator />} />
        <Route path="*" element={<NotFoundPage />} />
 
        <Route path="/admin-dashboard" element={<ProtectedRoute component={AdminLayout} allowedRoles={["admin"]} />}>
          <Route index element={<Dashboard />} />
          <Route path="loans" element={<ProtectedRoute component={Loans} allowedRoles={["admin"]} />} />
          <Route path="customers" element={<ProtectedRoute component={Customers} allowedRoles={["admin"]} />} />
          <Route path="bankers" element={<ProtectedRoute component={Bankers} allowedRoles={["admin"]} />} />
        </Route>
 
        <Route path="/customer-dashboard" element={<ProtectedRoute component={CustomerDashboard} allowedRoles={["user"]} />}>
          <Route index element={<CustomerHome />} />
          <Route path="apply-loan" element={<ProtectedRoute component={LoanApplication} allowedRoles={["user"]} />} />
          <Route path="loan-details" element={<ProtectedRoute component={LoanDetails} allowedRoles={["user"]} />} />
          <Route path="application-status" element={<ProtectedRoute component={ApplicationStatus} allowedRoles={["user"]} />} />
          <Route path="profile" element={<ProtectedRoute component={Profile} allowedRoles={["user"]} />} />
          <Route path="payment" element={<ProtectedRoute component={EMIPayment} allowedRoles={["user"]} />} />
          <Route path="preclosure" element={<ProtectedRoute component={PreClosure} allowedRoles={["user"]} />} />
        </Route>
      </Routes>
      <RoleBasedFooter />
      <ChatbotComponent />
    </Router>
  );
};
 
export default App;