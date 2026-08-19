import { NumberInput } from '../ui/NumberInput';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import type { SettingsDraft } from '../../hooks/useSettingsDraft';

type DraftSectionProps = {
  draft: SettingsDraft;
};

export function ProgressCharacterSettingsSection({ draft }: DraftSectionProps) {
  const { local, patchLocal } = draft;
  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.weight}>
      <h2 className="mb-4 font-semibold">Персонаж прогресса</h2>
      <div className="space-y-4">
        <NumberInput
          label="Целевой вес (кг)"
          value={local.targetWeight ?? local.weightGoal}
          onChange={(value) =>
            patchLocal({
              weightGoal: value ?? 100,
              targetWeight: value ?? 100,
            })
          }
        />
        <p className="text-xs text-[var(--app-text-muted)]">
          Стадии героя (1–20) считаются по проценту пути от стартового веса к цели. Используется
          лучший достигнутый вес, чтобы временный скачок не откатывал визуальную стадию.
        </p>
      </div>
    </SettingsSection>
  );
}

export function DefaultGoalsSettingsSection({ draft }: DraftSectionProps) {
  const { local, patchLocal } = draft;
  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.defaults}>
      <h2 className="mb-4 font-semibold">Цели по умолчанию</h2>
      <div className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Калории/день"
          value={local.defaultCaloriesLimit}
          onChange={(value) => patchLocal({ defaultCaloriesLimit: value ?? 2500 })}
        />
        <NumberInput
          label="Минимум шагов"
          value={local.defaultStepsMinimum ?? 7000}
          onChange={(value) => patchLocal({ defaultStepsMinimum: value ?? 7000 })}
        />
        <NumberInput
          label="Норма шагов"
          value={local.defaultStepsNormal ?? local.defaultStepsGoal}
          onChange={(value) =>
            patchLocal({ defaultStepsNormal: value ?? 11500, defaultStepsGoal: value ?? 11500 })
          }
        />
        <NumberInput
          label="Отлично шагов"
          value={local.defaultStepsExcellent ?? 14000}
          onChange={(value) => patchLocal({ defaultStepsExcellent: value ?? 14000 })}
        />
        <NumberInput
          label="Зал/неделя"
          value={local.defaultGymTarget}
          onChange={(value) => patchLocal({ defaultGymTarget: value ?? 2 })}
        />
        <NumberInput
          label="Очки/неделя"
          value={local.defaultWeeklyPointsGoal}
          onChange={(value) => patchLocal({ defaultWeeklyPointsGoal: value ?? 500 })}
        />
      </div>
      <p className="mt-3 text-xs text-rpg-muted">
        Минимум удерживает день, норма даёт хороший бонус, «Отлично» — максимум очков.
      </p>
    </SettingsSection>
  );
}

export function WeeklyGoalsSettingsSection({ draft }: DraftSectionProps) {
  const { local, addWeek, updateWeek, removeWeek } = draft;
  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.weeks}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Цели по неделям</h2>
        <button onClick={addWeek} className="text-sm font-medium text-gold">
          + Неделя
        </button>
      </div>
      {local.weeklySettings.map((week) => (
        <div key={week.id} className="mb-4 space-y-2 rounded-xl border border-rpg-border p-3">
          <div className="flex justify-between">
            <label className="text-sm">
              Начало недели
              <input
                type="date"
                value={week.weekStart}
                onChange={(event) => updateWeek(week.id, { weekStart: event.target.value })}
                className="ml-2 rounded border px-2 py-1"
              />
            </label>
            <button onClick={() => removeWeek(week.id)} className="text-sm text-danger">
              Удалить
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <NumberInput
              label="Калории"
              value={week.caloriesLimit}
              onChange={(value) => updateWeek(week.id, { caloriesLimit: value ?? 2500 })}
            />
            <NumberInput
              label="Мин. шагов"
              value={week.stepsMinimum ?? local.defaultStepsMinimum ?? 7000}
              onChange={(value) => updateWeek(week.id, { stepsMinimum: value ?? 7000 })}
            />
            <NumberInput
              label="Норма шагов"
              value={week.stepsNormal ?? week.stepsGoal}
              onChange={(value) =>
                updateWeek(week.id, { stepsNormal: value ?? 11500, stepsGoal: value ?? 11500 })
              }
            />
            <NumberInput
              label="Отлично шагов"
              value={week.stepsExcellent ?? local.defaultStepsExcellent ?? 14000}
              onChange={(value) => updateWeek(week.id, { stepsExcellent: value ?? 14000 })}
            />
            <NumberInput
              label="Зал"
              value={week.gymTarget}
              onChange={(value) => updateWeek(week.id, { gymTarget: value ?? 2 })}
            />
            <NumberInput
              label="Очки"
              value={week.weeklyPointsGoal}
              onChange={(value) => updateWeek(week.id, { weeklyPointsGoal: value ?? 500 })}
            />
          </div>
        </div>
      ))}
    </SettingsSection>
  );
}
