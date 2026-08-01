import type { AppTheme, AppThemeId } from '../types/theme';

export const APP_THEMES: AppTheme[] = [
  {
    id: 'cozy',
    title: 'Светлая уютная',
    description:
      'Летний уют: дерево, сад, тёплый свет и дом. Не стерильный light mode — живое пространство, которое восстанавливается вместе с телом.',
    previewEmoji: '🌿',
  },
  {
    id: 'darkFantasy',
    title: 'Тёмное фэнтези',
    description: 'Тёмная RPG-тема с фиолетовыми, золотыми и магическими акцентами.',
    previewEmoji: '🌙',
  },
];

export const DEFAULT_APP_THEME_ID: AppThemeId = 'cozy';

export const THEME_STORAGE_KEY = 'personal-rpg-theme';

export function resolveThemeId(id?: string | null): AppThemeId {
  if (id === 'cozy' || id === 'darkFantasy') return id;
  return DEFAULT_APP_THEME_ID;
}

export function getThemeById(id: AppThemeId): AppTheme {
  return APP_THEMES.find((t) => t.id === id) ?? APP_THEMES[0]!;
}

export const THEME_SHELL_CLASS: Record<AppThemeId, string> = {
  cozy: 'cozy-shell min-h-screen text-[var(--app-text)] transition-colors duration-300',
  darkFantasy:
    'min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.10),transparent_28%),var(--app-bg)] text-[var(--app-text)] transition-colors duration-300',
};
