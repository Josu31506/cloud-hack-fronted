// src/pages/LoginPage.tsx
import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { LogoUTEC } from '../components/LogoUTEC';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/incidents'); // o /report si quieres
    } catch (err: any) {
      setError(err.message ?? 'Error al iniciar sesión');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <LogoUTEC />
          <p className="mt-4 text-secondary/80">
            Inicia sesión para gestionar tus reportes en UTEC.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Correo institucional
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tucorreo@utec.edu.pe"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Contraseña
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 text-white transition hover:bg-primary-dark"
          >
            Ingresar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-secondary/70">
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" className="text-primary underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
};
