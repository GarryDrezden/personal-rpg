import type { AchievementTier } from '../../types/achievements';
import { ACHIEVEMENT_TIERS, ICON_EMOJI_MAP } from '../../constants/achievements';
import { Lock } from 'lucide-react';

type AchievementIconProps = {
  iconKey: string;
  tier: AchievementTier;
  unlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = {
  sm: 'h-10 w-10 text-lg',
  md: 'h-14 w-14 text-2xl',
  lg: 'h-20 w-20 text-3xl',
};

export function AchievementIcon({ iconKey, tier, unlocked, size = 'md' }: AchievementIconProps) {
  const tierStyle = ACHIEVEMENT_TIERS[tier];
  const emoji = ICON_EMOJI_MAP[iconKey] ?? '🏅';

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border-2 bg-gradient-to-br ${tierStyle.color} ${tierStyle.borderColor} ${SIZE_MAP[size]} ${
        unlocked
          ? tier === 'legendary'
            ? 'shadow-[0_0_20px_rgba(251,146,60,0.45)]'
            : 'shadow-md'
          : 'opacity-40 grayscale'
      }`}
    >
      {unlocked ? (
        <span role="img" aria-hidden>
          {emoji}
        </span>
      ) : (
        <Lock className="h-5 w-5 text-stone-500" />
      )}
    </div>
  );
}
