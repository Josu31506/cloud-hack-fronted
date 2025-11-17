import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getIncidentById } from '../services/incidentService';
import { Incident } from '../types/incident';
import { StatusBadge } from '../components/StatusBadge';

export const IncidentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getIncidentById(id);
      setIncident(data);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-secondary">Cargando...</p>;
  if (!incident)
    return (
      <div className="space-y-4">
        <p className="text-secondary">Incidente no encontrado.</p>
        <button className="text-primary underline" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );

  return (
    <section className="space-y-6">
      <button className="text-primary underline" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary">{incident.type}</h1>
            <p className="text-secondary/70">Ubicación: {incident.location}</p>
          </div>
          <StatusBadge status={incident.status} />
        </div>
        <p className="mt-4 text-secondary/80">{incident.description}</p>
        <div className="mt-4 grid gap-2 text-sm text-secondary/70 md:grid-cols-2">
          <span>Urgencia: {incident.urgency}</span>
          <span>Reportado por: {incident.createdBy}</span>
          <span>Creado: {new Date(incident.createdAt).toLocaleString()}</span>
          {incident.updatedAt && <span>Actualizado: {new Date(incident.updatedAt).toLocaleString()}</span>}
        </div>
      </div>
    </section>
  );
};
