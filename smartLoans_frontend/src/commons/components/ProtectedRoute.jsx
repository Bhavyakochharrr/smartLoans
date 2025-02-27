import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../Home/contexts/AuthContext";

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const { token, role, user, activeRole } = useAuth();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ message: "User session expired" }} replace />;
  }

  if (!role || role.length === 0) {
    return <Navigate to="/unauthorized" state={{ message: "No roles assigned" }} replace />;
  }

  const hasAllowedRole = allowedRoles.includes(activeRole || role[0]);
  if (!hasAllowedRole) {
    return <Navigate 
      to="/unauthorized" 
      state={{ 
        message: "You don't have permission to access this resource",
        currentRole: activeRole || role[0],
        requiredRoles: allowedRoles
      }} 
      replace 
    />;
  }

  try {
    return <Component />;
  } catch (error) {
    console.error("Error rendering protected component:", error);
    return <Navigate to="/error" state={{ error: error.message }} replace />;
  }
};

export default ProtectedRoute;