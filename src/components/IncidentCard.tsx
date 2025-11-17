import { Incident } from '../types/incident';
import { StatusBadge } from './StatusBadge';

interface IncidentCardProps {
  incident: Incident;
  onClick?: () => void;
}

export const IncidentCard = ({ incident, onClick }: IncidentCardProps) => (
  <article
    className="flex cursor-pointer flex-col gap-2 rounded-lg border bg-white p-4 shadow-sm transition hover:shadow-md"
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-secondary">{incident.type}</h3>
      <StatusBadge status={incident.status} />
    </div>
    <p className="text-sm text-secondary/80">{incident.location}</p>
    <p className="text-sm text-secondary/70">
      {incident.description.length > 120
        ? `${incident.description.substring(0, 117)}...`
        : incident.description}
    </p>
    <div className="flex items-center justify-between text-xs text-secondary/70">
      <span>Urgencia: {incident.urgency}</span>
      <span>Reportado por: {incident.createdBy}</span>
    </div>
  </article>
);
