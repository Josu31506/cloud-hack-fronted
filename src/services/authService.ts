// src/services/authService.ts
import { User, UserRole } from '../types/user';

const API_BASE = import.meta.env.VITE_API_URL ?? '';
const USER_KEY = 'alertautec_user';
const TOKEN_KEY = 'alertautec_token';

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

export type RegisterPayload = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  role: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const registerApi = async (payload: RegisterPayload): Promise<void> => {
  const { nombre, apellido, email, password, role } = payload;

  await apiFetch('/users/register', {
    method: 'POST',
    body: JSON.stringify({
      tenant_id: email,
      password,
      role,
      nombre,
      apellido,
    }),
  });
};

// Esperamos que el lambda login devuelva algo así:
// { message, token, role, user_id, tenant_id, nombre, apellido }
export const loginApi = async (
  payload: LoginPayload
): Promise<{ user: User; token: string }> => {
  const { email, password } = payload;

  const data = await apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({
      tenant_id: email,
      password,
    }),
  });

  const fullName =
    data?.nombre && data?.apellido
      ? `${data.nombre} ${data.apellido}`
      : data?.nombre || email;

  const user: User = {
    id: data.user_id ?? crypto.randomUUID(),
    name: fullName,
    email: data.tenant_id ?? email,
    role: (data.role ?? 'estudiante') as UserRole,
  };

  return { user, token: data.token };
};

export const saveSession = (user: User, token: string) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

export const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearSession = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};
