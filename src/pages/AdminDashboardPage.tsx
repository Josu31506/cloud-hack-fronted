import { useMemo, useState } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { useIncidents } from '../hooks/useIncidents';
import { IncidentStatus } from '../types/incident';

const statusOptions: (IncidentStatus | 'todos')[] = ['todos', 'pendiente', 'en_atencion', 'resuelto'];

export const AdminDashboardPage = () => {
  const { incidents, loading, updateStatus } = useIncidents();
  const [statusFilter, setStatusFilter] = useState<(typeof statusOptions)[number]>('todos');

  const filteredIncidents = useMemo(() => {
    if (statusFilter === 'todos') return incidents;
    return incidents.filter((incident) => incident.status === statusFilter);
  }, [incidents, statusFilter]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary">Panel de incidentes</h1>
          <p className="text-secondary/70">Gestiona todos los reportes del campus.</p>
        </div>
        <select
          className="rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as IncidentStatus | 'todos')}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="text-secondary">Actualizando información...</p>}

      <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-primary/10 text-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Tipo</th>
              <th className="px-4 py-3 text-left font-semibold">Ubicación</th>
              <th className="px-4 py-3 text-left font-semibold">Urgencia</th>
              <th className="px-4 py-3 text-left font-semibold">Estado</th>
              <th className="px-4 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredIncidents.map((incident) => (
              <tr key={incident.id} className="hover:bg-background">
                <td className="px-4 py-3 font-medium text-secondary">{incident.type}</td>
                <td className="px-4 py-3 text-secondary/80">{incident.location}</td>
                <td className="px-4 py-3 capitalize text-secondary/80">{incident.urgency}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={incident.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {(['pendiente', 'en_atencion', 'resuelto'] as IncidentStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(incident.id, status)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                          incident.status === status
                            ? 'border-primary bg-primary text-white'
                            : 'border-secondary/30 text-secondary'
                        }`}
                      >
                        {status.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
