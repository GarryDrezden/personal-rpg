import type { BodyAbilityBranchSummary } from '../../types/bodyAbilities';
import { Card } from '../ui/Card';

type BodyAbilityBranchCardProps = {
  summary: BodyAbilityBranchSummary;
};

export function BodyAbilityBranchCard({ summary }: BodyAbilityBranchCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden>
          {summary.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-[var(--app-text)]">{summary.title}</h3>
          <p className="text-xs text-[var(--app-text-muted)]">{summary.description}</p>
        </div>
        <span className="shrink-0 text-sm font-medium text-[var(--app-text-muted)]">
          {summary.unlockedCount}/{summary.totalCount}
        </span>
      </div>
      <div>
        <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
          <span>Прогресс открытия</span>
          <span>{summary.progressPercent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
          <div
            className="h-full rounded-full bg-[var(--app-primary)] transition-all"
            style={{ width: `${summary.progressPercent}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
