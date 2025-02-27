import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
 
const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: ""
  });
 
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
 
  const validatePasswordRules = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[\W_]/.test(password),
    };
  };
 
  const validateForm = () => {
    let newErrors = {};
 
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    else if (formData.name.length < 2 || formData.name.length > 50)
      newErrors.name = "Must be 2-50 characters.";
 
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
      newErrors.email = "Invalid email format.";
 
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Must be a valid 10-digit number starting with 6-9.";
 
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    else if (formData.address.length < 5 || formData.address.length > 200)
      newErrors.address = "Must be 5-200 characters.";
 
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
   
    // Clear any existing error for this field when the user starts typing again
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");
 
    if (!validateForm()) return;
 
    try {
      await axios.post("https://18.233.100.171:4001/api/users", formData);
      setSuccess("User registered successfully!");
      setTimeout(() => navigate("/home"), 2000);
    } catch (err) {
      const errorResponse = err.response?.data;
     
      // Handle duplicate email error
      if (errorResponse?.code === 11000 ||
          err.response?.status === 409 ||
          errorResponse?.message?.includes("duplicate key") ||
          errorResponse?.message?.includes("E11000")) {
       
        setErrors({ email: "This email is already registered. Please use a different email or try logging in." });
      } else {
        // Handle other errors
        setErrors({ general: errorResponse?.message || "Registration failed. Please try again." });
      }
    }
  };
 
  const passwordRules = validatePasswordRules(formData.password);
 
  // Check if all password rules are met
  const isPasswordValid = Object.values(passwordRules).every(rule => rule);
 
  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center min-vh-100 px-3 mt-5 mb-5">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "500px" }}>
        <h2 className="text-center mb-4">Register</h2>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        {success && <div className="alert alert-success">{success}</div>}
 
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-3">
            <label className="form-label">Full Name <span className="text-danger">*</span></label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
 
          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Email <span className="text-danger">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email address"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
 
          {/* Phone */}
          <div className="mb-3">
            <label className="form-label">Phone <span className="text-danger">*</span></label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              placeholder="Enter your 10-digit phone number"
            />
            {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
          </div>
 
          {/* Address */}
          <div className="mb-3">
            <label className="form-label">Address <span className="text-danger">*</span></label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="Enter your complete address"
            />
            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
          </div>
 
          {/* Password with React Icons */}
          <div className="mb-3">
            <label className="form-label">Password <span className="text-danger">*</span></label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-control ${!isPasswordValid && formData.password ? "border-warning" : ""}`}
              placeholder="Create a strong password"
            />
            <small className="form-text">
              <ul className="list-unstyled mt-2">
                <li className={passwordRules.length ? "text-success" : "text-danger"}>
                  {passwordRules.length ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least 8 characters
                </li>
                <li className={passwordRules.uppercase ? "text-success" : "text-danger"}>
                  {passwordRules.uppercase ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least one uppercase letter
                </li>
                <li className={passwordRules.number ? "text-success" : "text-danger"}>
                  {passwordRules.number ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least one number
                </li>
                <li className={passwordRules.specialChar ? "text-success" : "text-danger"}>
                  {passwordRules.specialChar ? <MdCheckCircle className="me-1" /> : <MdCancel className="me-1" />}
                  At least one special character
                </li>
              </ul>
            </small>
          </div>
 
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ backgroundColor: "#41B3A2", border: "none" }}
          >
            Register
          </button>
        </form>
 
        <div className="text-center mt-3">
          <a href="/login" className="text-decoration-none">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};
 
export default Register;