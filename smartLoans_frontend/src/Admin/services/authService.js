// export default AdminLogin;

// src/apiService.js
import axios from 'axios';


const API_BASE_URL = 'http://localhost:2000/api/admins';

const getAuthToken = () => {
  const token = sessionStorage.getItem("token");
  // Retrieve token
  if (!token) {
    console.error("No token found. User may not be logged in.");
    return null;
  }
  return token;
};

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     Authorization: `Bearer ${getAuthToken()}`,
//   },
// });

//Fetch all Loans
export const getLoans = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/loans/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
}
// Fetch all Customers
export const getCustomers = async () => {
  try {
    const token = getAuthToken(); 
    const response = await axios.get(`${API_BASE_URL}/customers`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

//add more customers
export const addCustomer = async (customerData) => {
  try {
    const token = getAuthToken(); 
    const response = await axios.post(`${API_BASE_URL}/customers`, customerData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

//Delete Customer
export const deleteCustomer = async (_id) => {
  try {
    const token = getAuthToken(); 
    const response = await axios.delete(`${API_BASE_URL}/customers/${_id}`,{
      headers: {
        Authorization: `Bearer ${token}`, // Send token in headers
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

//Fetch all Bankers
export const getBankers = async () => {
  try {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/bankers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bankers:", error.response?.data || error.message);
    throw error;
  }
};

//Add a new Banker
export const addBanker = async (bankerData) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/bankers`, bankerData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding banker:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a Banker
export const deleteBanker = async (bankerId) => {
  try {
    const token = getAuthToken();
    const response = await axios.delete(`${API_BASE_URL}/bankers/${bankerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting banker:", error.response?.data || error.message);
    throw error;
  }
};
//update user to banker


// Add role to user
export const addRole = async (email, role) => {
  try {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/addRole`, { email, role }, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding role:", error.response?.data || error.message);
    throw error;
  }
};

// Update a banker's role
// export const updateBankerRole = async (bankerId, newRole) => {
//   try {
//     const token = getAuthToken();
//     console.log("Sending request to update role:", newRole); // Add logging
//     const response = await axios.patch(
//       `${API_BASE_URL}/bankers/update-role/${bankerId}`,
//       { role: newRole },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error updating banker role:", error.response?.data || error.message);
  //   throw error;
  // }



