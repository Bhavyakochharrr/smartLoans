import React from "react";
import { Navbar, Container } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" className="mb-3" style={{ backgroundColor: "#41B3A2" }}>
      <Container>
        <Navbar.Brand>Admin Dashboard</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
