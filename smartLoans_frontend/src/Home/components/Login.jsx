import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { loginUser } from "../services/AuthService";
import { useNavigate } from "react-router-dom";
import '../../App.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login,user} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await loginUser(email, password);
      
      // Extract user and roles before setting the state
      const user = data.user;
      const userRole = user.roles; 

      // Save token & user in AuthContext
      await login(data.token, user);
      
      console.log("User role:", userRole);
      if(userRole.length>1){
        navigate("/role-selection");
        return;
      }
      // Role-based redirection
      if (userRole.includes("user")) {
        navigate("/customer-dashboard");
      } else if (userRole.includes("banker")) {
        navigate("/banker-dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Login</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 authButton">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/forgotPassword" className="text-decoration-none">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
