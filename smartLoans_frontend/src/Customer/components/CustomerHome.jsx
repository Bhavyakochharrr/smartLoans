

// export default CustomerHome;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiCheckCircle, FiDollarSign, FiCreditCard, FiTrendingUp, FiAlertTriangle } from "react-icons/fi";
import { useAuth } from "../../Home/contexts/AuthContext";
import { ToastContainer, toast } from 'react-toastify';

const CustomerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    applicationsSubmitted: 0,
    activeLoans: 0,
    upcomingEMI: 0,
    totalLoanAmount: 0,
    emiPaid: 0,
    overduePayments: 0,
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await axios.get(`/api/customers/${user.id}/dashboard-stats`);
        setStats(response.data);
      } catch (error) {
        toast.error("Error fetching dashboard stats:", error);
      }
    };
    fetchDashboardStats();
  }, [user.id]);
  const highlightSMART = ["S", "M", "A", "R", "T"];

  const cardData = [
    { title: "Applications Submitted", value: stats.applicationsSubmitted, icon: <FiFileText size={40} className="text-primary" />, link: "/customer-dashboard/application-status" },
    { title: "Upcoming EMI Payment", value: `$${stats.upcomingEMI}`, icon: <FiDollarSign size={40} className="text-warning" />, link: "/customer-dashboard/emis" },
    { title: "Active Loans", value: stats.activeLoans, icon: <FiCheckCircle size={40} className="text-success" />, link: "/customer-dashboard/select-loan" },
    { title: "EMI Paid So Far", value: `$${stats.emiPaid}`, icon: <FiTrendingUp size={40} className="text-success" />, link: "/customer-dashboard/payment-history" },
    { title: "Total Loan Amount", value: `$${stats.totalLoanAmount}`, icon: <FiCreditCard size={40} className="text-info" />, link: "/customer-dashboard/loan-summary" },
    { title: "Overdue Payments", value: stats.overduePayments, icon: <FiAlertTriangle size={40} className="text-danger" />, link: "/customer-dashboard/overdue-payments" },
  ];
  
  // Function to highlight letters
  const highlightTitle = (title, index) => {
    if (index >= highlightSMART.length) return title; // No highlight for extra cards
    const letterToHighlight = highlightSMART[index]; // Get S, M, A, R, T
    const parts = title.split(letterToHighlight); // Split the title at the letter
  
    return (
      <>
        {parts[0]}
        <span className="highlight">{letterToHighlight}</span>
        {parts.slice(1).join(letterToHighlight)}
      </>
    );
  };
  
  return (
    <div>
      <h2 className="mb-4">Customer Dashboard</h2>
      <Row>
        {cardData.map((card, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="p-3 shadow card-hover" onClick={() => navigate(card.link)} style={{ cursor: "pointer" }}>
              <Card.Body className="text-center">
                {card.icon}
                <h4 className="mt-2">{card.value}</h4>
                <p>{highlightTitle(card.title, index)}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CustomerHome;
