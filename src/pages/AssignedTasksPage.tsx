import { useMemo } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../hooks/useAuth';
import { useIncidents } from '../hooks/useIncidents';

export const AssignedTasksPage = () => {
  const { user } = useAuth();
  const { incidents, loading } = useIncidents();

  const authorityTeams = useMemo(() => {
    if (user?.role !== 'autoridad') return [];
    return ['Seguridad']; // TODO: reemplazar con equipos reales desde el backend/perfil
  }, [user]);

  const assignedIncidents = useMemo(
    () =>
      incidents.filter((incident) => {
        const byPerson = incident.assignedTo && incident.assignedTo === user?.name;
        const byTeam = incident.assignedTeam && authorityTeams.includes(incident.assignedTeam);
        return byPerson || byTeam;
      }),
    [authorityTeams, incidents, user?.name]
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Tareas asignadas</h1>
        <p className="text-secondary/70">Incidentes derivados a tu equipo o a ti.</p>
      </div>

      {loading && <p className="text-secondary">Sincronizando incidentes asignados...</p>}

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-primary/10 text-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
              <th className="px-4 py-3 text-left font-semibold">Urgencia</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Equipo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {assignedIncidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-background">
                <td className="px-4 py-3 font-medium text-secondary">{incident.type}</td>
                <td className="px-4 py-3 text-secondary/80">{incident.location}</td>
                <td className="px-4 py-3 capitalize text-secondary/80">{incident.urgency}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={incident.status} />
                </td>
                <td className="px-4 py-3 text-secondary/80">{incident.assignedTeam ?? 'Sin asignar'}</td>
              </tr>
            ))}
            {!assignedIncidents.length && !loading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-secondary/70">
                  No tienes incidentes asignados por ahora. {/* TODO: mostrar datos reales desde backend */}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
