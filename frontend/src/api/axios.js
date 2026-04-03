import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5001/api', // Match your backend port
});

// This is the MAGIC part: it attaches your token to every call
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;