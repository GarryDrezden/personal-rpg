import type { CoinSettings, PointSettings } from '../../types';
import { NumberInput } from '../ui/NumberInput';
import { HabitsEditor } from './HabitsEditor';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import { DEFAULT_HABIT_CONFIG } from '../../utils/habitConfig';
import type { SettingsDraft } from '../../hooks/useSettingsDraft';

type DraftSectionProps = {
  draft: SettingsDraft;
};

export function CoinSettingsSection({ draft }: DraftSectionProps) {
  const { coinSettings, updateCoins, handleResetCoins } = draft;
  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.coins}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Монеты 🪙</h2>
        <button onClick={handleResetCoins} className="text-sm text-rpg-muted">
          Сбросить
        </button>
      </div>
      <p className="mb-4 text-xs text-rpg-muted">
        Награды за хорошие дни и недели. XP настраивается отдельно в блоке «Баллы».
      </p>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(coinSettings) as (keyof CoinSettings)[]).map((key) => (
          <NumberInput
            key={key}
            label={key}
            value={coinSettings[key]}
            onChange={(value) => updateCoins(key, value ?? 0)}
          />
        ))}
      </div>
    </SettingsSection>
  );
}

export function XpSettingsSection({ draft }: DraftSectionProps) {
  const { local, updatePoints, handleReset } = draft;
  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.xp}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">Баллы (XP)</h2>
        <button onClick={handleReset} className="text-sm text-rpg-muted">
          Сбросить
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(local.pointSettings) as (keyof PointSettings)[]).map((key) => (
          <NumberInput
            key={key}
            label={key}
            value={local.pointSettings[key]}
            onChange={(value) => updatePoints(key, value ?? 0)}
          />
        ))}
      </div>
    </SettingsSection>
  );
}

export function HabitsSettingsSection({ draft }: DraftSectionProps) {
  const { local, patchLocal } = draft;
  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.habits}>
      <h2 className="mb-4 font-semibold text-[var(--app-text)]">Второстепенные цели</h2>
      <HabitsEditor
        settings={local}
        onChange={(habitConfig) =>
          patchLocal({
            habitConfig: habitConfig ?? DEFAULT_HABIT_CONFIG,
          })
        }
      />
    </SettingsSection>
  );
}
