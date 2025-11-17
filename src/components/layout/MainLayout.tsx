import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'autoridad';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/incidents" className="text-lg font-bold text-secondary">
            AlertAUTEC
          </Link>

          <nav className="flex items-center gap-3">
            <NavLink
              to="/incidents"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 text-sm font-medium ${
                  isActive ? 'bg-primary text-white' : 'text-secondary/80 hover:bg-gray-100'
                }`
              }
            >
              Mis incidentes
            </NavLink>

            <NavLink
              to="/report"
              className={({ isActive }) =>
                `rounded-full px-3 py-1 text-sm font-medium ${
                  isActive ? 'bg-primary text-white' : 'text-secondary/80 hover:bg-gray-100'
                }`
              }
            >
              Reportar
            </NavLink>

            {/* 🔐 Botón solo para admin/autoridad */}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `rounded-full px-3 py-1 text-sm font-semibold ${
                    isActive
                      ? 'bg-secondary text-white'
                      : 'border border-secondary/40 text-secondary hover:bg-secondary hover:text-white'
                  }`
                }
              >
                Panel admin
              </NavLink>
            )}

            {user && (
              <button
                onClick={logout}
                className="rounded-full border px-3 py-1 text-xs font-medium text-secondary hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
