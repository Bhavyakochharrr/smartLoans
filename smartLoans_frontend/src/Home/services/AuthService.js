import axios from "axios";

const API_URL = "http://localhost:4001/api/users";

// Function to get token from localStorage
const getToken = () => sessionStorage.getItem("token");

// Axios instance with Authorization header
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Login API
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post("/signin", { email, password });
    return response.data; // Expected response: { token }
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

// Get user details from backend after login
export const fetchCurrentUser = async () => {
  try {
    const response = await apiClient.get("/current");
    console.log("response",response);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
