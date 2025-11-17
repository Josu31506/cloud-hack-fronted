// src/services/incidentService.ts
import {
  Incident,
  IncidentStatus,
  IncidentUrgency,
  NewIncidentPayload,
} from '../types/incident';
import { getToken } from './authService';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

/**
 * Pequeño wrapper para llamar a la API y parsear la respuesta
 */
async function apiFetch(path: string, options: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    console.error('API error', res.status, data);
    throw new Error(data?.error || data?.message || data || `HTTP ${res.status}`);
  }

  return data;
}

/**
 * Normaliza el payload típico de Lambda proxy:
 * - Puede venir como string
 * - O como { statusCode, body }
 * - body a su vez puede ser string o ya objeto
 */
function normalizeLambdaPayload(data: any): any {
  let payload: any = data;

  // Si es string, intentar parsear
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      /* ignore */
    }
  }

  // Si viene como { body: ... }
  if (payload && typeof payload === 'object' && 'body' in payload) {
    let inner: any = (payload as any).body;
    if (typeof inner === 'string') {
      try {
        inner = JSON.parse(inner);
      } catch {
        /* ignore */
      }
    }
    payload = inner;
  }

  return payload;
}

/**
 * Mapea un item de DynamoDB (create_incident / history) al tipo Incident del frontend
 */
function mapDynamoItemToIncident(item: any): Incident {
  const fase = item.fase ?? 'pendiente';

  let status: IncidentStatus;
  if (fase === 'en_proceso') status = 'en_atencion';
  else if (fase === 'resuelta') status = 'resuelto';
  else status = 'pendiente';

  const urgencyRaw = (item.urgencia ?? 'media') as IncidentUrgency;

  const createdBy =
    item.reportado_por_nombre ??
    item.reportado_por ??
    item.createdBy ??
    'desconocido';

  return {
    id: item.incidente_id ?? item.id ?? crypto.randomUUID(),
    type: item.tipo_incidencia ?? item.type ?? 'Incidente',
    location: item.ubicacion ?? item.location ?? 'Sin ubicación',
    description: item.descripcion ?? item.description ?? '',
    urgency: urgencyRaw,
    status,
    createdAt: item.fecha_creacion ?? new Date().toISOString(),
    updatedAt: item.fecha_actualizacion ?? undefined,
    createdBy,
    role: (item.role as Incident['role']) ?? 'estudiante',
    assignedTeam: item.assignedTeam ?? undefined,
    assignedTo: item.assignedTo ?? undefined,
  };
}

/**
 * Obtener todas las incidencias desde la Lambda /incidents/history
 */
export const getIncidents = async (): Promise<Incident[]> => {
  const token = getToken();

  const rawData = await apiFetch('/incidents/history', {
    method: 'GET',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const payload = normalizeLambdaPayload(rawData);

  let items: any[] = [];
  if (Array.isArray(payload)) items = payload;
  else if (Array.isArray(payload?.items)) items = payload.items;

  console.log('Incidents from API', items);

  return items.map(mapDynamoItemToIncident);
};

/**
 * Obtener una incidencia por id (se filtra en memoria sobre la lista de incidencias)
 */
export const getIncidentById = async (id: string): Promise<Incident | null> => {
  const incidents = await getIncidents();
  return incidents.find((i) => i.id === id) ?? null;
};

/**
 * Crear incidencia llamando a la Lambda /incidents/create
 */
export const createIncident = async (
  payload: NewIncidentPayload,
  createdBy: string,
  role: Incident['role']
): Promise<Incident> => {
  const token = getToken();
  if (!token) throw new Error('No hay token de sesión');

  // Body que espera tu Lambda create_incident
  const body = {
    descripcion: payload.description,
    tipo_incidencia: payload.type,
    ubicacion: payload.location,
    urgencia: payload.urgency,
    gravedad: payload.urgency,
    reportado_por_nombre: createdBy, // se guarda en Dynamo
    role,
  };

  const rawData = await apiFetch('/incidents/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const payloadNorm = normalizeLambdaPayload(rawData);

  // La Lambda idealmente devuelve { message, incidente_id, item }
  const incidenteId: string | undefined = payloadNorm?.incidente_id;
  const itemFromApi = payloadNorm?.item;

  if (itemFromApi) {
    // Mapeamos el item real guardado en Dynamo
    return mapDynamoItemToIncident(itemFromApi);
  }

  // Fallback: si por alguna razón no envías "item" en la respuesta,
  // devolvemos un incidente construido con la data que tenemos.
  const newIncident: Incident = {
    id: incidenteId ?? crypto.randomUUID(),
    type: payload.type,
    location: payload.location,
    description: payload.description,
    urgency: payload.urgency,
    status: 'pendiente',
    createdAt: new Date().toISOString(),
    createdBy,
    role,
  };

  return newIncident;
};

/**
 * Actualizar estado de una incidencia llamando a /incidents/update
 */
export const updateIncidentStatus = async (
  id: string,
  status: IncidentStatus
): Promise<{ id: string; status: IncidentStatus }> => {
  const token = getToken();
  if (!token) throw new Error('No hay token de sesión');

  const fase =
    status === 'pendiente'
      ? 'pendiente'
      : status === 'en_atencion'
      ? 'en_proceso'
      : 'resuelta';

  await apiFetch('/incidents/update', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      incidente_id: id,
      fase,
    }),
  });

  return { id, status };
};
