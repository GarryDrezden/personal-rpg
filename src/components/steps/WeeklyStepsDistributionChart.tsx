import type { WeeklyStepsDistribution } from '../../utils/stepsEngine';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';

type WeeklyStepsDistributionChartProps = {
  distribution: WeeklyStepsDistribution;
};

const ROWS: {
  key: keyof WeeklyStepsDistribution;
  label: string;
  barClass: string;
  glowClass: string;
}[] = [
  {
    key: 'low',
    label: 'Ниже',
    barClass: 'bg-rose-400/70 dark:bg-rose-500/50',
    glowClass: 'shadow-[0_0_8px_rgba(251,113,133,0.25)]',
  },
  {
    key: 'minimum',
    label: 'Минимум',
    barClass: 'bg-amber-400/80 dark:bg-amber-500/60',
    glowClass: 'shadow-[0_0_8px_rgba(251,191,36,0.3)]',
  },
  {
    key: 'normal',
    label: 'Норма',
    barClass: 'bg-emerald-500/80 dark:bg-emerald-500/60',
    glowClass: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]',
  },
  {
    key: 'excellent',
    label: 'Отлично',
    barClass: 'bg-yellow-400/90 dark:bg-yellow-500/70',
    glowClass: 'shadow-[0_0_10px_rgba(250,204,21,0.35)]',
  },
];

function getInsight(d: WeeklyStepsDistribution): string {
  const total = d.low + d.minimum + d.normal + d.excellent;
  if (total === 0) return 'Пока мало данных по шагам за эту неделю.';
  if (d.excellent > 0) return 'Есть отличные дни движения — супер.';
  if (d.normal >= 5) return 'Сильная неделя по шагам.';
  if (d.low >= 4) {
    return 'Шаги проседали большую часть недели. Возможно, цель стоит снижать постепенно.';
  }
  return 'Каждый день движения считается — даже минимум удерживает режим.';
}

export function WeeklyStepsDistributionChart({
  distribution,
}: WeeklyStepsDistributionChartProps) {
  const { isDarkFantasy } = useAppTheme();
  const max = 7;

  return (
    <Card
      className={
        isDarkFantasy
          ? 'border-violet-500/25 bg-[var(--app-card)]'
          : 'border-[var(--app-border)] bg-[var(--app-card)]'
      }
    >
      <h2 className="mb-1 font-semibold text-[var(--app-text)]">Распределение шагов</h2>
      <p className="mb-4 text-xs text-[var(--app-text-muted)]">
        Дней недели по уровням (7000 / 11500 / 14000+)
      </p>

      <div className="space-y-3">
        {ROWS.map((row) => {
          const value = distribution[row.key];
          const pct = Math.round((value / max) * 100);
          return (
            <div key={row.key} className="grid grid-cols-[72px_1fr_28px] items-center gap-3">
              <span className="text-sm text-[var(--app-text-muted)]">{row.label}</span>
              <div className="h-3 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
                <div
                  className={`h-full rounded-full transition-all ${row.barClass} ${
                    value > 0 ? row.glowClass : ''
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-right text-sm font-semibold text-[var(--app-text)]">
                {value}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-[var(--app-text-muted)]">{getInsight(distribution)}</p>
    </Card>
  );
}
