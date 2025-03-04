import axios from 'axios';

const BASE_URL = 'http://localhost:2000/api';

export const fetchPreclosureDetails = async (loanId) => {
  const response = await axios.get(`${BASE_URL}/preclosure/${loanId}`);
  return response.data;
};

export const submitPreclosureRequest = async (loanId, preclosureData) => {
  const response = await axios.post(`${BASE_URL}/preclosure/${loanId}`, preclosureData);
  return response.data;
};
