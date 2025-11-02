import axios from 'axios';
import TokenService from '@/services/token.service';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosSecure = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 🔹 Request Interceptor
axiosSecure.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for login
    if (originalRequest.url.includes('/auth/signin')) {
      return Promise.reject(error);
    }

    // Token expired → try refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const refreshResponse = await axiosSecure.post('/auth/refreshtoken');

        const { accessToken } = refreshResponse.data;
        if (accessToken) {
          // Update access token in session storage
          TokenService.updateAccessToken(accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosSecure(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosSecure;
