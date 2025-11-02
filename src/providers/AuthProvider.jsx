// providers/AuthProvider.jsx
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export const AuthProvider = ({ children }) => {
  const { verifyToken, isLoading, clearLoading } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await verifyToken();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        clearLoading();
      }
    };

    initializeAuth();
  }, [verifyToken, clearLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing system...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
