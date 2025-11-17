import { useCallback, useEffect, useState } from 'react';
import {
  getIncidents as apiGetIncidents,
  createIncident as apiCreateIncident,
  updateIncidentStatus as apiUpdateIncidentStatus,
} from '../services/incidentService';
import { Incident, IncidentStatus, NewIncidentPayload } from '../types/incident';

type Options = { autoFetch?: boolean };

export const useIncidents = ({ autoFetch = true }: Options = {}) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGetIncidents();
      setIncidents(data);
    } catch (e: any) {
      setError(e.message ?? 'Error al cargar incidentes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchIncidents();
    }
  }, [autoFetch, fetchIncidents]);

  const create = useCallback(
    async (payload: NewIncidentPayload) => {
      await apiCreateIncident(payload);
      await fetchIncidents(); // recarga lista con el nuevo incidente
    },
    [fetchIncidents]
  );

  const updateStatus = useCallback(
    async (id: string, status: IncidentStatus) => {
      await apiUpdateIncidentStatus(id, status);
      await fetchIncidents(); // recarga lista con el estado actualizado
    },
    [fetchIncidents]
  );

  return { incidents, loading, error, create, updateStatus, refresh: fetchIncidents };
};
