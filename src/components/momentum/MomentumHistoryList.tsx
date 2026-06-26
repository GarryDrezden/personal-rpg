import type { MomentumDayResult } from '../../types/momentum';
import { formatDateRu } from '../../utils/dates';
import { Card } from '../ui/Card';

type MomentumHistoryListProps = {
  history: MomentumDayResult[];
  limit?: number;
};

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export function MomentumHistoryList({ history, limit = 14 }: MomentumHistoryListProps) {
  const items = [...history].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);

  if (items.length === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">История последних дней</h2>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          История инерции пока пуста. Один заполненный день уже создаст первую точку.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">История последних дней</h2>
      <ul className="space-y-3">
        {items.map((day) => {
          const topFactors = [...day.factors]
            .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
            .slice(0, 3);

          return (
            <li
              key={day.date}
              className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-3 py-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-[var(--app-text)]">
                    {formatDateRu(day.date, 'EEE d MMM')}
                  </p>
                  <p className="text-sm text-[var(--app-text-muted)]">
                    {day.level.icon} {day.level.title}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-bold text-[var(--app-primary)]">
                    {formatDelta(Math.round(day.endValue))}
                  </p>
                  <p className="text-[var(--app-text-muted)]">
                    Δ {formatDelta(day.dailyDelta)}
                  </p>
                </div>
              </div>
              {topFactors.length > 0 && (
                <ul className="mt-2 space-y-0.5 border-t border-[var(--app-border)] pt-2">
                  {topFactors.map((f) => (
                    <li
                      key={f.id}
                      className="flex justify-between text-xs text-[var(--app-text-muted)]"
                    >
                      <span>{f.title}</span>
                      <span
                        className={
                          f.value > 0
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-700 dark:text-amber-400/90'
                        }
                      >
                        {formatDelta(f.value)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
