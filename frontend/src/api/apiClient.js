import axios from 'axios';

// Base URL for the backend API
const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Create an Axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

export default apiClient;