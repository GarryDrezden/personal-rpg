import { Link } from 'react-router-dom';
import type { BodyAbilityV1Summary } from '../../types/bodyAbilityV1';

type BodyAbilityDashboardSummaryProps = {
  summary: BodyAbilityV1Summary;
  compact?: boolean;
};

export function BodyAbilityDashboardSummary({
  summary,
  compact = false,
}: BodyAbilityDashboardSummaryProps) {
  return (
    <section
      data-testid="body-ability-dashboard-summary"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
            Способности тела
          </p>
          <p className="mt-1 text-sm font-medium text-[var(--app-text)]">
            {summary.unlockedCount} открыто из {summary.totalCount}
          </p>
        </div>
        <Link
          to="/growth/abilities"
          className="shrink-0 text-xs font-semibold text-[var(--app-primary)] hover:underline"
        >
          {compact ? 'Открыть' : 'Посмотреть способности'}
        </Link>
      </div>
      {!compact ? (
        <p className="mt-2 text-xs text-[var(--app-text-muted)]">{summary.progressLine}</p>
      ) : null}
      {summary.nextSuggested ? (
        <p className={`text-xs text-[var(--app-text-muted)] ${compact ? 'mt-1' : 'mt-1'}`}>
          {compact ? 'Возможно: ' : 'Следующая возможная: '}
          {summary.nextSuggested.title}
        </p>
      ) : compact && summary.unlockedCount === 0 ? (
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">
          Отмечай улучшения в жизни — без давления на вес.
        </p>
      ) : null}
    </section>
  );
}
