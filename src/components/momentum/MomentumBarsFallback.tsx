import type { MomentumTrendSummary } from '../../types/momentum';
import { formatDateRu } from '../../utils/dates';
import { Card } from '../ui/Card';

export type MomentumBarsFallbackProps = {
  summary: MomentumTrendSummary;
  partialRange?: boolean;
};

export function MomentumBarsFallback({ summary, partialRange }: MomentumBarsFallbackProps) {
  const { points } = summary;

  if (points.length < 2) {
    return (
      <p className="text-sm text-[var(--app-text-muted)]">
        Пока мало данных для графика. Заполни несколько дней, и здесь появится история движения
        системы.
      </p>
    );
  }

  return (
    <>
      {partialRange && (
        <p className="mb-3 text-xs text-[var(--app-text-muted)]">
          Данных меньше выбранного диапазона. Показываем всю доступную историю.
        </p>
      )}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <p className="text-xs text-[var(--app-text-muted)]">
          Средняя: {summary.averageValue > 0 ? '+' : ''}
          {summary.averageValue} · Δ {summary.totalDelta > 0 ? '+' : ''}
          {summary.totalDelta}
        </p>
      </div>

      <div className="flex h-44 items-stretch gap-0.5 sm:h-52 sm:gap-1">
        {points.map((p) => {
          const barHeight = Math.min(50, (Math.abs(p.value) / 100) * 50);
          const isPositive = p.value >= 0;

          return (
            <div
              key={p.date}
              className="group flex min-w-0 flex-1 flex-col"
              title={`${formatDateRu(p.date, 'd MMM')}: ${p.value > 0 ? '+' : ''}${p.value}`}
            >
              <div className="relative flex flex-1 flex-col">
                <div className="flex flex-1 flex-col justify-end">
                  {isPositive && (
                    <div
                      className="mx-auto w-full max-w-[12px] rounded-t bg-[var(--app-primary)]/85 transition-all"
                      style={{ height: `${barHeight}%` }}
                    />
                  )}
                </div>
                <div className="h-px shrink-0 bg-[var(--app-border)]" aria-hidden />
                <div className="flex flex-1 flex-col justify-start">
                  {!isPositive && (
                    <div
                      className="mx-auto w-full max-w-[12px] rounded-b bg-amber-500/75 transition-all"
                      style={{ height: `${barHeight}%` }}
                    />
                  )}
                </div>
              </div>
              <span className="mt-1 truncate text-center text-[9px] text-[var(--app-text-muted)] sm:text-[10px]">
                {formatDateRu(p.date, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-[var(--app-text-muted)]">
        <span>−100</span>
        <span className="font-medium">0</span>
        <span>+100</span>
      </div>
    </>
  );
}

export function MomentumBarsFallbackCard({
  summary,
  partialRange,
}: MomentumBarsFallbackProps) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">График инерции</h2>
      <MomentumBarsFallback summary={summary} partialRange={partialRange} />
    </Card>
  );
}
