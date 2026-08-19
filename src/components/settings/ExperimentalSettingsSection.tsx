import { InstantSettingRow } from './InstantSettingRow';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import { useAppStore } from '../../store/appStore';

export function ExperimentalSettingsSection() {
  const sleepTrackingEnabled = useAppStore((s) => s.settings.enableSleepTracking) ?? false;

  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.experimental}>
      <h2 className="mb-2 font-semibold text-[var(--app-text)]">Экспериментальные функции</h2>
      <div className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-4">
        <InstantSettingRow
          title="Учёт сна"
          description="Добавляет сон как необязательный фактор инерции. Если сон не заполнен, день не считается хуже."
          hint={
            sleepTrackingEnabled
              ? 'Поля сна появятся на странице дня.'
              : 'Старые данные сна останутся в записях, но поля будут скрыты.'
          }
          checked={sleepTrackingEnabled}
          onChange={async (next) => {
            const latest = useAppStore.getState();
            await latest.saveSettings({
              ...latest.settings,
              enableSleepTracking: next,
            });
          }}
          testId="setting-row-sleep-tracking"
          toggleTestId="sleep-tracking-toggle"
          statusTestId="sleep-autosave-status"
          savedMessage={(next) => (next ? 'Учёт сна включён' : 'Учёт сна выключен')}
          errorMessage="Не удалось сохранить настройку сна"
        />
      </div>
    </SettingsSection>
  );
}
