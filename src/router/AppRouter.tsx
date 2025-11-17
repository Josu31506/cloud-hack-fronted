import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AdminRoute } from '../components/AdminRoute';
import { MainLayout } from '../components/layout/MainLayout';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { IncidentsListPage } from '../pages/IncidentsListPage';
import { IncidentDetailPage } from '../pages/IncidentDetailPage';
import { ReportIncidentPage } from '../pages/ReportIncidentPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRouter = () => (
  <Routes>
    {/* Redirect raíz → incidents (lo protegerá ProtectedRoute) */}
    <Route path="/" element={<Navigate to="/incidents" replace />} />

    {/* Rutas públicas */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Rutas protegidas (requieren sesión) */}
    <Route element={<ProtectedRoute />}>
      <Route element={<MainLayout />}>
        <Route path="/incidents" element={<IncidentsListPage />} />
        <Route path="/incidents/:id" element={<IncidentDetailPage />} />
        <Route path="/report" element={<ReportIncidentPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
      </Route>
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
