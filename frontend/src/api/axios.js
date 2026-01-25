import axios from 'axios';

const API = axios.create({
  // Use IPv4 loopback to avoid macOS resolving localhost to AirPlay/::1; backend runs on port 4000
  baseURL: 'http://127.0.0.1:4000/api',
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
