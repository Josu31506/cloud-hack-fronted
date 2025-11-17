import { INCIDENT_STATUS_STYLES } from '../constants/statusStyles';
import { IncidentStatus } from '../types/incident';

export const StatusBadge = ({ status }: { status: IncidentStatus }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${INCIDENT_STATUS_STYLES[status]}`}>
    {status.replace('_', ' ')}
  </span>
);
