import { IncidentStatus } from '../types/incident';

export const INCIDENT_STATUS_STYLES: Record<IncidentStatus, string> = {
  pendiente: 'bg-pending text-secondary',
  en_atencion: 'bg-inprogress text-secondary',
  resuelto: 'bg-resolved text-secondary',
};
