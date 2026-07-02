import type { PlateauResult } from '../../types/plateau';
import { Card } from '../ui/Card';

type PlateauCardProps = {
  result: PlateauResult;
};

export function PlateauCard({ result }: PlateauCardProps) {
  if (result.status === 'none') return null;

  const isStrongActive = result.status === 'plateau_but_system_active';
  const isSoftHint = result.status === 'possible_plateau';

  return (
    <Card
      className={
        isStrongActive
          ? 'border-[color-mix(in_srgb,var(--app-success)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-success)_8%,var(--app-card))]'
          : isSoftHint
            ? 'border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/35'
            : 'border-[color-mix(in_srgb,var(--app-secondary)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]'
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
        Удержание перевала
      </p>
      <h2 className="mt-2 text-lg font-bold text-[var(--app-text)]">{result.title}</h2>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{result.description}</p>

      {result.positiveSignals.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            {isStrongActive ? 'Система держится' : 'Сигналы'}
          </p>
          <ul className="space-y-1 text-sm text-[var(--app-text)]">
            {result.positiveSignals.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-emerald-500">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {result.suggestions.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            {isStrongActive ? 'Что дальше' : 'Мягкие шаги'}
          </p>
          <ul className="space-y-1 text-sm text-[var(--app-text-muted)]">
            {result.suggestions.map((s) => (
              <li key={s} className="flex gap-2">
                <span>→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-3 text-xs text-[var(--app-text-muted)]">
        Дней без нового лучшего веса: {result.daysChecked}
      </p>
    </Card>
  );
}
