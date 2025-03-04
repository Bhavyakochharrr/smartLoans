export const validateLoanAmount = (amount) => {
    const numericValue = Number(amount);
     
    if (!amount) {
      return "Loan amount is required.";
    }
     
    if (numericValue < 10000 || numericValue > 10000000) {
      return "Loan amount should be between ₹10,000 and ₹1,00,00,000.";
    }
     
    return "";
  };
  
  export const validateFile = (file) => {
    const FILE_CONSTRAINTS = {
      maxSize: 5 * 1024 * 1024,
      validTypes: ["image/jpeg", "image/png", "application/pdf"]
    };
  
    if (!file) return "File is required";
     
    if (!FILE_CONSTRAINTS.validTypes.includes(file.type)) {
      return "Invalid file type. Only JPG, PNG, and PDF are allowed.";
    }
     
    if (file.size > FILE_CONSTRAINTS.maxSize) {
      return "File size exceeds the 5MB limit.";
    }
     
    return "";
  };
  
  export const validateRequiredFields = (formData) => {
    // Basic required fields validation
    const basicFields = [
      'accountNumber', 'customerName', 'phoneNumber', 'email',
      'panNumber', 'aadharNumber', 'loanAmount', 'interestRate',
      'loanDuration', 'loanType', 'employmentType'
    ];
  
    if (!basicFields.every(field => formData[field])) {
      return false;
    }
  
    // Loan-specific validations
    const loanTypeValidations = {
      "Home Loan": () => formData.propertyValue && formData.propertyLocation,
      "Personal Loan": () => formData.purpose,
      "Education Loan": () => formData.courseName && formData.institutionName,
      "Gold Loan": () => formData.goldWeight && formData.goldPurity
    };
  
    if (!loanTypeValidations[formData.loanType]?.()) {
      return false;
    }
  
    // Guarantor validation for non-government employees
    if (formData.employmentType !== "Govt" &&
        (!formData.guarantorName || !formData.guarantorIncome || !formData.relationship)) {
      return false;
    }
  
    return true;
  };
  