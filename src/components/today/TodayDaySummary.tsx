import { CARD_ACCENT } from '../../constants/cardTheme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import type { TodayPageModel } from '../../hooks/useTodayPageModel';

type TodayDaySummaryProps = {
  model: TodayPageModel;
};

export function TodayDaySummary({ model }: TodayDaySummaryProps) {
  const { derived, isEditingToday } = model;

  return (
    <Card className={CARD_ACCENT.primary} data-testid="today-day-summary">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm text-[var(--app-text-muted)]">Очки дня (XP)</p>
          <p className="text-3xl font-bold text-[var(--app-primary)]">+{Math.max(0, derived.points)}</p>
          {derived.momentumPoints.multiplier > 1 && isEditingToday && (
            <p className="mt-1 text-xs text-[var(--app-text-muted)]">
              Бонус инерции: +{Math.round((derived.momentumPoints.multiplier - 1) * 100)}% XP
              {derived.momentumPoints.base !== derived.points && (
                <span className="text-[var(--app-text-muted)]">
                  {' '}
                  (база {Math.max(0, derived.momentumPoints.base)})
                </span>
              )}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm text-[var(--app-text-muted)]">Монеты за день</p>
          <p className="text-3xl font-bold text-[var(--app-primary)]">+{derived.coins} 🪙</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--app-text)]">
        <span>
          Главное:{' '}
          <strong>
            {derived.stats.mainDone}/{derived.stats.mainTotal}
          </strong>
        </span>
        <span>
          Всего:{' '}
          <strong>
            {derived.stats.done}/{derived.stats.total}
          </strong>
        </span>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
          <span>Прогресс дня</span>
          <span>{derived.stats.percent}%</span>
        </div>
        <ProgressBar
          value={derived.stats.percent}
          color={derived.stats.percent >= 70 ? 'success' : 'gold'}
          className="h-2.5"
        />
      </div>
    </Card>
  );
}
