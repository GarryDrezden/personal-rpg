import type { OnboardingDraft, OnboardingHeroGender } from '../../types/onboarding';

const inputClassName =
  'w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/25';

const GENDERS: { id: OnboardingHeroGender; label: string }[] = [
  { id: 'male', label: 'Мужской' },
  { id: 'female', label: 'Женский' },
  { id: 'neutral', label: 'Нейтральный' },
];

type OnboardingStepHeroProps = {
  draft: OnboardingDraft;
  onChange: (patch: Partial<OnboardingDraft>) => void;
};

export function OnboardingStepHero({ draft, onChange }: OnboardingStepHeroProps) {
  return (
    <div data-testid="onboarding-step-hero" className="mt-5 space-y-5">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-[var(--app-text)]">Имя героя</span>
        <input
          type="text"
          maxLength={40}
          placeholder="Например: Гарри"
          data-testid="onboarding-hero-name"
          value={draft.heroName ?? ''}
          onChange={(e) => onChange({ heroName: e.target.value })}
          className={inputClassName}
        />
        <span className="text-xs text-[var(--app-text-muted)]">
          Если оставить пустым — в кампании будет «Герой».
        </span>
      </label>

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Облик</p>
        <div className="grid grid-cols-3 gap-2">
          {GENDERS.map((g) => (
            <button
              key={g.id}
              type="button"
              data-testid={`onboarding-hero-${g.id}`}
              onClick={() => onChange({ heroGender: g.id })}
              className={`rounded-xl border px-2 py-3 text-sm font-semibold transition ${
                draft.heroGender === g.id
                  ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] shadow-[0_0_16px_rgba(167,139,250,0.12)]'
                  : 'border-[var(--app-border)] bg-[var(--app-bg)] hover:border-[var(--app-primary)]/40'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex h-28 items-center justify-center rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg)]/70 text-sm text-[var(--app-text-muted)]">
          {draft.heroGender === 'female'
            ? 'Превью: женский облик'
            : draft.heroGender === 'neutral'
              ? 'Превью: нейтральный облик'
              : draft.heroGender === 'male'
                ? 'Превью: мужской облик'
                : 'Выбери облик — превью подстроится под тему'}
        </div>
      </div>
    </div>
  );
}
