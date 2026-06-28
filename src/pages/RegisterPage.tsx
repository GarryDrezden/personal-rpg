import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { ApiError } from '../api/httpClient';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loginName, setLoginName] = useState('');
  const [password, setPassword] = useState('');
  const [repeat, setRepeat] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== repeat) {
      setError('Пароли не совпадают');
      return;
    }
    setSubmitting(true);
    try {
      await register(loginName.trim(), password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось создать аккаунт');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)]/80 p-8 shadow-xl backdrop-blur-md">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--app-gold)]">
          Личная RPG
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--app-text)]">
          Создать героя
        </h1>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          Начни новый путь — данные будут храниться в твоём аккаунте.
        </p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="text-sm text-[var(--app-text-muted)]">Логин</span>
            <input
              className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)] outline-none focus:border-[var(--app-gold)]"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--app-text-muted)]">Пароль</span>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)] outline-none focus:border-[var(--app-gold)]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>
          <label className="block">
            <span className="text-sm text-[var(--app-text-muted)]">Повтор пароля</span>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-2 text-[var(--app-text)] outline-none focus:border-[var(--app-gold)]"
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              autoComplete="new-password"
              required
              minLength={6}
            />
          </label>

          {error && (
            <p className="text-sm text-[var(--app-danger)]">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full rounded-lg px-4 py-2.5 font-semibold transition hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? 'Создаём…' : 'Создать героя'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[var(--app-text-muted)]">
          Уже есть путь?{' '}
          <Link to="/login" className="text-[var(--app-gold)] hover:underline">
            Вернуться в игру
          </Link>
        </p>
      </div>
    </div>
  );
}
