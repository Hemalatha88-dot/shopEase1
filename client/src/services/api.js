import axios from 'axios';

// Prefer explicit env; otherwise, build from current host so mobile devices don't hit "localhost"
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: false,
});

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default api; 