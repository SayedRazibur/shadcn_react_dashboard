import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const handle = async (promise) => {
  try {
    const res = await promise;
    return res.data;
  } catch (err) {
    const message =
      err?.response?.data?.message || err?.message || 'Something went wrong';
    throw new Error(message);
  }
};

export const api = {
  // Auth endpoints
  login: (email, password) =>
    handle(client.post('/auth/login', { email, password })),
  verifyAdminCode: (adminCode) =>
    handle(client.post('/auth/verify-admin-code', { adminCode })),
  requestOTP: (email) => handle(client.post('/auth/request-otp', { email })),
  resetPassword: (email, otp, newPassword) =>
    handle(client.post('/auth/reset-password', { email, otp, newPassword })),
  logout: () => handle(client.post('/auth/logout')),
  getCurrentUser: () => handle(client.get('/auth/me')),

  // Admin endpoints
  changePassword: (newPassword) =>
    handle(client.post('/admin/change-password', { newPassword })),
  changeAdminCode: (newAdminCode) =>
    handle(client.post('/admin/change-admin-code', { newAdminCode })),
  getActivityLogs: () => handle(client.get('/admin/logs')),

  // Products endpoints
  getProducts: () => handle(client.get('/products')),
  createProduct: (productData) => handle(client.post('/products', productData)),
  updateProduct: (id, productData) =>
    handle(client.put(`/products/${id}`, productData)),
  deleteProduct: (id) => handle(client.delete(`/products/${id}`)),
};
