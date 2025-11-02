// Error Pages
import Unauthorized from '@/pages/errors/Unauthorized';
import Forbidden from '@/pages/errors/Forbidden';
import NotFound from '@/pages/errors/NotFound';
import InternalServerError from '@/pages/errors/InternalServerError';
import Maintenance from '@/pages/errors/Maintenance';

import ProtectedRoute from '@/components/auth/ProtectedRoute';

import Layout from '@/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import { createBrowserRouter, Navigate } from 'react-router';
import Login from '@/pages/auth/Login';

// Define router
const router = createBrowserRouter([
  {
    path: '/auth',
    children: [{ path: 'login', Component: Login }],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', Component: Dashboard },
      { path: 'dashboard/*', Component: Dashboard },
    ],
  },
  {
    path: '/unauthorized',
    Component: Unauthorized,
  },
  {
    path: '/forbidden',
    Component: Forbidden,
  },
  {
    path: '/server-error',
    Component: InternalServerError,
  },
  {
    path: '/maintenance',
    Component: Maintenance,
  },
  {
    path: '/404',
    Component: NotFound,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);

export default router;
