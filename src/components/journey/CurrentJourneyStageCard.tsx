import type { AppThemeId } from '../../types/theme';
import type { JourneyStageProgress } from '../../types/journeyMap';
import { resolveJourneyStageText } from '../../types/journeyMap';
import { JourneyConditionRow } from './JourneyConditionRow';
import { getIncompleteConditions } from '../../utils/journeyMapEngine';
import { Card } from '../ui/Card';

type CurrentJourneyStageCardProps = {
  progress: JourneyStageProgress;
  themeId?: AppThemeId;
};

export function CurrentJourneyStageCard({
  progress,
  themeId = 'cozy',
}: CurrentJourneyStageCardProps) {
  const text = resolveJourneyStageText(progress.stage, themeId);
  const isComplete = progress.status === 'completed';
  const incomplete = getIncompleteConditions(progress, 99);
  const isDark = themeId === 'darkFantasy';

  return (
    <Card
      className={`${
        isDark
          ? 'border-amber-400/40 shadow-[var(--app-glow)]'
          : 'border-[color-mix(in_srgb,var(--app-primary)_35%,var(--app-border))]'
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="text-4xl" aria-hidden>
            {progress.stage.icon}
          </span>
          <div>
            <span className="rounded-full bg-[var(--app-primary)]/15 px-2 py-0.5 text-xs font-semibold text-[var(--app-primary)]">
              {isComplete ? 'Пройдено' : 'Текущая глава'}
            </span>
            <h2 className="mt-2 text-lg font-bold text-[var(--app-text)]">{text.title}</h2>
            <p className="text-sm text-[var(--app-text-muted)]">{text.description}</p>
          </div>
        </div>
        <span className="shrink-0 text-sm font-semibold text-[var(--app-primary)]">
          {progress.progressPercent}%
        </span>
      </div>

      <div className="mb-4 h-2 overflow-hidden rounded-full bg-[var(--app-bg-soft)]">
        <div
          className="h-full rounded-full bg-[var(--app-primary)]"
          style={{ width: `${progress.progressPercent}%` }}
        />
      </div>

      {isComplete ? (
        <p className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
          {text.completedText}
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
            До следующей главы
          </p>
          {incomplete.map((cp) => (
            <JourneyConditionRow key={cp.condition.id} conditionProgress={cp} />
          ))}
        </div>
      )}
    </Card>
  );
}
