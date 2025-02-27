import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from "react-bootstrap";
import Sidebar from '../components/Sidebar'; // Adjust the import path as necessary
import { getLoans, getCustomers, getBankers } from "../services/authService";

const Dashboard = () => {
  const [totalLoans, setTotalLoans] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [totalBankers, setTotalBankers] = useState(0);
  const [approvedLoans, setApprovedLoans] = useState(0);
  const [rejectedLoans, setRejectedLoans] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loans = await getLoans();
        const customers = await getCustomers();
        const bankers = await getBankers();

        setTotalLoans(loans.length);
        setActiveCustomers(customers.length);
        setPendingApprovals(loans.filter(loan => loan.status === "Pending").length);
        setTotalBankers(bankers.length);
        setApprovedLoans(loans.filter(loan => loan.status === "Approved").length);
        setRejectedLoans(loans.filter(loan => loan.status === "Rejected").length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="py-4">
            {/* Header Section */}
            <div className="mb-4 text-center">
              <h1 className="fw-bold" style={{ marginTop: '20px' }}>Welcome back, Admin</h1>
              <p style={{ marginBottom: '80px' }}>Here’s a quick overview of your loan system.</p>
            </div>

            {/* Stats Section */}
            <Row className="g-4">
              <Col md={6}>
                <Card className="shadow-sm border-0 rounded-3 custom-card">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-muted mb-0">Total Loans</h5>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                           stroke="#41B3A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                    </div>
                    <div className="d-flex justify-content-between align-items-end mt-3">
                      <h2 className="fw-bold mb-0">{totalLoans}</h2>
                      <div className="text-end">
                        <span className="fw-bold" style={{ color: '#41B3A2' }}>+12.5%</span>
                        <br />
                        <small className="text-muted">vs last month</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 rounded-3 custom-card">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-muted mb-0">Active Customers</h5>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                           stroke="#41B3A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0 0" />
                      </svg>
                    </div>
                    <div className="d-flex justify-content-between align-items-end mt-3">
                      <h2 className="fw-bold mb-0">{activeCustomers}</h2>
                      <div className="text-end">
                        <span className="fw-bold" style={{ color: '#41B3A2' }}>+8.3%</span>
                        <br />
                        <small className="text-muted">vs last month</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 rounded-3 custom-card">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-muted mb-0">Pending Approvals</h5>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                           stroke="#41B3A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 6v6l4 2M12 2a10 10 0 1 1-10 10 10 10 0 0 1 10-10z" />
                      </svg>
                    </div>
                    <div className="d-flex justify-content-between align-items-end mt-3">
                      <h2 className="fw-bold mb-0">{pendingApprovals}</h2>
                      <div className="text-end">
                        <span className="fw-bold" style={{ color: '#41B3A2' }}>+5</span>
                        <br />
                        <small className="text-muted">new requests</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="shadow-sm border-0 rounded-3 custom-card">
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="text-muted mb-0">Total Bankers</h5>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" 
                           stroke="#41B3A2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className="d-flex justify-content-between align-items-end mt-3">
                      <h2 className="fw-bold mb-0">{totalBankers}</h2>
                      <div className="text-end">
                        <span className="fw-bold" style={{ color: '#41B3A2' }}>+15.2%</span>
                        <br />
                        <small className="text-muted">vs last month</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Styles */}
      <style>
        {`
          .custom-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }
          .custom-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }
        `}
      </style>
    </Container>
  );
};

export default Dashboard;
