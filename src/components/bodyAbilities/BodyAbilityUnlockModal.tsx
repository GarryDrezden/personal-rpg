import type { AppThemeId } from '../../types/theme';
import type { BodyAbilityProgress } from '../../types/bodyAbilities';
import { resolveBodyAbilityText } from '../../types/bodyAbilities';
import { BODY_ABILITY_TIERS } from '../../constants/bodyAbilities';

type BodyAbilityUnlockModalProps = {
  abilityProgress: BodyAbilityProgress | null;
  themeId?: AppThemeId;
  onClose: () => void;
};

export function BodyAbilityUnlockModal({
  abilityProgress,
  themeId = 'cozy',
  onClose,
}: BodyAbilityUnlockModalProps) {
  if (!abilityProgress) return null;

  const { ability } = abilityProgress;
  const text = resolveBodyAbilityText(ability, themeId);
  const tierStyle = BODY_ABILITY_TIERS[ability.tier];
  const isDark = themeId === 'darkFantasy';
  const isLegendary = ability.tier === 'legendary';

  return (
    <div
      data-testid="body-ability-unlock-modal"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="body-ability-unlock-title"
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border-2 p-6 shadow-[var(--app-shadow)] ${
          tierStyle.borderClass
        } ${
          isDark
            ? 'bg-[var(--app-card-strong)] shadow-[var(--app-glow)]'
            : 'bg-[var(--app-card-strong)]'
        } ${isLegendary ? 'achievement-legendary-glow' : ''}`}
      >
        <div className="flex flex-col items-center text-center">
          <span className="mb-4 text-6xl" aria-hidden>
            {ability.icon}
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)]">
            {text.unlockHeading}
          </p>
          <h2
            id="body-ability-unlock-title"
            className="mt-2 text-2xl font-bold text-[var(--app-text)]"
          >
            {text.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--app-text-muted)]">
            {text.unlockText}
          </p>
          {ability.effectLabel ? (
            <p className="mt-4 rounded-full bg-[var(--app-bg-soft)] px-4 py-1.5 text-sm font-semibold text-[var(--app-primary)]">
              {ability.effectLabel}
            </p>
          ) : null}
          <button
            type="button"
            data-testid="body-ability-modal-close"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-[var(--app-primary)] px-6 py-3 text-sm font-semibold text-slate-950 transition-opacity hover:opacity-90"
          >
            Продолжить путь
          </button>
        </div>
      </div>
    </div>
  );
}
