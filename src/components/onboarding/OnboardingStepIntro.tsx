type OnboardingStepIntroProps = {
  themeHint?: 'cozy' | 'darkFantasy' | null;
};

export function OnboardingStepIntro({ themeHint }: OnboardingStepIntroProps) {
  const line =
    themeHint === 'cozy'
      ? 'Тело возвращает силы — дом возвращает тепло.'
      : themeHint === 'darkFantasy'
        ? 'Каждый день ослабляет тьму и укрепляет путь.'
        : 'Выбери мир позже — идея одна: день за днём возвращать силы.';

  return (
    <div
      data-testid="onboarding-step-intro"
      className="mt-5 rounded-2xl border border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/55 px-4 py-4 text-sm text-[var(--app-text)]"
    >
      {line}
    </div>
  );
}
