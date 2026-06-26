import type { MomentumSummary } from '../../types/momentum';
import type { MomentumDailyFactor } from '../../types/momentum';
import { Card } from '../ui/Card';

type MomentumWeekBlockProps = {
  summary: MomentumSummary;
  topFactors: MomentumDailyFactor[];
  weekMomentumDelta: number;
  momentumSummaryText?: string;
};

function formatValue(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export function MomentumWeekBlock({
  summary,
  topFactors,
  weekMomentumDelta,
  momentumSummaryText,
}: MomentumWeekBlockProps) {
  return (
    <Card className="bg-[color-mix(in_srgb,var(--app-secondary)_6%,var(--app-card))]">
      <h2 className="text-lg font-semibold text-[var(--app-text)]">Инерция недели</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-[var(--app-text-muted)]">Средняя</p>
          <p className="text-xl font-bold text-[var(--app-primary)]">
            {formatValue(summary.weekAverage)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--app-text-muted)]">Изменение</p>
          <p className="text-xl font-bold text-[var(--app-text)]">
            {formatValue(weekMomentumDelta)}
          </p>
        </div>
        <div>
          <p className="text-xs text-[var(--app-text-muted)]">Сейчас</p>
          <p className="text-xl font-bold text-[var(--app-text)]">
            {summary.currentLevel.icon} {formatValue(summary.currentValue)}
          </p>
        </div>
      </div>
      {momentumSummaryText && (
        <p className="mt-3 text-sm text-[var(--app-text-muted)]">{momentumSummaryText}</p>
      )}
      {topFactors.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-[var(--app-border)] pt-3">
          {topFactors.map((f) => (
            <li
              key={f.id}
              className="flex justify-between text-sm text-[var(--app-text-muted)]"
            >
              <span>{f.title}</span>
              <span
                className={
                  f.value > 0
                    ? 'font-medium text-emerald-600 dark:text-emerald-400'
                    : 'font-medium text-amber-700 dark:text-amber-400/90'
                }
              >
                {formatValue(f.value)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
