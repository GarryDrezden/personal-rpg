import {
  AVATAR_STAGES,
  AVATAR_STAGE_COUNT,
} from '../../constants/avatar';
import type { AvatarMode, AvatarStage } from '../../types/avatar';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { getAvatarImagePath } from '../../utils/avatarEngine';
import { NumberInput } from '../ui/NumberInput';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import type { SettingsDraft } from '../../hooks/useSettingsDraft';

type AvatarSettingsSectionProps = {
  draft: SettingsDraft;
};

export function AvatarSettingsSection({ draft }: AvatarSettingsSectionProps) {
  const {
    avatarSettings,
    previewStage,
    weightLossKg,
    hasWeightData,
    updateAvatar,
    updateAvatarThreshold,
    handleResetAvatar,
  } = draft;

  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.avatar}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Аватар</h2>
        <button onClick={handleResetAvatar} className="text-sm text-rpg-muted">
          Сбросить
        </button>
      </div>

      <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <AvatarDisplay
          stage={previewStage}
          gender={avatarSettings.gender}
          imagePath={getAvatarImagePath(avatarSettings.gender, previewStage)}
          weightLossKg={weightLossKg}
          hasWeightData={hasWeightData}
          compact
        />
        <div className="flex-1 space-y-4">
          <div>
            <p className="mb-2 text-sm font-medium">Тип аватара</p>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => updateAvatar({ gender })}
                  className={`flex-1 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                    avatarSettings.gender === gender
                      ? 'border-gold bg-amber-100 text-amber-900'
                      : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
                  }`}
                >
                  {gender === 'male' ? 'Мужской' : 'Женский'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Режим стадии</p>
            <div className="flex gap-2">
              {(
                [
                  { id: 'auto' as AvatarMode, label: 'Автоматически' },
                  { id: 'manual' as AvatarMode, label: 'Вручную' },
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => updateAvatar({ mode: mode.id })}
                  className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition-colors ${
                    avatarSettings.mode === mode.id
                      ? 'border-gold bg-amber-100 text-amber-900'
                      : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {avatarSettings.mode === 'manual' && (
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">Ручной этап (1–{AVATAR_STAGE_COUNT})</p>
          <div className="flex flex-wrap gap-2">
            {AVATAR_STAGES.map((stage) => (
              <button
                key={stage}
                type="button"
                onClick={() => updateAvatar({ manualStage: stage })}
                className={`h-10 w-10 rounded-xl border text-sm font-semibold transition-colors ${
                  avatarSettings.manualStage === stage
                    ? 'border-gold bg-amber-100 text-amber-900'
                    : 'border-[var(--app-border)] text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 text-sm font-medium">Пороги стадий (кг сброшено)</p>
        <p className="mb-3 text-xs text-rpg-muted">
          В автоматическом режиме выбирается максимальная стадия, где сброс веса ≥ порога.
          Этап 1 всегда начинается с 0 кг.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {AVATAR_STAGES.map((stage: AvatarStage) => (
            <NumberInput
              key={stage}
              label={`Этап ${stage}`}
              value={avatarSettings.stageThresholdsKg[stage]}
              onChange={(value) => updateAvatarThreshold(stage, value ?? 0)}
              disabled={stage === 1}
            />
          ))}
        </div>
      </div>
    </SettingsSection>
  );
}
