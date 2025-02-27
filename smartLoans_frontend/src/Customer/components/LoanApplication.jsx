import React, { useState } from "react";
import { Container, Card, Form, Button, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../Home/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchLoanDetailsService } from "../../services/loanDetailsService";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Constants
const LOAN_OPTIONS = [
  { value: "Home Loan", label: "Home Loan", interestRate: 6.5 },
  { value: "Personal Loan", label: "Personal Loan", interestRate: 12.0 },
  { value: "Gold Loan", label: "Gold Loan", interestRate: 7.0 },
  { value: "Education Loan", label: "Education Loan", interestRate: 10.5 },
];
 
const FILE_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  validTypes: ["image/jpeg", "image/png", "application/pdf"]
};
 
const LoanApplication = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [validationMessage, setValidationMessage] = useState("");
 
  // Form state initialization
  const [formData, setFormData] = useState({
    accountNumber: user.accountNumber || "",
    customerName: user.name || "",
    phoneNumber: "",
    email: user.email || "",
    panNumber: "",
    aadharNumber: "",
    loanAmount: "",
    interestRate: "",
    loanDuration: "",
    loanType: "",
    employmentType: "",
    guarantorName: "",
    guarantorIncome: "",
    relationship: "",
    // Conditional loan fields
    propertyValue: "",
    propertyLocation: "",
    purpose: "",
    courseName: "",
    institutionName: "",
    goldWeight: "",
    goldPurity: "",
  });
 
  const [files, setFiles] = useState({
    passportPhoto: null,
    aadharCard: null,
    panCard: null,
    signature: null,
  });
 
  const [fileValidation, setFileValidation] = useState({
    passportPhoto: "",
    aadharCard: "",
    panCard: "",
    signature: "",
  });
 
  // Validation functions
  const validateFile = (file, name) => {
    if (!file) return "File is required";
   
    if (!FILE_CONSTRAINTS.validTypes.includes(file.type)) {
      return "Invalid file type. Only JPG, PNG, and PDF are allowed.";
    }
   
    if (file.size > FILE_CONSTRAINTS.maxSize) {
      return "File size exceeds the 5MB limit.";
    }
   
    return "";
  };
 
  const validateLoanAmount = (amount) => {
    const numericValue = Number(amount);
   
    if (!amount) {
      return "Loan amount is required.";
    }
   
    if (numericValue < 10000 || numericValue > 10000000) {
      return "Loan amount should be between ₹10,000 and ₹1,00,00,000.";
    }
   
    return "";
  };
 
  // Event handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
 
  const handleBlur = () => {
    setValidationMessage(validateLoanAmount(formData.loanAmount));
  };
 
  const handleLoanTypeChange = (e) => {
    const selectedLoan = LOAN_OPTIONS.find(loan => loan.value === e.target.value);
    setFormData(prev => ({
      ...prev,
      loanType: selectedLoan.value,
      interestRate: selectedLoan.interestRate,
    }));
  };
 
  const handleEmploymentTypeChange = (e) => {
    const employmentType = e.target.value;
    setFormData(prev => ({
      ...prev,
      employmentType,
      // Reset guarantor fields if Government employee
      ...(employmentType === "Govt" && {
        guarantorName: "",
        guarantorIncome: "",
        relationship: ""
      })
    }));
  };
 
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
   
    // Validate the file
    const errorMessage = validateFile(file, name);
   
    setFileValidation(prev => ({ ...prev, [name]: errorMessage }));
    setFiles(prev => ({ ...prev, [name]: file }));
  };
 
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Validate loan amount
    const loanAmountError = validateLoanAmount(formData.loanAmount);
    if (loanAmountError) {
      setValidationMessage(loanAmountError);
      return;
    }
   
    // Check for file validation errors
    const fileErrors = Object.values(fileValidation).filter(msg => msg !== "");
    if (fileErrors.length > 0) {
      toast.error("Please upload valid documents.");
      return;
    }
   
    // Validate required fields based on loan type
    if (!validateRequiredFields()) {
      toast.error("Please fill in all required fields.");
      return;
    }
   

    try {
      const { totalLoans, typeOfLastLoan } = await fetchLoanDetailsService(formData.accountNumber);
  
      console.log(`Total Loans: ${totalLoans}, Type of Last Loan: ${typeOfLastLoan}`);
  
      // **Step 2: Check conditions**
      if (totalLoans >= 2) {
        toast.error("You already have 2 or more active (Approved/Pending) loans. Cannot proceed.");
        return;
      }
  
      if (typeOfLastLoan === formData.loanType) {
        toast.error(`Your last loan was also a ${typeOfLastLoan}. Please choose a different loan type.`);
        return;
      }
    } catch (error) {
      toast.error("Error fetching loan details. Please try again.");
      console.error("Error fetching loan details:", error);
      return;
    }


    // Prepare form data for submission
    const formDataToSend = prepareFormData();
    
    try {
      const response = await submitLoanApplication(formDataToSend);
      console.log(response);
      if (response.status === 201) {
        sessionStorage.setItem("loandata", JSON.stringify(response.data));
        toast.success("Loan Application Submitted Successfully!");
        // Add a small delay before navigating to ensure toast is displayed
        setTimeout(() => {
          navigate("/customer-dashboard/application-status");
        }, 1500);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Loan Application Submission Failed");
    }
  };
 
  // Helper functions
  const validateRequiredFields = () => {
    // Basic required fields
    if (
      !formData.accountNumber ||
      !formData.customerName ||
      !formData.phoneNumber ||
      !formData.email ||
      !formData.panNumber ||
      !formData.aadharNumber ||
      !formData.loanAmount ||
      !formData.interestRate ||
      !formData.loanDuration ||
      !formData.loanType ||
      !formData.employmentType
    ) {
      return false;
    }
   
    // Check loan-specific fields
    if (formData.loanType === "Home Loan" && (!formData.propertyValue || !formData.propertyLocation)) {
      return false;
    }
   
    if (formData.loanType === "Personal Loan" && !formData.purpose) {
      return false;
    }
   
    if (formData.loanType === "Education Loan" && (!formData.courseName || !formData.institutionName)) {
      return false;
    }
   
    if (formData.loanType === "Gold Loan" && (!formData.goldWeight || !formData.goldPurity)) {
      return false;
    }
   
    // Check guarantor fields for non-government employees
    if (formData.employmentType !== "Govt" &&
        (!formData.guarantorName || !formData.guarantorIncome || !formData.relationship)) {
      return false;
    }
   
    return true;
  };
 
  const prepareFormData = () => {
    const formDataToSend = new FormData();
   
    // Add form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
   
    // Add files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formDataToSend.append(key, files[key]);
      }
    });
   
    return formDataToSend;
  };
 
  const submitLoanApplication = async (formDataToSend) => {
    return axios.post("http://localhost:2000/api/loan/apply_loan", formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      },
    });
  };
 
  // Conditional form field components
  const renderLoanTypeSpecificFields = () => {
    switch (formData.loanType) {
      case "Home Loan":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Property Value</Form.Label>
              <Form.Control type="number" name="propertyValue" value={formData.propertyValue} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Property Location</Form.Label>
              <Form.Control type="text" name="propertyLocation" value={formData.propertyLocation} onChange={handleChange} required />
            </Form.Group>
          </>
        );
      case "Personal Loan":
        return (
          <Form.Group className="mb-3">
            <Form.Label>Purpose of Loan</Form.Label>
            <Form.Control type="text" name="purpose" value={formData.purpose} onChange={handleChange} required />
          </Form.Group>
        );
      case "Education Loan":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Course Name</Form.Label>
              <Form.Control type="text" name="courseName" value={formData.courseName} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Institution Name</Form.Label>
              <Form.Control type="text" name="institutionName" value={formData.institutionName} onChange={handleChange} required />
            </Form.Group>
          </>
        );
      case "Gold Loan":
        return (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Gold Weight (in grams)</Form.Label>
              <Form.Control type="number" name="goldWeight" value={formData.goldWeight} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gold Purity (in Karat)</Form.Label>
              <Form.Control type="text" name="goldPurity" value={formData.goldPurity} onChange={handleChange} required />
            </Form.Group>
          </>
        );
      default:
        return null;
    }
  };
 
  const renderGuarantorFields = () => {
    if (formData.employmentType !== "Govt") {
      return (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Guarantor Name</Form.Label>
            <Form.Control type="text" name="guarantorName" value={formData.guarantorName} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Guarantor Income</Form.Label>
            <Form.Control type="number" name="guarantorIncome" value={formData.guarantorIncome} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Guarantor Relationship</Form.Label>
            <Form.Control type="text" name="relationship" value={formData.relationship} onChange={handleChange} required />
          </Form.Group>
        </>
      );
    }
    return null;
  };
 
  const renderFileUploadField = (name, label) => (
    <Form.Group className="mb-3">
      <Form.Label>{label}</Form.Label>
      <Form.Control type="file" name={name} onChange={handleFileChange} required />
      {fileValidation[name] && (
        <Form.Text className="text-danger">{fileValidation[name]}</Form.Text>
      )}
    </Form.Group>
  );
 
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100 mt-5 mb-5">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Card className="shadow p-4" style={{ width: "40rem", borderTop: "5px solid #41B3A2" }}>
        <h2 className="text-center mb-4" style={{ color: "#41B3A2" }}>Loan Application</h2>
        <ProgressBar
          now={progress}
          animated
          variant="info"
          className="mb-3"
          style={{ height: "10px", borderRadius: "5px" }}
        />
 
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Basic Information */}
          <Form.Group className="mb-3">
            <Form.Label>Account Number</Form.Label>
            <Form.Control type="text" name="accountNumber" value={user.accountNumber} disabled />
          </Form.Group>
 
          <Form.Group className="mb-3">
            <Form.Label>Customer Name</Form.Label>
            <Form.Control type="text" name="customerName" value={user.name} disabled />
          </Form.Group>
 
          <Form.Group className="mb-3">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </Form.Group>
 
          <Form.Group className="mb-3">
            <Form.Label>Aadhar Number</Form.Label>
            <Form.Control type="text" name="aadharNumber" value={formData.aadharNumber} onChange={handleChange} required />
          </Form.Group>
 
          <Form.Group className="mb-3">
            <Form.Label>PAN Number</Form.Label>
            <Form.Control type="text" name="panNumber" value={formData.panNumber} onChange={handleChange} required />
          </Form.Group>
 
          {/* Loan Information */}
          <Form.Group className="mb-3">
            <Form.Label>Loan Type</Form.Label>
            <Form.Select name="loanType" value={formData.loanType} onChange={handleLoanTypeChange} required>
              <option value="">Select Loan Type</option>
              {LOAN_OPTIONS.map((loan) => (
                <option key={loan.value} value={loan.value}>{loan.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
 
          {/* Conditional Loan Fields */}
          {renderLoanTypeSpecificFields()}
 
          <Form.Group className="mb-3">
            <Form.Label>Loan Duration (Months)</Form.Label>
            <Form.Control type="number" name="loanDuration" value={formData.loanDuration} onChange={handleChange} required />
          </Form.Group>
 
          <Form.Group className="mb-3">
            <Form.Label>Loan Amount</Form.Label>
            <Form.Control
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {validationMessage && <Form.Text className="text-danger">{validationMessage}</Form.Text>}
          </Form.Group>
 
          <Form.Group className="mb-3">
            <Form.Label>Interest Rate (%)</Form.Label>
            <Form.Control type="number" name="interestRate" value={formData.interestRate} disabled />
          </Form.Group>
 
          {/* Employment Information */}
          <Form.Group className="mb-3">
            <Form.Label>Employment Type</Form.Label>
            <Form.Select name="employmentType" value={formData.employmentType} onChange={handleEmploymentTypeChange} required>
              <option value="">Select Employment Type</option>
              <option value="Govt">Government</option>
              <option value="Private">Private</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>
 
          {/* Conditional Guarantor Fields */}
          {renderGuarantorFields()}
 
          {/* Document Uploads */}
          {renderFileUploadField("passportPhoto", "Upload Passport Photo")}
          {renderFileUploadField("aadharCard", "Upload Aadhar Card")}
          {renderFileUploadField("panCard", "Upload PAN Card")}
          {renderFileUploadField("signature", "Upload Signature")}
 
          <Button
            type="submit"
            className="w-100"
            style={{ backgroundColor: "#41B3A2", border: "none" }}
          >
            Apply Now
          </Button>
        </Form>
      </Card>
    </Container>
  );
};
 
export default LoanApplication;