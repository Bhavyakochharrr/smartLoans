import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const storedToken = typeof window !== 'undefined' ? sessionStorage.getItem("token") : null;
  const storedRole = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("role")) || [] : [];
  const storedUser = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem("user")) || null : null;
  const storedActiveRole = typeof window !== 'undefined' ? sessionStorage.getItem("activeRole") : null;

  const [token, setToken] = useState(storedToken);
  const [user, setUser] = useState(storedUser);
  const [role, setRole] = useState(storedRole);
  const [activeRole, setActiveRole] = useState(storedActiveRole);

  useEffect(() => {
    console.log("Token:", token);
    console.log("User:", user);
    console.log("Role:", role);
    console.log("Active Role:", activeRole);
  }, []);

  useEffect(() => {
    if (storedToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, [storedToken]);

  const login = async (token) => {
    try {
      sessionStorage.setItem("token", token);
      setToken(token);

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      window.history.pushState(null, null, window.location.pathname);

      const response = await axios.get("https://localhost:4001/api/users/current");
      console.log("response", response.data);

      if (response.data && response.data.claims) {
        setUser(response.data.claims);
        setRole(response.data.claims.roles);
        if (response.data.claims.roles.length === 1) {
          setActiveRole(response.data.claims.roles[0]);
          sessionStorage.setItem("activeRole", response.data.claims.roles[0]);
        }
        sessionStorage.setItem("role", JSON.stringify(response.data.claims.roles));
        sessionStorage.setItem("user", JSON.stringify(response.data.claims));
      } else {
        toast.error("Roles not found in response");
        setRole([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      logout();
    }
  };

  const logout = () => {
    window.onpopstate = null;
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("activeRole");

    setToken(null);
    setUser(null);
    setRole([]);
    setActiveRole(null);

    delete axios.defaults.headers.common["Authorization"];

    window.location.href = '/home';
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, role, activeRole, setActiveRole }}>
      {children}
    </AuthContext.Provider>
  );
};