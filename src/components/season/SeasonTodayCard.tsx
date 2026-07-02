import type { SeasonSnapshotWithRecap } from '../../game/seasons/seasonEngine';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type SeasonTodayCardProps = {
  season: SeasonSnapshotWithRecap;
};

const VISIBLE_QUESTS = 3;

export function SeasonTodayCard({ season }: SeasonTodayCardProps) {
  const topQuests = season.quests
    .filter((q) => !q.completed)
    .sort((a, b) => b.current / b.target - a.current / a.target)
    .slice(0, VISIBLE_QUESTS);

  const displayQuests =
    topQuests.length > 0 ? topQuests : season.quests.slice(0, VISIBLE_QUESTS);

  return (
    <Card
      data-testid="season-today-card"
      className="border-[var(--app-border)] bg-[var(--app-bg-soft)]/60"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-gold)]">
            Сезон {season.seasonIndex} — {season.config.title}
          </p>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            День {season.dayNumber} из {season.seasonLength}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--app-gold)]/30 bg-[var(--app-primary-soft)]/40 px-2.5 py-1 text-xs font-medium text-[var(--app-gold)]">
          {season.partialStatusLabel}
        </span>
      </div>

      <p className="mt-2 text-sm text-[var(--app-text)]">
        Фокус: {season.config.focus}
      </p>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
          <span>Путь сезона</span>
          <span>{season.dayNumber}/{season.seasonLength}</span>
        </div>
        <ProgressBar value={season.dayNumber} max={season.seasonLength} />
      </div>

      <ul className="mt-3 space-y-2">
        {displayQuests.map((quest) => (
          <li key={quest.id} className="text-xs">
            <div className="flex justify-between gap-2 text-[var(--app-text)]">
              <span className="min-w-0 truncate">{quest.label}</span>
              <span className="shrink-0 tabular-nums text-[var(--app-text-muted)]">
                {quest.current}/{quest.target}
              </span>
            </div>
            <ProgressBar
              className="mt-1 h-1.5"
              value={quest.current}
              max={quest.target}
              color={quest.completed ? 'success' : 'gold'}
            />
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-[var(--app-text-muted)]">
        {season.config.miniBossName} {season.config.miniBossHint}.
      </p>
    </Card>
  );
}
