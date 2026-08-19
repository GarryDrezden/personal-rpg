import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };

type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[AppErrorBoundary]', error, info.componentStack);
    }
  }

  render(): ReactNode {
    if (!this.state.error) return this.props.children;

    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[var(--app-bg,#0e0c14)] px-4 text-[var(--app-text,#f5f0e8)]"
        role="alert"
      >
        <div className="max-w-md space-y-4 rounded-2xl border border-[var(--app-border,rgba(255,255,255,0.12))] bg-[var(--app-card,#16131c)] p-6 shadow-lg">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-text-muted,#a89fb3)]">
            Маршрут прервался
          </p>
          <h1 className="text-xl font-semibold">Не удалось показать этот экран</h1>
          <p className="text-sm leading-relaxed text-[var(--app-text-muted,#a89fb3)]">
            Данные не удалены. Обновите страницу — если ошибка повторится, откройте Главную или
            Сегодня.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full bg-[var(--app-primary,#c9a227)] px-4 py-2 text-sm font-semibold text-[#1a1408]"
              onClick={() => window.location.reload()}
            >
              Обновить
            </button>
            <a
              href="/"
              className="rounded-full border border-[var(--app-border,rgba(255,255,255,0.16))] px-4 py-2 text-sm font-medium"
            >
              На главную
            </a>
          </div>
        </div>
      </div>
    );
  }
}
