import type { Achievement, AchievementProgress, UnlockedAchievement } from '../../types/achievements';
import { ACHIEVEMENT_TIERS, CATEGORY_LABELS, getTierLabel } from '../../constants/achievements';
import { useAppTheme } from '../../hooks/useAppTheme';
import { AchievementIcon } from './AchievementIcon';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDateRu } from '../../utils/dates';

type AchievementCardProps = {
  achievement: Achievement;
  unlocked?: UnlockedAchievement;
  progress?: AchievementProgress;
};

export function AchievementCard({ achievement, unlocked, progress }: AchievementCardProps) {
  const { isDarkFantasy } = useAppTheme();
  const isUnlocked = !!unlocked;
  const isHidden = achievement.hidden && !isUnlocked;
  const tierStyle = ACHIEVEMENT_TIERS[achievement.tier];

  const title = isHidden ? 'Секретное достижение' : achievement.title;
  const description = isHidden ? 'Условие скрыто' : achievement.description;

  const lockedClass = isDarkFantasy
    ? 'border-[var(--app-border)] bg-[var(--app-card)] opacity-55'
    : 'border-[var(--app-border)] bg-[var(--app-bg-soft)] opacity-80';

  const legendaryGlow =
    achievement.tier === 'legendary' && isUnlocked
      ? 'achievement-legendary-glow'
      : isUnlocked
        ? 'shadow-sm'
        : '';

  return (
    <div
      className={`rounded-2xl border p-4 transition-shadow ${
        isUnlocked
          ? `${tierStyle.borderColor} bg-[var(--app-card)] ${legendaryGlow}`
          : lockedClass
      }`}
    >
      <div className="flex gap-3">
        <AchievementIcon
          iconKey={achievement.iconKey}
          tier={achievement.tier}
          unlocked={isUnlocked}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`font-semibold ${
                isUnlocked ? 'text-[var(--app-text)]' : 'text-[var(--app-text-muted)]'
              }`}
            >
              {title}
            </h3>
            <span
              className={`rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-medium text-white ${tierStyle.color}`}
            >
              {getTierLabel(achievement.tier)}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{description}</p>
          <p className="mt-1 text-xs text-[var(--app-text-muted)]">
            {CATEGORY_LABELS[achievement.category]}
          </p>

          {isUnlocked && unlocked && (
            <p className="mt-2 text-xs text-[var(--app-success)]">
              Получено {formatDateRu(unlocked.unlockedAt, 'd MMM yyyy')}
            </p>
          )}

          {!isUnlocked && progress && progress.target > 1 && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
                <span>Прогресс</span>
                <span>
                  {progress.current} / {progress.target}
                </span>
              </div>
              <ProgressBar value={progress.percent} color="gold" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
