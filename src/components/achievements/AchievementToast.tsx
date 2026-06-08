import { useEffect } from 'react';
import type { Achievement } from '../../types/achievements';
import { AchievementIcon } from './AchievementIcon';
import { ACHIEVEMENT_TIERS } from '../../constants/achievements';
import { X } from 'lucide-react';

type AchievementToastProps = {
  achievement: Achievement;
  onDismiss: () => void;
  autoHideMs?: number;
};

export function AchievementToast({ achievement, onDismiss, autoHideMs = 5000 }: AchievementToastProps) {
  const tierStyle = ACHIEVEMENT_TIERS[achievement.tier];

  useEffect(() => {
    const t = setTimeout(onDismiss, autoHideMs);
    return () => clearTimeout(t);
  }, [achievement.id, autoHideMs, onDismiss]);

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border-2 bg-white p-4 shadow-xl ${tierStyle.borderColor} ${
        achievement.tier === 'legendary' ? 'shadow-[0_0_25px_rgba(251,146,60,0.45)]' : ''
      }`}
      role="status"
    >
      <AchievementIcon iconKey={achievement.iconKey} tier={achievement.tier} unlocked size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold">
          Достижение открыто!
        </p>
        <p className="mt-1 font-semibold text-stone-900">{achievement.title}</p>
        <p className="text-sm text-rpg-muted">{achievement.description}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
        aria-label="Закрыть"
      >
        <X size={18} />
      </button>
    </div>
  );
}
