// src/commons/components/RoleSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Home/contexts/AuthContext';

const RoleSelection = () => {
  const { role, setActiveRole, logout } = useAuth(); // Add logout from context
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // This will now redirect to home page
  };
  const handleRoleSelect = (selectedRole) => {
    // Store the active role
    sessionStorage.setItem("activeRole", selectedRole);
    setActiveRole(selectedRole);

    // Navigate based on selected role
    switch (selectedRole) {
      case 'banker':
        navigate('/banker-dashboard');
        break;
      case 'user':
        navigate('/customer-dashboard');
        break;
      case 'admin':
        navigate('/admin-dashboard');
        break;
      default:
        navigate('/home');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Select Your Role</h2>
      <div className="d-flex gap-3 justify-content-center">
        {role?.includes('user') && (
          <button 
            className="btn btn-primary"
            onClick={() => handleRoleSelect('user')}
          >
            Continue as Customer
          </button>
        )}
        {role?.includes('banker') && (
          <button 
            className="btn authButton"
            onClick={() => handleRoleSelect('banker')}
          >
            Continue as Banker
          </button>
        )}
        {role?.includes('admin') && (
          <button 
            className="btn authButton"
            onClick={() => handleRoleSelect('admin')}
          >
            Continue as Admin
          </button>
        )}
      </div>
      <div className="text-center mt-4">
        <button 
          className="btn btn-secondary"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default RoleSelection;
