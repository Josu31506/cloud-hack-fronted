import axios from 'axios';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
});

client.interceptors.request.use((config) => {
  // TODO: Adjuntar token de autenticación cuando esté disponible
  return config;
});

export default client;
