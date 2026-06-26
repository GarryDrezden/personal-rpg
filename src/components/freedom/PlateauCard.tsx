import type { PlateauResult } from '../../types/plateau';
import { Card } from '../ui/Card';

type PlateauCardProps = {
  result: PlateauResult;
};

export function PlateauCard({ result }: PlateauCardProps) {
  if (result.status === 'none') return null;

  const isActive = result.status === 'plateau_but_system_active';

  return (
    <Card
      className={
        isActive
          ? 'border-[color-mix(in_srgb,var(--app-success)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-success)_8%,var(--app-card))]'
          : 'border-[color-mix(in_srgb,var(--app-secondary)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-secondary)_8%,var(--app-card))]'
      }
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
        Плато-режим
      </p>
      <h2 className="mt-2 text-lg font-bold text-[var(--app-text)]">{result.title}</h2>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{result.description}</p>

      {result.positiveSignals.length > 0 ? (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            {isActive ? 'Система держится' : 'Сигналы'}
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
            {isActive ? 'Что дальше' : 'Мягкие шаги'}
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
        За {result.daysChecked} дней вес изменился на{' '}
        {result.weightChangeKg >= 0 ? '+' : ''}
        {result.weightChangeKg.toFixed(1)} кг
      </p>
    </Card>
  );
}
