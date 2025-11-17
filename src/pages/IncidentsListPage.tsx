import { Link } from 'react-router-dom';
import { IncidentCard } from '../components/IncidentCard';
import { useIncidents } from '../hooks/useIncidents';
import { useAuth } from '../hooks/useAuth';

export const IncidentsListPage = () => {
  const { incidents, loading, error } = useIncidents();
  const { user } = useAuth();
  const isAdmin = user?.role === 'autoridad';

  return (
    <section className="space-y-6 w-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Mis incidentes</h1>
          <p className="text-secondary/70">Revisa el estado de los reportes enviados.</p>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary/90"
          >
            Ir al panel admin
          </Link>
        )}
      </div>

      {loading && <p className="text-secondary">Cargando incidentes...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {incidents.map((incident) => (
          <Link key={incident.id} to={`/incidents/${incident.id}`}>
            <IncidentCard incident={incident} />
          </Link>
        ))}
      </div>
    </section>
  );
};
