import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const useAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      token: null,
      adminCode: '',

      login: (userData, token) =>
        set({
          isAuthenticated: true,
          user: userData,
          token: token,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          token: null,
        }),

      setAdminMode: (code) =>
        set({
          isAdmin: true,
          adminCode: code,
        }),

      exitAdminMode: () =>
        set({
          isAdmin: false,
          adminCode: '',
        }),
    }),
    {
      name: 'auth-storage',
      storage: isLocalStorageAvailable() ? localStorage : sessionStorage,
    }
  )
);
