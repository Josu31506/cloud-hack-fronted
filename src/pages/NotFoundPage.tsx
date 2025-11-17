import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background text-center">
    <h1 className="text-4xl font-bold text-secondary">404</h1>
    <p className="text-secondary/70">La página que buscas no existe.</p>
    <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-white">
      Volver al inicio
    </Link>
  </div>
);
