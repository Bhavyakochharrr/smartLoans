import React from "react";

const Footer = () => {
  return (
    <footer className="text-center p-3 mt-4" style={{ backgroundColor: "#f8f9fa", position: "relative", bottom: 0, width: "100%" }}>
      <p>© {new Date().getFullYear()} LoanEase. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
