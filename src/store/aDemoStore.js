import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

const baseUrlApi = import.meta.env.VITE_BASE_URL_API;

// Create an axios instance
const api = axios.create({
  baseURL: baseUrlApi,
  withCredentials: true,
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      // --- Auth actions ---
      setUser: (userData) =>
        set({ user: userData.user, token: userData.token }),
      logout: () => {
        set({ user: null, token: null });
      },

      // --- Initialize Axios interceptors ---
      initAxiosInterceptors: () => {
        const { token, refreshAccessToken, logout } = get();

        // Request interceptor: attach token
        api.interceptors.request.use(
          (config) => {
            const authToken = get().token;
            if (authToken) {
              config.headers.Authorization = authToken;
            }
            return config;
          },
          (error) => Promise.reject(error)
        );

        // Response interceptor: handle 401s
        api.interceptors.response.use(
          (response) => response,
          async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
              originalRequest._retry = true;
              const success = await refreshAccessToken();
              if (success) {
                // retry with new token
                originalRequest.headers.Authorization = get().token;
                return api(originalRequest);
              } else {
                logout();
              }
            }

            return Promise.reject(error);
          }
        );
      },

      // --- Refresh token logic ---
      refreshAccessToken: async () => {
        try {
          const res = await axios.post(
            `${baseUrlApi}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const data = res.data;
          if (data?.data?.accessToken) {
            set({
              token: data.data.accessToken,
              user: get().user,
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to refresh access token:', error);
          return false;
        }
      },

      // --- Generic request function for API calls ---
      apiRequest: async (config) => {
        const response = await api(config);
        return response.data;
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);

// export the axios instance if you want to use it directly
export { api };
