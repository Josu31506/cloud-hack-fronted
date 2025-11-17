// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adjunta automáticamente el token a todas las requests
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('alertautec_user');
  if (raw) {
    try {
      const user = JSON.parse(raw) as { token?: string };
      if (user.token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // ignore
    }
  }
  return config;
});
