import { useCallback } from 'react';
import type { AppThemeId } from '../../types/theme';
import { ThemeSelector } from './ThemeSelector';
import { AutosaveStatus } from '../ui/AutosaveStatus';
import { SettingsSection } from './SettingsSection';
import { SETTINGS_SECTION_IDS } from './settingsTocSections';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAutosaveStatus } from '../../hooks/useAutosaveStatus';

export function ThemeSettingsSection() {
  const { themeId, setThemeId } = useAppTheme();
  const {
    status: themeSaveStatus,
    message: themeSaveMessage,
    showSaving: showThemeSaving,
    showSaved: showThemeSaved,
    showError: showThemeError,
  } = useAutosaveStatus();

  const handleThemeChange = useCallback(
    async (nextId: AppThemeId) => {
      if (nextId === themeId) return;
      showThemeSaving();
      try {
        await setThemeId(nextId);
        showThemeSaved('Тема сохранена');
      } catch {
        showThemeError('Не удалось сохранить тему');
      }
    },
    [themeId, setThemeId, showThemeSaving, showThemeSaved, showThemeError],
  );

  return (
    <SettingsSection id={SETTINGS_SECTION_IDS.theme} testId="setting-row-theme">
      <h2 className="mb-2 font-semibold text-[var(--app-text)]">Внешний вид</h2>
      <p className="mb-4 text-sm text-[var(--app-text-muted)]">
        Выберите визуальную тему интерфейса. Настройка сохраняется автоматически.
      </p>
      <ThemeSelector value={themeId} onChange={(id) => void handleThemeChange(id)} />
      <AutosaveStatus
        status={themeSaveStatus}
        message={themeSaveMessage}
        data-testid="theme-autosave-status"
      />
    </SettingsSection>
  );
}
