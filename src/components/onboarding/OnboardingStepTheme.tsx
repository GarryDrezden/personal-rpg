import type { AppThemeId } from '../../types/theme';
import {
  ONBOARDING_THEME_OPTIONS,
  type OnboardingDraft,
  type OnboardingThemeChoiceId,
} from '../../types/onboarding';

type OnboardingStepThemeProps = {
  draft: OnboardingDraft;
  onChange: (patch: Partial<OnboardingDraft>) => void;
};

export function OnboardingStepTheme({ draft, onChange }: OnboardingStepThemeProps) {
  const selected = draft.themeId;

  const pick = (id: OnboardingThemeChoiceId, available: boolean) => {
    if (!available) return;
    onChange({ themeId: id as AppThemeId });
  };

  return (
    <div data-testid="onboarding-step-theme" className="mt-5 space-y-3">
      {ONBOARDING_THEME_OPTIONS.map((opt) => {
        const isSelected = opt.available && selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            data-testid={`onboarding-theme-${opt.id}`}
            disabled={!opt.available}
            aria-disabled={!opt.available}
            onClick={() => pick(opt.id, opt.available)}
            className={`w-full rounded-xl border px-4 py-3.5 text-left transition ${
              !opt.available
                ? 'cursor-not-allowed border-[var(--app-border)]/70 bg-[var(--app-bg)]/50 opacity-65'
                : isSelected
                  ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] shadow-[0_0_16px_rgba(167,139,250,0.12)]'
                  : 'border-[var(--app-border)] bg-[var(--app-bg)] hover:border-[var(--app-primary)]/40'
            }`}
          >
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className="block font-semibold text-[var(--app-text)]">
                  <span aria-hidden className="mr-1.5">
                    {opt.previewEmoji}
                  </span>
                  {opt.title}
                </span>
                <span className="mt-1 block text-sm text-[var(--app-text-muted)]">
                  {opt.description}
                </span>
              </span>
              {!opt.available ? (
                <span className="shrink-0 rounded-full border border-[var(--app-border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
                  Скоро
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
