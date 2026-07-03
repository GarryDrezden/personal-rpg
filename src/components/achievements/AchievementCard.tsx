import type { Achievement, AchievementProgress, UnlockedAchievement } from '../../types/achievements';
import { ACHIEVEMENT_TIERS, getTierLabel } from '../../constants/achievements';
import { AchievementIcon } from './AchievementIcon';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDateRu } from '../../utils/dates';
import {
  DISPLAY_CATEGORY_LABELS,
  TROPHY_CARD,
  TROPHY_CARD_CLOSE,
  TROPHY_CARD_COMPACT,
  TROPHY_CARD_EARNED,
  TROPHY_CARD_LOCKED,
} from './achievementsUi';

export type AchievementCardHighlight = 'none' | 'close' | 'recent';

type AchievementCardProps = {
  achievement: Achievement;
  unlocked?: UnlockedAchievement;
  progress?: AchievementProgress;
  highlight?: AchievementCardHighlight;
};

function progressUnitLabel(achievementId: string): string | null {
  if (achievementId === 'recovery_balance_of_strength') return 'недель';
  if (achievementId === 'recovery_not_a_robot') return 'дней';
  return null;
}

function shouldUseCompactLayout(
  isUnlocked: boolean,
  progress: AchievementProgress | undefined,
): boolean {
  if (isUnlocked) return false;
  if (!progress) return true;
  if (progress.percent > 0) return false;
  return progress.target <= 1;
}

function shouldShowProgress(
  isUnlocked: boolean,
  progress: AchievementProgress | undefined,
): boolean {
  if (isUnlocked || !progress) return false;
  if (progress.percent <= 0 && progress.target <= 1) return false;
  return progress.target > 1 || progress.percent > 0;
}

export function AchievementCard({
  achievement,
  unlocked,
  progress,
  highlight = 'none',
}: AchievementCardProps) {
  const isUnlocked = !!unlocked;
  const isHidden = achievement.hidden && !isUnlocked;
  const tierStyle = ACHIEVEMENT_TIERS[achievement.tier];
  const isClose = !isUnlocked && highlight === 'close';
  const compact = shouldUseCompactLayout(isUnlocked, progress);
  const showProgress = shouldShowProgress(isUnlocked, progress);
  const unit = progressUnitLabel(achievement.id);

  const title = isHidden ? 'Секретный трофей' : achievement.title;
  const description = isHidden ? 'Условие скрыто до получения' : achievement.description;

  const shellClass = isUnlocked
    ? TROPHY_CARD_EARNED
    : isClose
      ? TROPHY_CARD_CLOSE
      : TROPHY_CARD_LOCKED;

  const statusLabel = isUnlocked
    ? `Получено ${formatDateRu(unlocked!.unlockedAt, 'd MMM yyyy')}`
    : isClose
      ? 'Близко'
      : 'В пути';

  const statusClass = isUnlocked
    ? 'text-[var(--app-gold)]/85'
    : isClose
      ? 'text-violet-200/70'
      : 'text-[var(--app-text-muted)]/60';

  return (
    <article
      className={`${TROPHY_CARD} ${shellClass} ${compact ? TROPHY_CARD_COMPACT : 'p-4'}`}
      data-testid={`achievement-card-${achievement.id}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/10 to-transparent"
        aria-hidden
      />
      {isUnlocked ? (
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgba(212,165,55,0.06),transparent_55%)]"
          aria-hidden
        />
      ) : null}

      <div className="relative flex gap-3">
        <AchievementIcon
          iconKey={achievement.iconKey}
          tier={achievement.tier}
          unlocked={isUnlocked}
          size={compact ? 'sm' : 'md'}
          softLocked={!isUnlocked}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`font-semibold leading-snug ${
                    isUnlocked ? 'text-[var(--app-text)]' : 'text-[var(--app-text)]/85'
                  } ${compact ? 'text-sm' : ''}`}
                >
                  {title}
                </h3>
                <span
                  className={`rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${tierStyle.color}`}
                >
                  {getTierLabel(achievement.tier)}
                </span>
              </div>
              {!compact ? (
                <p className="mt-1 line-clamp-2 text-sm text-[var(--app-text-muted)]/75">
                  {description}
                </p>
              ) : (
                <p className="mt-0.5 line-clamp-1 text-xs text-[var(--app-text-muted)]/65">
                  {description}
                </p>
              )}
            </div>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]">
            <span className="rounded-full border border-violet-500/15 bg-[#0e0c14]/50 px-2 py-0.5 text-[var(--app-text-muted)]/65">
              {DISPLAY_CATEGORY_LABELS[achievement.category]}
            </span>
            <span className={`font-medium ${statusClass}`}>{statusLabel}</span>
          </div>

          {showProgress && progress ? (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]/70">
                <span>{unit ? (unit === 'недель' ? 'Недель' : 'Дней') : 'Прогресс'}</span>
                <span>
                  {progress.current} / {progress.target}
                  {unit ? ` ${unit}` : ''}
                </span>
              </div>
              <ProgressBar
                value={progress.percent}
                color={isClose ? 'gold' : 'gold'}
                className={isClose ? 'h-2' : 'h-1.5'}
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
