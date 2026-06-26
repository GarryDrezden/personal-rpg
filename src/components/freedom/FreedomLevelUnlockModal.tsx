import type { AppThemeId } from '../../types/theme';
import type { FreedomLevelUnlock } from '../../types/freedomUnlock';
import { FREEDOM_UNLOCK_MODAL_THEME } from '../../constants/freedomUnlocks';

type FreedomLevelUnlockModalProps = {
  unlock: FreedomLevelUnlock | null;
  themeId?: AppThemeId;
  onClose: () => void;
};

export function FreedomLevelUnlockModal({
  unlock,
  themeId = 'cozy',
  onClose,
}: FreedomLevelUnlockModalProps) {
  if (!unlock) return null;

  const isDark = themeId === 'darkFantasy';
  const themeCopy = isDark ? FREEDOM_UNLOCK_MODAL_THEME.darkFantasy : FREEDOM_UNLOCK_MODAL_THEME.cozy;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="freedom-unlock-title"
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border-2 p-6 shadow-[var(--app-shadow)] ${
          isDark
            ? 'border-amber-400/50 bg-[var(--app-card-strong)] shadow-[var(--app-glow)]'
            : 'border-[color-mix(in_srgb,var(--app-primary)_40%,var(--app-border))] bg-[var(--app-card-strong)]'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 text-6xl" aria-hidden>
            {unlock.icon}
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)]">
            {themeCopy.heading}
          </p>
          <h2
            id="freedom-unlock-title"
            className="mt-2 text-2xl font-bold text-[var(--app-text)]"
          >
            {unlock.description}
          </h2>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            Свобода тела: {unlock.score}%
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
            {unlock.unlockText}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {unlock.xpReward > 0 ? (
              <span className="rounded-full bg-[var(--app-bg-soft)] px-4 py-1.5 text-sm font-semibold text-[var(--app-primary)]">
                +{unlock.xpReward} XP
              </span>
            ) : null}
            {unlock.coinReward > 0 ? (
              <span className="rounded-full bg-amber-500/15 px-4 py-1.5 text-sm font-semibold text-amber-500">
                +{unlock.coinReward} 🪙
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-[var(--app-primary)] px-6 py-3 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
          >
            {themeCopy.continueLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
