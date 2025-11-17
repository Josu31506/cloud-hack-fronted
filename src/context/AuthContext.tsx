// src/context/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { User } from '../types/user';
import {
  clearSession,
  getCurrentUser,
  loginApi,
  RegisterPayload,
  registerApi,
  saveSession,
} from '../services/authService';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerAndLogin: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await loginApi({ email, password });
    saveSession(user, token);
    setUser(user);
  }, []);

  const registerAndLogin = useCallback(async (payload: RegisterPayload) => {
    await registerApi(payload);
    const { user, token } = await loginApi({
      email: payload.email,
      password: payload.password,
    });
    saveSession(user, token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      registerAndLogin,
      logout,
    }),
    [user, loading, login, registerAndLogin, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
