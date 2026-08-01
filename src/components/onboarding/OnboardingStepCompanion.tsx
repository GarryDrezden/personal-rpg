import { CompanionSelector } from '../game/CompanionSelector';
import type { CompanionId } from '../../types/gameAssets';
import type { AppThemeId } from '../../types/theme';
import type { OnboardingDraft } from '../../types/onboarding';

type OnboardingStepCompanionProps = {
  draft: OnboardingDraft;
  onChange: (patch: Partial<OnboardingDraft>) => void;
  themeId?: AppThemeId;
};

export function OnboardingStepCompanion({
  draft,
  onChange,
  themeId,
}: OnboardingStepCompanionProps) {
  const finishHint =
    themeId === 'darkFantasy'
      ? 'Первый день уже может ослабить первую помеху на пути.'
      : 'Первый след дня уже может принести дому немного уюта.';

  return (
    <div data-testid="onboarding-step-companion" className="mt-5 space-y-4">
      <CompanionSelector
        compact
        value={(draft.companionId ?? 'golden_chinchilla_cat') as CompanionId}
        onChange={(companionId) => onChange({ companionId })}
      />
      <p className="rounded-xl border border-[var(--app-gold)]/30 bg-[var(--app-primary-soft)]/50 px-4 py-3 text-sm text-[var(--app-text)]">
        {finishHint}
      </p>
    </div>
  );
}
