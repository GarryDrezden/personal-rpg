import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
      <div className="max-w-sm rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-8 py-10 text-center backdrop-blur-md">
        <p className="text-sm uppercase tracking-[0.2em] text-[var(--app-gold)]">
          Личная RPG
        </p>
        <p className="mt-3 text-[var(--app-text-muted)]">Пробуждаем героя…</p>
      </div>
    </div>
  );
}

export function ProtectedRoute() {
  const { authenticated, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (!authenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function GuestRoute() {
  const { authenticated, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (authenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}
