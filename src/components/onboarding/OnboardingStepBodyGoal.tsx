import type { OnboardingDraft } from '../../types/onboarding';

const inputClassName =
  'w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/25';

type OnboardingStepBodyGoalProps = {
  draft: OnboardingDraft;
  onChange: (patch: Partial<OnboardingDraft>) => void;
};

export function OnboardingStepBodyGoal({ draft, onChange }: OnboardingStepBodyGoalProps) {
  return (
    <div data-testid="onboarding-step-body" className="mt-5 space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-[var(--app-text)]">Рост, см</span>
        <input
          type="number"
          inputMode="numeric"
          min={100}
          max={250}
          placeholder="Например, 175"
          data-testid="onboarding-height"
          value={draft.height ?? ''}
          onChange={(e) =>
            onChange({ height: e.target.value ? Number(e.target.value) : undefined })
          }
          className={inputClassName}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-[var(--app-text)]">Стартовый вес, кг</span>
        <input
          type="number"
          inputMode="decimal"
          min={40}
          max={300}
          step={0.1}
          placeholder="Например, 92"
          data-testid="onboarding-start-weight"
          value={draft.startWeight ?? ''}
          onChange={(e) =>
            onChange({
              startWeight: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className={inputClassName}
        />
        <span className="text-xs text-[var(--app-text-muted)]">Желательно — отправная точка пути</span>
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-[var(--app-text)]">Целевой вес, кг</span>
        <input
          type="number"
          inputMode="decimal"
          min={40}
          max={300}
          step={0.1}
          placeholder="Можно пропустить"
          data-testid="onboarding-target-weight"
          value={draft.targetWeight ?? ''}
          onChange={(e) =>
            onChange({
              targetWeight: e.target.value ? Number(e.target.value) : undefined,
            })
          }
          className={inputClassName}
        />
        <span className="text-xs text-[var(--app-text-muted)]">
          Без обещаний скорости. Цель — ориентир, не приговор.
        </span>
      </label>
    </div>
  );
}
