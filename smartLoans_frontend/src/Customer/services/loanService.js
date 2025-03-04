import axios from 'axios';

const BASE_URL = 'http://localhost:2000/api';

export const fetchLoanApplications = async (accountNumber) => {
  const response = await axios.get(`${BASE_URL}/loan`, {
    params: { accountNumber }
  });
  return response.data;
};


export const submitLoanApplication = async (formData, onProgressUpdate) => {
  return await axios.post(`${BASE_URL}/loan/apply_loan`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      onProgressUpdate(percentCompleted);
    },
  });
};

export const LOAN_OPTIONS = [
  { value: "Home Loan", label: "Home Loan", interestRate: 6.5 },
  { value: "Personal Loan", label: "Personal Loan", interestRate: 12.0 },
  { value: "Gold Loan", label: "Gold Loan", interestRate: 7.0 },
  { value: "Education Loan", label: "Education Loan", interestRate: 10.5 },
];

export const fetchActiveLoanDetails = async (accountNumber) => {
  const response = await axios.get(`${BASE_URL}/loan`, {
    params: { accountNumber }
  });
  return response.data.loans.filter(loan => 
    loan.status.toLowerCase() === "approved"
  );
};
