import { useAuth } from '../../hooks/useAuth';
import { LogoUTEC } from '../LogoUTEC';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          className="md:hidden rounded-lg border border-primary px-2 py-1 text-primary"
          onClick={onToggleSidebar}
          aria-label="Abrir menú"
        >
          ☰
        </button>
        <LogoUTEC />
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-semibold text-secondary">{user?.name ?? 'Invitado'}</p>
          <p className="text-xs uppercase tracking-wide text-primary">{user?.role ?? 'sin rol'}</p>
        </div>
        {user && (
          <button
            onClick={logout}
            className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-white transition hover:bg-secondary/90"
          >
            Cerrar sesión
          </button>
        )}
      </div>
    </header>
  );
};
