import axios from 'axios';

const BASE = 'http://localhost:5001/api';

// Auth
export const registerUser = (data) => axios.post(`${BASE}/auth/register`, data);
export const loginUser = (data) => axios.post(`${BASE}/auth/login`, data);
export const googleLoginUser = (data) => axios.post(`${BASE}/auth/google`, data);

// User Profile Update
export const updateUser = (userId, data) => axios.put(`${BASE}/users/${userId}`, data);

export const sendChat = (data) => axios.post(`${BASE}/chat`, data);

export const getTasks = (userId) => axios.get(`${BASE}/tasks/${userId}`);

export const updateTask = (userId, taskIndex, status, notes) =>
    axios.put(`${BASE}/tasks/${userId}`, { taskIndex, status, notes });

export const generateDocument = (type, userData) =>
    axios.post(`${BASE}/documents/generate`, { type, ...userData }, { responseType: 'blob' });

export const getChatHistory = (userId) => axios.get(`${BASE}/chat/${userId}`);
