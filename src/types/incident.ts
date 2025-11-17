export type IncidentStatus = 'pendiente' | 'en_atencion' | 'resuelto';

export type IncidentUrgency = 'baja' | 'media' | 'alta';

export interface Incident {
  id: string;
  type: string;
  location: string;
  description: string;
  urgency: IncidentUrgency;
  status: IncidentStatus;
  createdAt: string;
  updatedAt?: string;
  createdBy: string;
  role: 'estudiante' | 'staff' | 'autoridad';
}

export interface NewIncidentPayload {
  type: string;
  location: string;
  description: string;
  urgency: IncidentUrgency;
}
