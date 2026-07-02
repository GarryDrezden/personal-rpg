import { Link } from 'react-router-dom';
import type { PlateauSnapshot } from '../../types/plateauV1';

type PlateauDashboardSummaryProps = {
  snapshot: PlateauSnapshot;
  onToggleManual: () => void;
};

export function PlateauDashboardSummary({
  snapshot,
  onToggleManual,
}: PlateauDashboardSummaryProps) {
  if (snapshot.mode === 'none' && !snapshot.hasWeightData) {
    return (
      <section
        data-testid="plateau-dashboard-summary"
        className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-card)]/60 px-4 py-3"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
          Перевал
        </p>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          Когда появятся замеры веса, игра сможет мягко подсказать режим удержания перевала.
        </p>
        <button
          type="button"
          onClick={onToggleManual}
          className="mt-2 text-xs font-semibold text-[var(--app-primary)] hover:underline"
        >
          Я на перевале
        </button>
      </section>
    );
  }

  if (snapshot.mode === 'none') return null;

  const rh = snapshot.routeHolding;

  return (
    <section
      data-testid="plateau-dashboard-summary"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
            {snapshot.mode === 'active' ? 'Удержание перевала' : 'Возможный перевал'}
          </p>
          <p className="mt-1 text-sm text-[var(--app-text)]">{snapshot.title}</p>
        </div>
        {snapshot.hasWeightData ? (
          <span className="text-xs text-[var(--app-text-muted)]">
            {snapshot.daysSinceBestWeight} дн. без лучшего веса
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xs text-[var(--app-text-muted)]">
        Перевал удерживается: {rh.routeHeldDays} дней маршрута за последние {rh.windowDays}.
      </p>
      <p className="mt-1 text-xs text-[var(--app-text-muted)]">{snapshot.supportiveLine}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onToggleManual}
          className="text-xs font-semibold text-[var(--app-primary)] hover:underline"
        >
          {snapshot.manualActive ? 'Снять отметку перевала' : 'Я на перевале'}
        </button>
        <Link to="/growth/abilities" className="text-xs text-[var(--app-primary)] hover:underline">
          Способности тела
        </Link>
      </div>
    </section>
  );
}
