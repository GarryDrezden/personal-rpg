import type { PlateauSnapshot } from '../../types/plateauV1';
import { Card } from '../ui/Card';

type PlateauTodayCardProps = {
  snapshot: PlateauSnapshot;
  saving?: boolean;
  onEnableMinimal: () => void;
  onMarkPlateau: () => void;
  onClearPlateau: () => void;
  onDismissHint: () => void;
};

export function PlateauTodayCard({
  snapshot,
  saving = false,
  onEnableMinimal,
  onMarkPlateau,
  onClearPlateau,
  onDismissHint,
}: PlateauTodayCardProps) {
  if (snapshot.mode === 'none') return null;

  const isActive = snapshot.mode === 'active';
  const isSoftHint = snapshot.mode === 'soft_hint';

  if (isSoftHint) {
    return (
      <Card
        data-testid="plateau-today-card"
        className="border-[var(--app-gold)]/20 bg-[var(--app-primary-soft)]/25 px-4 py-3"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-gold)]">
          Возможный перевал
        </p>
        <p className="mt-1 text-sm text-[var(--app-text)]">{snapshot.title}</p>
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">{snapshot.supportiveLine}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={onMarkPlateau}
            className="rounded-lg bg-[var(--app-primary)] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
          >
            Я на перевале
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onDismissHint}
            className="text-xs text-[var(--app-text-muted)] hover:underline disabled:opacity-50"
          >
            Скрыть подсказку
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      data-testid="plateau-today-card"
      className="border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/35"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-gold)]">
        {isActive ? 'Удержание перевала' : 'Возможный перевал'}
      </p>
      <h2 className="mt-1 text-base font-semibold text-[var(--app-text)]">{snapshot.title}</h2>
      <p className="mt-1 text-sm text-[var(--app-text-muted)]">{snapshot.description}</p>
      <p className="mt-2 text-sm text-[var(--app-text)]">{snapshot.supportiveLine}</p>

      {snapshot.routeHolding.signalLines.length > 0 ? (
        <ul className="mt-3 space-y-1 text-xs text-[var(--app-text-muted)]">
          {snapshot.routeHolding.signalLines.map((line) => (
            <li key={line}>· {line}</li>
          ))}
        </ul>
      ) : null}

      <p className="mt-2 text-xs text-[var(--app-text-muted)]">
        {snapshot.hasWeightData
          ? `Дней без нового лучшего веса: ${snapshot.daysSinceBestWeight}`
          : 'Отметь перевал вручную, если это про твой маршрут сейчас.'}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {isActive ? (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onEnableMinimal}
              className="rounded-lg bg-[var(--app-primary)] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
            >
              Удержать сегодня минимально
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onClearPlateau}
              className="rounded-lg border border-[var(--app-border)] px-3 py-2 text-xs font-medium text-[var(--app-text-muted)]"
            >
              Перевал пройден
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={saving}
              onClick={onMarkPlateau}
              className="rounded-lg bg-[var(--app-primary)] px-3 py-2 text-xs font-semibold text-slate-950 disabled:opacity-50"
            >
              Я на перевале
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onDismissHint}
              className="text-xs text-[var(--app-text-muted)] hover:underline disabled:opacity-50"
            >
              Скрыть подсказку
            </button>
          </>
        )}
      </div>
    </Card>
  );
}
