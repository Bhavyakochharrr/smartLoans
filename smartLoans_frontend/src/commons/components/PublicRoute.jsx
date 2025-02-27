// src/commons/components/PublicRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Home/contexts/AuthContext';

const PublicRoute = ({ component: Component }) => {
  const { token, activeRole } = useAuth();

  if (token) {
    // Redirect to appropriate dashboard based on active role
    if (activeRole === 'user') return <Navigate to="/customer-dashboard" />;
    if (activeRole === 'banker') return <Navigate to="/banker-dashboard" />;
    if (activeRole === 'admin') return <Navigate to="/admin-dashboard" />;
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default PublicRoute;
