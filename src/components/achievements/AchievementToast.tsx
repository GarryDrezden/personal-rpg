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
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border-2 bg-[var(--app-card-strong)] p-4 shadow-[var(--app-shadow)] ${tierStyle.borderColor} ${
        achievement.tier === 'legendary' ? 'achievement-legendary-glow' : ''
      }`}
      role="status"
    >
      <AchievementIcon iconKey={achievement.iconKey} tier={achievement.tier} unlocked size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-primary)]">
          Достижение открыто!
        </p>
        <p className="mt-1 font-semibold text-[var(--app-text)]">{achievement.title}</p>
        <p className="text-sm text-[var(--app-text-muted)]">{achievement.description}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded-lg p-1 text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--app-text)]"
        aria-label="Закрыть"
      >
        <X size={18} />
      </button>
    </div>
  );
}
