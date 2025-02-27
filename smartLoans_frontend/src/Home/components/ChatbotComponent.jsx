import React, { useState } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { FaRobot } from "react-icons/fa";
import '../css/ChatbotComponent.css';

// Chatbot theme customization
const theme = {
  background: "#f5f8fb",
  fontFamily: "Arial, sans-serif",
  headerBgColor: "#41b3a2",
  headerFontColor: "#fff",
  headerFontSize: "18px",
  botBubbleColor: "#007bff",
  botFontColor: "#fff",
  userBubbleColor: "#f8f9fa",
  userFontColor: "#000",
};

const ChatbotComponent = () => {
  const [showChatbot, setShowChatbot] = useState(false);
  const navigate = useNavigate();

  // Function to handle navigation based on user selection
  const handleNavigation = ({ value }) => {
    navigate(value);
  };

  // Define chatbot conversation flow
  const steps = [
    { id: "1", message: "Hi! I am your Loan Assistant. How can I help you?", trigger: "options" },

    {
      id: "options",
      options: [
        { value: "apply-loan", label: "Apply for a Loan", trigger: "apply-loan" },
        { value: "emi-calculator", label: "Calculate EMI", trigger: "emi-calculator" },
        { value: "loan-status", label: "Check Loan Status", trigger: "loan-status" },
        { value: "account-services", label: "Account Services", trigger: "account-services" },
        { value: "contact-support", label: "Contact Support", trigger: "contact-support" },
      ],
    },

    // Apply for Loan
    {
      id: "apply-loan",
      message: "Great! What type of loan are you looking for?",
      trigger: "loan-types",
    },
    {
      id: "loan-types",
      options: [
        { value: "home-loan", label: "Home Loan", trigger: "navigate-apply-loan" },
        { value: "personal-loan", label: "Personal Loan", trigger: "navigate-apply-loan" },
        { value: "gold-loan", label: "Gold Loan", trigger: "navigate-apply-loan" },
        { value: "education-loan", label: "Education Loan", trigger: "navigate-apply-loan" },
      ],
    },
    {
      id: "navigate-apply-loan",
      message: "Redirecting you to the loan application page...",
      trigger: () => {
        handleNavigation({ value: "/customer-dashboard/apply-loan" });
        return "end";
      },
    },

    // EMI Calculator
    {
      id: "emi-calculator",
      message: "You can calculate your EMI here!",
      trigger: () => {
        handleNavigation({ value: "/emi-calculator" });
        return "end";
      },
    },

    // Loan Status
    {
      id: "loan-status",
      message: "You can check your loan status here.",
      trigger: () => {
        handleNavigation({ value: "/customer-dashboard/application-status" });
        return "end";
      },
    },

    // Account Services
    {
      id: "account-services",
      message: "What would you like to do?",
      trigger: "account-options",
    },
    {
      id: "account-options",
      options: [
        { value: "view", label: "View Account Info", trigger: "navigate-account" },
        { value: "deposit", label: "Deposit Money", trigger: "navigate-account" },
        { value: "withdraw", label: "Withdraw Money", trigger: "navigate-account" },
        { value: "transfer", label: "Fund Transfer", trigger: "navigate-account" },
      ],
    },
    {
      id: "navigate-account",
      message: "Redirecting you to account services...",
      trigger: () => {
        handleNavigation({ value: "/customer-dashboard" });
        return "end";
      },
    },

    // Contact Support
    {
      id: "contact-support",
      message: "You can reach our support team at support@loanbank.com or call +91 1234567890",
      end: true,
    },
  ];

  return (
    <div>
      {showChatbot && (
        <ThemeProvider theme={theme}>
          <ChatBot steps={steps} floating={true} opened={true} headerTitle="Loan Assistant" />
        </ThemeProvider>
      )}

      {/* Floating Chatbot Toggle Button */}
      <Button
        variant="primary"
        className="chatbot-button"
        onClick={() => setShowChatbot(!showChatbot)}
      >
        <FaRobot size={25} />
      </Button>

    </div>
  );
};

export default ChatbotComponent;
