import axios from 'axios';

const API = axios.create({
  // Use environment variable when possible, otherwise default to localhost:4000
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:4000/api',
});

// Add a request interceptor to include the auth token in headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
