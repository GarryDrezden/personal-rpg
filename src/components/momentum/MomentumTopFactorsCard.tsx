import type { MomentumDailyFactor } from '../../types/momentum';
import { Card } from '../ui/Card';

type MomentumTopFactorsCardProps = {
  positive: MomentumDailyFactor[];
  negative: MomentumDailyFactor[];
};

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export function MomentumTopFactorsCard({ positive, negative }: MomentumTopFactorsCardProps) {
  const hasFactors = positive.length > 0 || negative.length > 0;

  return (
    <Card>
      <h2 className="text-lg font-semibold text-[var(--app-text)]">Что двигает инерцию</h2>
      <p className="mt-2 text-sm text-[var(--app-text-muted)]">
        Recovery и minimal день могут повышать инерцию, если база удержана: калории, шаги, ясность и
        дневник.
      </p>

      {!hasFactors ? (
        <p className="mt-4 text-sm text-[var(--app-text-muted)]">
          Пока мало данных для анализа факторов. Заполни несколько дней.
        </p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
              Разгоняет
            </p>
            {positive.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--app-text-muted)]">—</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {positive.map((f) => (
                  <li
                    key={f.id}
                    className="flex justify-between text-sm text-emerald-600 dark:text-emerald-400"
                  >
                    <span>{f.title}</span>
                    <span className="font-semibold">{formatDelta(f.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
              Замедляет
            </p>
            {negative.length === 0 ? (
              <p className="mt-2 text-sm text-[var(--app-text-muted)]">—</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {negative.map((f) => (
                  <li
                    key={f.id}
                    className="flex justify-between text-sm text-amber-700 dark:text-amber-400/90"
                  >
                    <span>{f.title}</span>
                    <span className="font-semibold">{formatDelta(f.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
