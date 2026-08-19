import { Link } from 'react-router-dom';
import { CompanionSelector } from '../game/CompanionSelector';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import { setActiveCompanionId } from '../../game/gameAssetStorage';
import type { CompanionId, HeroGender, TransformationMode } from '../../types/gameAssets';
import { isSidebarOptionalVisible } from '../../utils/sidebarVisibility';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import type { SettingsDraft } from '../../hooks/useSettingsDraft';

type GameHeroSettingsSectionProps = {
  draft: SettingsDraft;
};

export function GameHeroSettingsSection({ draft }: GameHeroSettingsSectionProps) {
  const { local, patchLocal } = draft;
  const { settings } = useAppStore();
  const { themeId } = useAppTheme();
  const companionsEnabled = isSidebarOptionalVisible(settings, themeId, 'companions');

  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.gameHero}>
      <h2 className="mb-4 font-semibold">Игровой герой</h2>
      <div className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Пол персонажа</p>
          <div className="flex gap-2">
            {(['male', 'female'] as HeroGender[]).map((gender) => (
              <button
                key={gender}
                type="button"
                onClick={() =>
                  patchLocal({
                    heroGender: gender,
                    gender,
                  })
                }
                className={`rounded-xl px-4 py-2 text-sm font-medium ${
                  (local.heroGender ?? local.gender) === gender
                    ? 'bg-[var(--app-primary)] text-slate-950'
                    : 'border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)]'
                }`}
              >
                {gender === 'male' ? 'Мужчина' : 'Женщина'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Режим трансформации</p>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'weight_loss' as TransformationMode, label: 'Похудение' },
                { id: 'muscle_gain' as TransformationMode, label: 'Набор мышц (позже)' },
                { id: 'recomposition' as TransformationMode, label: 'Рекомпозиция (позже)' },
              ] as const
            ).map((mode) => {
              const disabled = mode.id !== 'weight_loss';
              return (
                <button
                  key={mode.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => patchLocal({ transformationMode: mode.id })}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    (local.transformationMode ?? 'weight_loss') === mode.id
                      ? 'bg-[var(--app-primary)] text-slate-950'
                      : 'border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-muted)]'
                  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  {mode.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-[var(--app-text)]">Активный спутник</p>
          {companionsEnabled ? (
            <CompanionSelector
              value={local.activeCompanionId ?? 'golden_chinchilla_cat'}
              onChange={(id: CompanionId) => {
                setActiveCompanionId(id);
                patchLocal({ activeCompanionId: id });
              }}
              compact
            />
          ) : (
            <p className="text-sm text-[var(--app-text-muted)]">
              Питомцы выключены.{' '}
              <Link to="/settings#settings-sidebar" className="text-[var(--app-primary)] hover:underline">
                Включить в «Дополнительные разделы»
              </Link>
              . Игровые функции спутников пока не подключены.
            </p>
          )}
        </div>
      </div>
    </SettingsSection>
  );
}
