// src/pages/RegisterPage.tsx
import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { UserRole } from '../types/user';
import { LogoUTEC } from '../components/LogoUTEC';

const roles: UserRole[] = ['estudiante', 'staff', 'autoridad'];

export const RegisterPage = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('estudiante');
  const [error, setError] = useState<string | null>(null);
  const { registerAndLogin } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    try {
      await registerAndLogin({ nombre, apellido, email, password, role });
      // 👇 después de registrarse, va directo a reportar incidente
      navigate('/report');
    } catch (err: any) {
      setError(err.message ?? 'Error al registrarse');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <LogoUTEC />
          <p className="mt-4 text-secondary/80">
            Regístrate para comenzar a reportar incidentes en UTEC.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary">
                Nombre
              </label>
              <input
                className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-secondary">
                Apellido
              </label>
              <input
                className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Correo institucional
            </label>
            <input
              className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div>
            <label className="mb-1 block text-sm font-medium text-secondary">
              Rol
            </label>
            <select
              className="w-full rounded-lg border px-3 py-2 focus:border-primary focus:outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 text-white transition hover:bg-primary-dark"
          >
            Registrarme
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-secondary/70">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
