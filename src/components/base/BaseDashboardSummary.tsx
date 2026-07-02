import { Link } from 'react-router-dom';
import type { BaseProgressionSnapshot } from '../../types/baseV1';
import { ProgressBar } from '../ui/ProgressBar';

type BaseDashboardSummaryProps = {
  snapshot: BaseProgressionSnapshot;
  compact?: boolean;
};

export function BaseDashboardSummary({ snapshot, compact = false }: BaseDashboardSummaryProps) {
  const { currentStage, nextStage, progressPercent, flavorText } = snapshot;

  return (
    <section
      data-testid="base-dashboard-summary"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
            Лагерь героя
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
            <span aria-hidden>{currentStage.icon}</span>
            <span className="truncate">{currentStage.title}</span>
          </p>
        </div>
        {nextStage ? (
          <span className="text-xs text-[var(--app-text-muted)]">
            {progressPercent}% до «{nextStage.shortTitle}»
          </span>
        ) : (
          <span className="text-xs text-[var(--app-gold)]">Максимальная стадия</span>
        )}
      </div>

      {nextStage ? (
        <div className="mt-2">
          <ProgressBar value={progressPercent} max={100} />
        </div>
      ) : null}

      <p className="mt-2 text-xs text-[var(--app-text-muted)] line-clamp-2">
        {compact
          ? `Маршрут: ${snapshot.recentContributors.slice(0, 2).join(', ')}.`
          : `Маршрут укрепился: ${snapshot.recentContributors.join(', ')}.`}
      </p>
      {!compact ? (
        <p className="mt-1 text-xs text-[var(--app-text-muted)] line-clamp-2">{flavorText}</p>
      ) : null}

      <Link
        to="/growth/camp"
        className="mt-2 inline-block text-xs font-semibold text-[var(--app-primary)] hover:underline"
      >
        {compact ? 'Стадии лагеря' : 'Все стадии лагеря'}
      </Link>
    </section>
  );
}
