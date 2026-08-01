import { ONBOARDING_STEP_COUNT } from '../../utils/onboardingState';

type OnboardingProgressProps = {
  step: number;
  saving?: boolean;
};

export function OnboardingProgress({ step, saving }: OnboardingProgressProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--app-text-muted)]">
        Шаг {step + 1} из {ONBOARDING_STEP_COUNT}
        {saving ? ' · сохраняем…' : null}
      </p>
      <div className="flex justify-center gap-1.5" aria-hidden>
        {Array.from({ length: ONBOARDING_STEP_COUNT }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step
                ? 'w-9 bg-[var(--app-gold)] shadow-[0_0_10px_rgba(250,204,21,0.35)]'
                : i < step
                  ? 'w-2.5 bg-[var(--app-gold)]/45'
                  : 'w-2.5 bg-[var(--app-border)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
