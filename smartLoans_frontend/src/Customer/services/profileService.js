import axios from 'axios';

const BASE_URL = 'https://localhost:4001/api/users';

export const updateUserProfile = async (userData) => {
  const response = await axios.patch(`${BASE_URL}/update`, userData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await axios.patch(`${BASE_URL}/change-password`, passwordData);
  return response.data;
};
