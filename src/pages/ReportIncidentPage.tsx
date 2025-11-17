import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useIncidents } from '../hooks/useIncidents';
import { IncidentUrgency } from '../types/incident';

const urgencyOptions: IncidentUrgency[] = ['baja', 'media', 'alta'];

export const ReportIncidentPage = () => {
  const { user } = useAuth();
  const { create, loading } = useIncidents({ autoFetch: false });
  const [formState, setFormState] = useState({
    type: '',
    location: '',
    description: '',
    urgency: 'media' as IncidentUrgency,
  });
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  if (!user) return;
  setFeedback(null);
  try {
    await create(formState, user.name, user.role);
    setFeedback('Incidente reportado correctamente ✅');
    setFormState({ type: '', location: '', description: '', urgency: 'media' });
  } catch (e: any) {
    console.error(e);
    setFeedback(e?.message ?? 'Error al reportar el incidente');
  }
};

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary">Reportar incidente</h1>
        <p className="text-secondary/70">Describe el incidente para que el equipo pueda atenderlo.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Tipo</label>
            <input
              className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
              value={formState.type}
              onChange={(e) => setFormState((prev) => ({ ...prev, type: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">Ubicación</label>
            <input
              className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
              value={formState.location}
              onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Descripción</label>
          <textarea
            className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
            rows={4}
            value={formState.description}
            onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-secondary">Urgencia</label>
          <select
            className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
            value={formState.urgency}
            onChange={(e) => setFormState((prev) => ({ ...prev, urgency: e.target.value as IncidentUrgency }))}
          >
            {urgencyOptions.map((urgency) => (
              <option key={urgency} value={urgency}>
                {urgency}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark"
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar reporte'}
        </button>
        {feedback && <p className="text-sm text-secondary/70">{feedback}</p>}
      </form>
    </section>
  );
};
