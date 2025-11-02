// stores/authStore.js
import { api } from '@/services/authService';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,

      // Actions
      login: async (email, password) => {
        try {
          const response = await api.login(email, password);
          set({
            user: response?.user ?? response,
            isAuthenticated: true,
            isLoading: false,
            isAdmin: false, // Always start in normal mode
          });
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await api.logout();
        } catch (_) {
          // ignore logout errors and still clear locally
        }
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          isAdmin: false,
        });
      },

      switchToAdminMode: async (code) => {
        try {
          await api.verifyAdminCode(code);
          set({ isAdmin: true });
          return true;
        } catch (error) {
          return false;
        }
      },

      switchToNormalMode: () => {
        set({ isAdmin: false });
      },

      updateAdminCode: async (newCode) => {
        await api.changeAdminCode(newCode);
        return true;
      },

      updatePassword: async (newPassword) => {
        try {
          await api.changePassword(newPassword);
          return true;
        } catch (error) {
          throw error;
        }
      },

      forgotPassword: async (email) => {
        try {
          const res = await api.requestOTP(email);
          return res;
        } catch (error) {
          throw error;
        }
      },

      resetPasswordWithOTP: async (email, otp, newPassword) => {
        try {
          await api.resetPassword(email, otp, newPassword);
          return true;
        } catch (error) {
          throw error;
        }
      },

      verifyToken: async () => {
        try {
          const userData = await api.getCurrentUser();
          set({
            user: userData?.user ?? userData,
            isAuthenticated: true,
            isLoading: false,
            isAdmin: false, // Reset to normal mode on refresh
          });
          return true;
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            isAdmin: false,
          });
          return false;
        }
      },

      clearLoading: () => set({ isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
