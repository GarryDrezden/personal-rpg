import { Card } from '../ui/Card';
import { InstantSettingRow } from './InstantSettingRow';
import { useAppStore } from '../../store/appStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  SIDEBAR_OPTIONAL_META,
  themeLabelForSidebar,
} from '../../constants/sidebarVisibility';
import {
  getSidebarVisibilityForTheme,
  withSidebarVisibilityToggle,
} from '../../utils/sidebarVisibility';
import type { SidebarVisibilityKey } from '../../types/sidebar';

export function SidebarVisibilitySettingsCard() {
  const { settings, saveSettings } = useAppStore();
  const { themeId } = useAppTheme();
  const visibility = getSidebarVisibilityForTheme(settings, themeId);
  const themeLabel = themeLabelForSidebar(themeId);

  const handleToggle = async (key: SidebarVisibilityKey, next: boolean) => {
    await saveSettings(withSidebarVisibilityToggle(settings, themeId, key, next));
  };

  return (
    <Card id="settings-sidebar" className="scroll-mt-28" data-testid="settings-sidebar-visibility">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
        Интерфейс → Боковое меню
      </p>
      <h2 className="mt-1 font-semibold text-[var(--app-text)]">Дополнительные разделы</h2>
      <p className="mt-2 text-sm text-[var(--app-text-muted)]">
        Выбери разделы и элементы интерфейса, которые хочешь видеть. Скрытые страницы не
        удаляются — их можно снова включить в любой момент.
      </p>
      <p className="mt-2 text-sm font-medium text-[var(--app-text)]" data-testid="sidebar-theme-label">
        Настройки для темы: {themeLabel}
      </p>
      <p className="mt-1 text-xs text-[var(--app-text-muted)]">
        Дополнительные разделы теперь можно включать здесь. Для каждой темы настройки свои.
      </p>

      <div className="mt-4 space-y-3">
        {SIDEBAR_OPTIONAL_META.map((item) => (
          <div
            key={item.key}
            className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-4"
          >
            <InstantSettingRow
              title={item.title}
              description={item.description}
              checked={visibility[item.key]}
              onChange={(next) => handleToggle(item.key, next)}
              testId={`sidebar-vis-${item.key}`}
              toggleTestId={`sidebar-vis-${item.key}-toggle`}
              statusTestId={`sidebar-vis-${item.key}-status`}
              savedMessage={(next) =>
                next ? `${item.title}: показано в меню` : `${item.title}: скрыто из меню`
              }
              errorMessage="Не удалось сохранить настройку меню"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
