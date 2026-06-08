import type { Achievement, AchievementProgress, UnlockedAchievement } from '../../types/achievements';
import { ACHIEVEMENT_TIERS, CATEGORY_LABELS, getTierLabel } from '../../constants/achievements';
import { AchievementIcon } from './AchievementIcon';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDateRu } from '../../utils/dates';

type AchievementCardProps = {
  achievement: Achievement;
  unlocked?: UnlockedAchievement;
  progress?: AchievementProgress;
};

export function AchievementCard({ achievement, unlocked, progress }: AchievementCardProps) {
  const isUnlocked = !!unlocked;
  const isHidden = achievement.hidden && !isUnlocked;
  const tierStyle = ACHIEVEMENT_TIERS[achievement.tier];

  const title = isHidden ? 'Секретное достижение' : achievement.title;
  const description = isHidden ? 'Условие скрыто' : achievement.description;

  return (
    <div
      className={`rounded-2xl border bg-white p-4 transition-shadow ${
        isUnlocked
          ? `${tierStyle.borderColor} ${
              achievement.tier === 'legendary'
                ? 'shadow-[0_0_25px_rgba(251,146,60,0.45)]'
                : 'shadow-sm'
            }`
          : 'border-stone-200 opacity-80'
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
            <h3 className={`font-semibold ${isUnlocked ? 'text-stone-900' : 'text-stone-500'}`}>
              {title}
            </h3>
            <span
              className={`rounded-full bg-gradient-to-r px-2 py-0.5 text-[10px] font-medium text-white ${tierStyle.color}`}
            >
              {getTierLabel(achievement.tier)}
            </span>
          </div>
          <p className="mt-1 text-sm text-rpg-muted">{description}</p>
          <p className="mt-1 text-xs text-rpg-muted">{CATEGORY_LABELS[achievement.category]}</p>

          {isUnlocked && unlocked && (
            <p className="mt-2 text-xs text-emerald-700">
              Получено {formatDateRu(unlocked.unlockedAt, 'd MMM yyyy')}
            </p>
          )}

          {!isUnlocked && progress && progress.target > 1 && (
            <div className="mt-3">
              <div className="mb-1 flex justify-between text-xs text-rpg-muted">
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
