import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";
import { getBankers, addBanker, deleteBanker } from "../services/authService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bankers = () => {
  const [bankers, setBankers] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const validRoles = ["Loan Officer", "Senior Banker", "Banker"];
  const [newBanker, setNewBanker] = useState({ name: "", email: "", phone: "", role: validRoles[0], branch: "", username: "" });
  const [editBankerId, setEditBankerId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [bankerToDelete, setBankerToDelete] = useState(null);
  const [selectedBanker, setSelectedBanker] = useState(null);

  useEffect(() => {
    const fetchBankers = async () => {
      try {
        const data = await getBankers();
        setBankers(data);
      } catch (err) {
        setError("Error fetching bankers");
      }
    };
    fetchBankers();
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setNewBanker({ name: "", email: "", phone: "", gender: "", address: "", accountNumber: "", pannumber: "", aadharnumber: "" });
    setSelectedBanker(null);
  };

  const handleInputChange = (e) => {
    setNewBanker({ ...newBanker, [e.target.name]: e.target.value });
  };

  const handleAddBanker = async () => {
    try {
      const bankerData = { ...newBanker, password: "Passadmin@234" };
      const addedBanker = await addBanker(bankerData);
      setBankers(prevBankers => [...prevBankers, addedBanker.data]); // Ensure addedBanker.data is used
      setNewBanker({ name: "", email: "", phone: "", gender: "", address: "", accountNumber: "", pannumber: "", aadharnumber: "" });
      setShowModal(false);
      toast.success("Banker added successfully!");
    } catch (err) {
      console.error("Error adding banker:", err.response?.data || err.message);
    }
  };

  const openDeleteConfirmation = (banker) => {
    setBankerToDelete(banker);
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setBankerToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const handleDeleteBanker = async () => {
    try {
      await deleteBanker(bankerToDelete._id);
      setBankers(bankers.filter(b => b._id !== bankerToDelete._id));
      closeDeleteConfirmation();
      toast.success("Banker deleted successfully!");
    } catch (err) {
      console.error("Error deleting banker:", err.response?.data || err.message);
      setError("Error deleting banker");
    }
  };

  const viewBanker = (banker) => {
    setSelectedBanker(banker);
    setShowModal(true);
  };


  return (
    <Container fluid>
      <h1 className="my-4">Banker Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <Row className="mb-4 justify-content-center">
        <Col md={6}>
          <Card className="text-center p-3">
            <h4>Total Bankers</h4>
            <h3 style={{ color: "#41B3A2", fontSize: "2.5rem" }}>{bankers.length}</h3>
          </Card>
        </Col>
      </Row>
      <Button className="mb-3" onClick={openModal}>Add Banker</Button>
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
          {bankers.map((banker) => (
            <tr key={banker.banker_id || banker.email}> 
              <td>{banker.name}</td>
              <td>{banker.email}</td>
              <td>+91 {banker.phone}</td>
              <td>
                <Button variant="primary" onClick={() => viewBanker(banker)} style={{backgroundColor: '#41B3A2',borderColor:'#41B3A2'}}className="me-2">View</Button>
                <Button variant="danger" onClick={() => openDeleteConfirmation(banker)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>

      </Table>

      {/* Add Banker Modal */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBanker ? "Banker Information" : "Add New Banker"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBanker ? (
            <Card>
              <Card.Body>
                <div className="mb-6">
                  <h5 className="text-primary mb-3">Banker Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {selectedBanker.name}</p>
                      <p><strong>Email:</strong> {selectedBanker.email}</p>
                      <p><strong>Gender:</strong> {selectedBanker.gender}</p>
                      <p><strong>Phone:</strong> {selectedBanker.phone || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Address:</strong> {selectedBanker.address}</p>
                      <p><strong>PAN Number:</strong> {selectedBanker.pannumber}</p>
                      <p><strong>Aadhar Number:</strong> {selectedBanker.aadharnumber}</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={newBanker.name} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={newBanker.email} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control type="text" name="phone" value={newBanker.phone} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Control type="text" name="gender" value={newBanker.gender} onChange={handleInputChange}/>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control type="text" name="accountNumber" value={newBanker.accountNumber} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control type="text" name="address" value={newBanker.address} onChange={handleInputChange} placeholder="Enter Address" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>PAN Number</Form.Label>
                <Form.Control type="text" name="pannumber" value={newBanker.pannumber} onChange={handleInputChange} placeholder="Enter PAN Number" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Aadhar Number</Form.Label>
                <Form.Control type="text" name="aadharnumber" value={newBanker.aadharnumber} onChange={handleInputChange} placeholder="Enter Aadhar Number" />
              </Form.Group>
              <Button variant="primary" onClick={handleAddBanker}>Add Banker</Button>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>Cancel</Button>
          {!selectedBanker && <Button variant="primary" onClick={handleAddBanker}>Add Banker</Button>}
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirmation} onHide={closeDeleteConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {bankerToDelete?.name}? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDeleteConfirmation}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteBanker}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </Container>
  );
};

export default Bankers;