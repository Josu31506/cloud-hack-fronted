import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinkBase =
  'flex items-center rounded-lg px-4 py-2 text-sm font-medium transition hover:bg-primary/10';

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-white shadow-lg transition-transform md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <nav className="flex h-full flex-col space-y-2 px-4 py-6">
        <NavLink
          to="/report"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? 'bg-primary text-white' : 'text-secondary'}`
          }
          onClick={onClose}
        >
          Reportar incidente
        </NavLink>
        <NavLink
          to="/incidents"
          className={({ isActive }) =>
            `${navLinkBase} ${isActive ? 'bg-primary text-white' : 'text-secondary'}`
          }
          onClick={onClose}
        >
          Mis incidentes
        </NavLink>
        {user?.role === 'autoridad' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${navLinkBase} ${isActive ? 'bg-secondary text-white' : 'text-secondary'}`
            }
            onClick={onClose}
          >
            Panel admin
          </NavLink>
        )}
      </nav>
    </aside>
  );
};
