import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Container, Row, Col, Card } from "react-bootstrap";
import { getLoans } from "../services/authService";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const data = await getLoans();
        setLoans(data);
      } catch (err) {
        setError("Error fetching loans");
      }
    };

    fetchLoans();
  }, []);

  const handleViewLoan = (loan) => {
    setSelectedLoan(loan);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  return (
    <Container fluid>
      <h1 className="my-4">Loan Management</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center p-3">
            <h5>Total Loans</h5>
            <h3 style={{ color: "#41B3A2" }}>{loans.length}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h5>Loans Approved</h5>
            <h3 style={{ color: "#28a745" }}>{loans.filter(l => l.status === "Approved").length}</h3>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center p-3">
            <h5>Loans Rejected</h5>
            <h3 style={{ color: "#dc3545" }}>{loans.filter(l => l.status === "Rejected").length}</h3>
          </Card>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Loan Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map((loan) => (
            <tr key={loan._id}>
              <td>{loan.customerName}</td>
              <td>₹ {loan.loanAmount}</td>
              <td>
                <span className={`badge bg-${loan.status === "Pending" ? "warning" : loan.status === "Approved" ? "success" : "danger"}`}>
                  {loan.status}
                </span>
              </td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleViewLoan(loan)} style={{ backgroundColor: '#41B3A2', borderColor: '#41B3A2' }}>Review Application</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Loan Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLoan && (
            <Card>
              <Card.Body>
                <div className="mb-6">
                  <h5 className="text-primary mb-3">Customer Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Name:</strong> {selectedLoan.customerName}</p>
                      <p><strong>Email:</strong> {selectedLoan.email}</p>
                      <p><strong>Phone:</strong> {selectedLoan.phoneNumber || 'N/A'}</p>
                      <p><strong>ITR Value:</strong> {selectedLoan.itrValue || 'N/A'}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Account Number:</strong> {selectedLoan.accountNumber || 'N/A'}</p>
                      <p><strong>PAN Number:</strong> {selectedLoan.pannumber || 'N/A'}</p>
                      <p><strong>CIBIL Score:</strong> {selectedLoan.cibilScore || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5 className="text-primary mb-3">Loan Information</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Loan Amount:</strong> ₹{selectedLoan.loanAmount}</p>
                      <p><strong>Status:</strong> {selectedLoan.status|| 'N/A'}</p>
                      <p><strong>Interest Rate:</strong> {selectedLoan.interestRate}%</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Loan Term:</strong> {selectedLoan.loanDuration} years</p>
                      <p><strong>Monthly Payment:</strong> {selectedLoan.emi_loan}</p>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Loans;