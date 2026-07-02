import type { SeasonSnapshotWithRecap } from '../../game/seasons/seasonEngine';
import { ProgressBar } from '../ui/ProgressBar';

type SeasonDashboardSummaryProps = {
  season: SeasonSnapshotWithRecap;
};

export function SeasonDashboardSummary({ season }: SeasonDashboardSummaryProps) {
  return (
    <section
      data-testid="season-dashboard-summary"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
            Сезон {season.seasonIndex}
          </p>
          <p className="truncate text-sm font-medium text-[var(--app-text)]">
            {season.config.title}
          </p>
        </div>
        <p className="text-xs text-[var(--app-text-muted)]">
          День {season.dayNumber}/{season.seasonLength}
        </p>
      </div>

      <p className="mt-1 text-xs text-[var(--app-text-muted)]">{season.partialStatusLabel}</p>

      <div className="mt-2">
        <ProgressBar value={season.completedQuestCount} max={season.quests.length} />
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">
          {season.completedQuestCount} из {season.quests.length} квестов ·{' '}
          {season.questsNearCompletion > 0
            ? `${season.questsNearCompletion} близко к закрытию`
            : 'путь продолжается'}
        </p>
      </div>

      <p className="mt-2 text-xs text-[var(--app-text-muted)] line-clamp-2">{season.recapText}</p>
    </section>
  );
}
