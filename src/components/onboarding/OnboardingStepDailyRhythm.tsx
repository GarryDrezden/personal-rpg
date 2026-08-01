import type { OnboardingDraft } from '../../types/onboarding';
import type { NutritionTrackingMode } from '../../types/nutrition';
import { ONBOARDING_DEFAULT_STEPS } from '../../utils/onboardingDefaults';

const inputClassName =
  'w-full rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3 text-base text-[var(--app-text)] placeholder:text-[var(--app-text-muted)] focus:border-[var(--app-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--app-primary)]/25';

const NUTRITION_MODES: { mode: NutritionTrackingMode; title: string; hint: string }[] = [
  { mode: 'disabled', title: 'Не считать', hint: 'Питание вне фокуса' },
  { mode: 'simple', title: 'Примерно', hint: 'Лёгкий уровень без калорий' },
  { mode: 'precise', title: 'Точно по калориям', hint: 'Лимит и более точный учёт' },
];

type OnboardingStepDailyRhythmProps = {
  draft: OnboardingDraft;
  onChange: (patch: Partial<OnboardingDraft>) => void;
};

function ToggleRow({
  label,
  checked,
  testId,
  onToggle,
}: {
  label: string;
  checked: boolean;
  testId: string;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onToggle}
      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
        checked
          ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
          : 'border-[var(--app-border)] bg-[var(--app-bg)]'
      }`}
    >
      <span className="font-medium text-[var(--app-text)]">{label}</span>
      <span className="text-xs text-[var(--app-text-muted)]">{checked ? 'Вкл' : 'Выкл'}</span>
    </button>
  );
}

export function OnboardingStepDailyRhythm({
  draft,
  onChange,
}: OnboardingStepDailyRhythmProps) {
  const nutritionMode = draft.nutritionTrackingMode ?? 'simple';

  return (
    <div data-testid="onboarding-step-rhythm" className="mt-5 space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[var(--app-text)]">Шаги · минимум</span>
          <input
            type="number"
            inputMode="numeric"
            data-testid="onboarding-steps-min"
            value={draft.stepsMinimum ?? ONBOARDING_DEFAULT_STEPS.minimum}
            onChange={(e) =>
              onChange({
                stepsMinimum: e.target.value
                  ? Number(e.target.value)
                  : ONBOARDING_DEFAULT_STEPS.minimum,
              })
            }
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[var(--app-text)]">Шаги · норма</span>
          <input
            type="number"
            inputMode="numeric"
            data-testid="onboarding-steps-normal"
            value={draft.stepsNormal ?? ONBOARDING_DEFAULT_STEPS.normal}
            onChange={(e) =>
              onChange({
                stepsNormal: e.target.value
                  ? Number(e.target.value)
                  : ONBOARDING_DEFAULT_STEPS.normal,
              })
            }
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-[var(--app-text)]">Шаги · отлично</span>
          <input
            type="number"
            inputMode="numeric"
            data-testid="onboarding-steps-excellent"
            value={draft.stepsExcellent ?? ONBOARDING_DEFAULT_STEPS.excellent}
            onChange={(e) =>
              onChange({
                stepsExcellent: e.target.value
                  ? Number(e.target.value)
                  : ONBOARDING_DEFAULT_STEPS.excellent,
              })
            }
            className={inputClassName}
          />
        </label>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Питание</p>
        <div className="grid gap-2">
          {NUTRITION_MODES.map((opt) => (
            <button
              key={opt.mode}
              type="button"
              data-testid={`onboarding-nutrition-${opt.mode}`}
              onClick={() => onChange({ nutritionTrackingMode: opt.mode })}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                nutritionMode === opt.mode
                  ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                  : 'border-[var(--app-border)] bg-[var(--app-bg)]'
              }`}
            >
              <span className="block font-semibold">{opt.title}</span>
              <span className="mt-0.5 block text-sm text-[var(--app-text-muted)]">
                {opt.hint}
              </span>
            </button>
          ))}
        </div>
        {nutritionMode === 'precise' ? (
          <label className="mt-3 block space-y-1.5">
            <span className="text-sm font-medium text-[var(--app-text)]">Лимит калорий</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="Например, 2800"
              data-testid="onboarding-calorie-limit"
              value={draft.dailyCalorieLimit ?? ''}
              onChange={(e) =>
                onChange({
                  dailyCalorieLimit: e.target.value ? Number(e.target.value) : null,
                })
              }
              className={inputClassName}
            />
          </label>
        ) : null}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-[var(--app-text)]">Трекеры</p>
        <ToggleRow
          label="Алкоголь"
          testId="onboarding-toggle-alcohol"
          checked={draft.alcoholTrackingEnabled ?? true}
          onToggle={() =>
            onChange({ alcoholTrackingEnabled: !(draft.alcoholTrackingEnabled ?? true) })
          }
        />
        <ToggleRow
          label="Сон / ресурс"
          testId="onboarding-toggle-sleep"
          checked={
            draft.sleepTrackingEnabled ?? draft.resourceTrackingEnabled ?? false
          }
          onToggle={() => {
            const next = !(
              draft.sleepTrackingEnabled ?? draft.resourceTrackingEnabled ?? false
            );
            onChange({
              sleepTrackingEnabled: next,
              resourceTrackingEnabled: next,
            });
          }}
        />
        <ToggleRow
          label="Физическая активность"
          testId="onboarding-toggle-pa"
          checked={draft.physicalActivityEnabled ?? true}
          onToggle={() =>
            onChange({
              physicalActivityEnabled: !(draft.physicalActivityEnabled ?? true),
            })
          }
        />
      </div>
    </div>
  );
}
