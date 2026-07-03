import type { AchievementTier } from '../../types/achievements';
import { ACHIEVEMENT_TIERS, ICON_EMOJI_MAP } from '../../constants/achievements';
import { Award, Lock } from 'lucide-react';

type AchievementIconProps = {
  iconKey: string;
  tier: AchievementTier;
  unlocked: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** Softer locked state — muted rune instead of harsh lock. */
  softLocked?: boolean;
};

const SIZE_MAP = {
  sm: 'h-10 w-10 text-lg',
  md: 'h-14 w-14 text-2xl',
  lg: 'h-20 w-20 text-3xl',
};

export function AchievementIcon({
  iconKey,
  tier,
  unlocked,
  size = 'md',
  softLocked = false,
}: AchievementIconProps) {
  const tierStyle = ACHIEVEMENT_TIERS[tier];
  const emoji = ICON_EMOJI_MAP[iconKey] ?? '🏅';

  const earnedGlow =
    unlocked && tier === 'legendary'
      ? 'shadow-[0_0_20px_rgba(212,165,55,0.35)]'
      : unlocked
        ? 'shadow-[0_0_14px_rgba(212,165,55,0.12)]'
        : '';

  const lockedVisual = softLocked
    ? 'opacity-60 saturate-50'
    : 'opacity-40 grayscale';

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border-2 bg-gradient-to-br ${tierStyle.color} ${tierStyle.borderColor} ${SIZE_MAP[size]} ${
        unlocked ? earnedGlow : lockedVisual
      }`}
    >
      {unlocked ? (
        <span role="img" aria-hidden>
          {emoji}
        </span>
      ) : softLocked ? (
        <span role="img" aria-hidden className="opacity-80">
          {emoji}
        </span>
      ) : (
        <Lock className="h-5 w-5 text-stone-500" strokeWidth={1.5} />
      )}
      {unlocked && size !== 'sm' ? (
        <Award
          className="absolute -bottom-0.5 -right-0.5 h-4 w-4 text-[var(--app-gold)]/90 drop-shadow"
          strokeWidth={2}
          aria-hidden
        />
      ) : null}
    </div>
  );
}
