import { lazy, Suspense } from 'react';
import type { MomentumTrendSummary } from '../../types/momentum';
import { Card } from '../ui/Card';
import { MomentumBarsFallback } from './MomentumBarsFallback';

const MomentumLineChart = lazy(() => import('./MomentumLineChart'));

type MomentumTrendChartProps = {
  summary: MomentumTrendSummary;
  historyLength?: number;
};

export function MomentumTrendChart({ summary, historyLength }: MomentumTrendChartProps) {
  const { points, range } = summary;
  const partialRange =
    historyLength !== undefined && historyLength > 0 && historyLength < range;

  if (points.length < 2) {
    return (
      <Card>
        <h2 className="text-lg font-semibold text-[var(--app-text)]">График инерции</h2>
        <p className="mt-2 text-sm text-[var(--app-text-muted)]">
          Пока мало данных для графика. Заполни несколько дней, и здесь появится история движения
          системы.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">График инерции</h2>
      <Suspense
        fallback={
          <div className="space-y-3">
            <p className="text-sm text-[var(--app-text-muted)]">Загрузка графика…</p>
            <MomentumBarsFallback summary={summary} partialRange={partialRange} />
          </div>
        }
      >
        <MomentumLineChart summary={summary} partialRange={partialRange} />
      </Suspense>
    </Card>
  );
}
