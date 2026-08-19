import type { NutritionTrackingMode } from '../../types/nutrition';
import { NumberInput } from '../ui/NumberInput';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import type { SettingsDraft } from '../../hooks/useSettingsDraft';

type NutritionSettingsSectionProps = {
  draft: SettingsDraft;
};

const NUTRITION_OPTIONS = [
  {
    mode: 'disabled' as NutritionTrackingMode,
    title: 'Выключен',
    description: 'Питание не будет участвовать в квестах, очках и инерции.',
  },
  {
    mode: 'simple' as NutritionTrackingMode,
    title: 'Упрощённый',
    description: 'Отмечай день как лёгкий, средний или тяжёлый без точных цифр.',
  },
  {
    mode: 'precise' as NutritionTrackingMode,
    title: 'Точный',
    description: 'Вводи калории и лимит. Подходит, когда готов к более строгому контролю.',
  },
] as const;

export function NutritionSettingsSection({ draft }: NutritionSettingsSectionProps) {
  const { local, patchLocal } = draft;
  const activeMode = local.nutritionTrackingMode ?? 'simple';

  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.nutrition}>
      <h2 className="mb-2 font-semibold text-[var(--app-text)]">Учёт питания</h2>
      <p className="mb-4 text-xs text-[var(--app-text-muted)]">
        Можно вести систему без точных цифр. Честность важнее идеальности.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {NUTRITION_OPTIONS.map((option) => {
          const active = activeMode === option.mode;
          return (
            <button
              key={option.mode}
              type="button"
              onClick={() =>
                patchLocal({
                  nutritionTrackingMode: option.mode,
                  dailyCalorieLimit:
                    option.mode === 'precise'
                      ? (local.dailyCalorieLimit ?? local.defaultCaloriesLimit ?? 2500)
                      : local.dailyCalorieLimit,
                })
              }
              className={`rounded-xl border px-3 py-3 text-left transition ${
                active
                  ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)]'
                  : 'border-[var(--app-border)] bg-[var(--app-card-strong)] hover:brightness-[1.03]'
              }`}
            >
              <p className="text-sm font-semibold text-[var(--app-text)]">{option.title}</p>
              <p className="mt-1 text-xs text-[var(--app-text-muted)]">{option.description}</p>
            </button>
          );
        })}
      </div>
      {activeMode === 'precise' ? (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <NumberInput
            label="Дневной лимит калорий"
            value={local.dailyCalorieLimit ?? local.defaultCaloriesLimit}
            onChange={(value) =>
              patchLocal({
                dailyCalorieLimit: value ?? local.defaultCaloriesLimit,
              })
            }
          />
        </div>
      ) : null}
    </SettingsSection>
  );
}
