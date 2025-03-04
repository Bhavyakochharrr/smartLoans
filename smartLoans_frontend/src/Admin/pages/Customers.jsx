import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";
import { getCustomers, addCustomer, deleteCustomer, addRole, getBankers } from "../services/authService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    gender: "", 
    address: "", 
    accountNumber: "", 
    pannumber: "", 
    aadharnumber: "", 
    status: "Pending" 
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers();
        setCustomers(data);
      } catch (err) {
        setError("Error fetching customers");
      }
    };

    fetchCustomers();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewCustomer({ name: "", email: "", phone: "", gender: "", address: "", accountNumber: "", pannumber: "", aadharnumber: "" });
    setSelectedCustomer(null);
  };

  const handleInputChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async () => {
    try {
      const customerData = {
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        gender: newCustomer.gender,
        password: "Password@123", // Default password (you can change it)
        address: newCustomer.address,
        accountNumber: newCustomer.accountNumber,
        pannumber:newCustomer.pannumber,
        aadharnumber: newCustomer.aadharnumber
      };
  
      console.log("Sending data:", customerData); // Debugging
  
      const addedCustomer = await addCustomer(customerData);
      setCustomers((prevCustomers) => [...prevCustomers, addedCustomer]);
      closeModal();
      toast.success("Customer added successfully!");
    } catch (err) {
      console.error("Error adding customer:", err.response?.data || err.message);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      await deleteCustomer(customerToDelete._id);
      const updatedCustomers = customers.filter((customer) => customer._id !== customerToDelete._id);
      setCustomers(updatedCustomers);
      setShowDeleteModal(false);
      toast.success("Customer deleted successfully!");
    } catch (err) {
      setError("Error deleting customer");
    }
  };

  const confirmDeleteCustomer = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const updateRoleToBanker = async (customerEmail) => {
    try {
      await addRole(customerEmail, 'banker');
      console.log(`Role updated to banker for customer with email: ${customerEmail}`);
      toast.success("Role updated to banker successfully!");
      // Refresh the bankers list
      const updatedBankers = await getBankers();
      setBankers(updatedBankers);
    } catch (error) {
      console.error("Error updating role to banker:", error.response?.data || error.message);  
    }
  };

  return (
    <Container fluid>
      <h1 className="my-4">Customer Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Summary Cards */}
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Card className="text-center p-3">
            <h4>Total Customers</h4>
            <h3 style={{ color: "#41B3A2", fontSize: "2.5rem" }}>{customers.length}</h3>
          </Card>
        </Col>
      </Row>

      <Button className="mb-3" onClick={openModal}>Add Customer</Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>+91 {customer.phone}</td>
              <td>
                <Button variant="primary" onClick={() => handleViewCustomer(customer)} style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2' }} className="me-2">View</Button>
                <Button variant="danger"  onClick={() => confirmDeleteCustomer(customer)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedCustomer ? "Customer Information" : "Add New Customer"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer ? (
            <Card>
              <Card.Body>
                <div className="mb-6">
                  <h5 className="text-primary mb-3">Customer Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {selectedCustomer.name}</p>
                      <p><strong>Email:</strong> {selectedCustomer.email}</p>
                      <p><strong>Gender:</strong> {selectedCustomer.gender}</p>
                      <p><strong>Phone:</strong> {selectedCustomer.phone || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {selectedCustomer.address}</p>
                      <p><strong>PAN Number:</strong> {selectedCustomer.pannumber}</p>
                      <p><strong>Aadhar Number:</strong> {selectedCustomer.aadharnumber}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => updateRoleToBanker(selectedCustomer.email)}>Update Role to Banker</button>
              </Card.Body>
            </Card>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={newCustomer.name} onChange={handleInputChange} placeholder="Enter Name" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={newCustomer.email} onChange={handleInputChange} placeholder="Enter Email" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" value={newCustomer.phone} onChange={handleInputChange} placeholder="Enter Phone" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control type="text" name="gender" value={newCustomer.gender} onChange={handleInputChange} placeholder="Enter Gender" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control type="text" name="accountNumber" value={newCustomer.accountNumber} onChange={handleInputChange} placeholder="Enter Account Number" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={newCustomer.address} onChange={handleInputChange} placeholder="Enter Address" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control type="text" name="pannumber" value={newCustomer.pannumber} onChange={handleInputChange} placeholder="Enter PAN Number" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control type="text" name="aadharnumber" value={newCustomer.aadharnumber} onChange={handleInputChange} placeholder="Enter Aadhar Number" />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          {!selectedCustomer && <Button variant="primary" onClick={handleAddCustomer}>Add Customer</Button>}
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {customerToDelete?.name}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteCustomer}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default Customers;
