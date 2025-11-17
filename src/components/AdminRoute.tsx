import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-6 text-secondary">Cargando sesión...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'autoridad') {
    return <Navigate to="/incidents" replace />;
  }

  return <Outlet />;
};
