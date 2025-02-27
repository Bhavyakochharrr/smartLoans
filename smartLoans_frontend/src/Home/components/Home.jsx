import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
import { FaHome, FaGraduationCap, FaUserTie, FaGem } from "react-icons/fa";
import { FiSun, FiMoon } from "react-icons/fi";

const loans = [
  { title: "Home Loan", description: "Own your dream home with easy EMIs and low interest rates.", icon: <FaHome size={50} color="#2D98A6" /> },
  { title: "Education Loan", description: "Invest in your future with hassle-free education financing.", icon: <FaGraduationCap size={50} color="#F5A623" /> },
  { title: "Personal Loan", description: "Get quick and flexible personal loans for your needs.", icon: <FaUserTie size={50} color="#E27D60" /> },
  { title: "Gold Loan", description: "Unlock the value of your gold with instant cash loans.", icon: <FaGem size={50} color="#C38D9E" /> },
];

const Home = () => {
  
  const navigate = useNavigate();
  const [typedText, setTypedText] = useState("");
  const message = "WELCOME TO SMART LOANS";
  const [theme, setTheme] = useState(sessionStorage.getItem("theme") || "light");

  // // **Fully Fixed Typing Effect**
  useEffect(() => {
    let i = 0;
    setTypedText(""); // Reset text before typing starts
    const interval = setInterval(() => {
      if (i <= message.length) { // Changed from `<` to `<=` to include last character
        setTypedText(message.slice(0, i)); // Using slice prevents missing letters
        i++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Dark Mode Toggle
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    sessionStorage.setItem("theme", theme);
  }, [theme]);

  const handleApplyNow = () => {
    const isLoggedIn = sessionStorage.getItem("token");
    navigate(isLoggedIn ? "/loan-application" : "/login");
  };

  return (
    <div className={`home-container ${theme}`}>
      {/* Theme Toggle Button */}
      <div className="theme-toggle">
        <Button variant="outline-secondary" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
        </Button>
      </div>

      <Container className="mt-5 mb-5 text-center">
        {/*  Typing Effect (Fixed Letter Missing Issue) */}
        <h1 className="typing-text">{typedText}</h1>
        <h3 className="subline">Find the Perfect Loan for You</h3>

        <Row className="g-4 mt-4">
          {loans.map((loan, index) => (
            <Col md={6} lg={3} key={index}>
              <Card className="text-center shadow-sm p-3 border-0 card-hover">
                <Card.Body>
                  <div className="mb-3">{loan.icon}</div>
                  <Card.Title className="fw-bold">{loan.title}</Card.Title>
                  <Card.Text>{loan.description}</Card.Text>
                  <Button className="authButton" onClick={handleApplyNow}>Apply Now</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
