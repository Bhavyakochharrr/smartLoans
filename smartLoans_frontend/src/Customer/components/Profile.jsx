import React, { useState } from "react";
import { Container, Form, Button, Modal } from "react-bootstrap";
import { useAuth } from "../../Home/contexts/AuthContext"; // Adjust the path based on your project
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProfilePage = () => {
  const { user, setUser } = useAuth(); // Get user details from context
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState({
    accountNumber: user?.accountNumber || "",
    name: user?.name || "",
    email: user?.email || "",
    mobile: user?.mobile || "",
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle input change for user details
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    try {
      console.log("formData", formData);
      const response = await axios.patch(
        "https://localhost:4001/api/users/update", 
        formData
      );
      console.log("response", response.data);
      
      setUser(response.data.user);
      sessionStorage.setItem("user", JSON.stringify(response.data.user)); // Update auth context
      
      toast.success("Profile updated successfully!", { autoClose: 3000 });
    } catch (error) {
      toast.error("Failed to update profile. Please try again.", { autoClose: 3000 });
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!", { autoClose: 3000 });
      return;
    }

    try {
      console.log("passwordData", passwordData);
      await axios.patch(
        "https://localhost:4001/api/users/change-password",
        passwordData
      );
      
      toast.success("Password changed successfully!", { autoClose: 3000 });
      
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to change password. Please try again.", { autoClose: 3000 });
    }
  };

  return (
    <Container className="mt-5">
      <ToastContainer />

      <h2 className="mb-4">User Profile</h2>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Account Number</Form.Label>
          <Form.Control type="text" value={formData.accountNumber} disabled />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleInputChange} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleInputChange} 
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Mobile no.</Form.Label>
          <Form.Control 
            type="text" 
            name="mobile" 
            value={formData.mobile} 
            onChange={handleInputChange} 
          />
        </Form.Group>

        <Button
          onClick={handleSaveChanges}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            backgroundColor: hover ? "#41B3A2" : "white",
            color: hover ? "white" : "#41B3A2",
            borderColor: "#41B3A2",
          }}
        >
          Save Changes
        </Button>

        <Button 
          variant="secondary" 
          className="ms-2" 
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </Button>
      </Form>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control 
                type="password" 
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control 
                type="password" 
                name="newPassword"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control 
                type="password" 
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value, email: user.email })}
              />
            </Form.Group>

            <Button variant="primary" onClick={handlePasswordChange}>
              Change Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ProfilePage;
