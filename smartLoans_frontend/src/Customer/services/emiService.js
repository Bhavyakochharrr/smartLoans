import axios from 'axios';

const BASE_URL = 'http://localhost:2000/api';

export const fetchEMIHistory = async (loanId) => {
  const response = await axios.get(`${BASE_URL}/emi/history/${loanId}`);
  return response.data;
};

export const submitEMIPayment = async (paymentData) => {
  const response = await axios.patch(`${BASE_URL}/emi/pay`, paymentData);
  return response.data;
};
