import type {
  SidebarVisibilityKey,
  SidebarVisibilitySettings,
  ThemeSidebarSettings,
} from '../types/sidebar';
import type { AppThemeId } from '../types/theme';

export const SIDEBAR_VISIBILITY_KEYS: SidebarVisibilityKey[] = [
  'chronicle',
  'skillMap',
  'momentum',
  'heroGrowth',
];

export const DEFAULT_SIDEBAR_VISIBILITY: SidebarVisibilitySettings = {
  chronicle: false,
  skillMap: false,
  momentum: false,
  heroGrowth: false,
};

export const DEFAULT_THEME_SIDEBAR_SETTINGS: ThemeSidebarSettings = {
  cozy: { ...DEFAULT_SIDEBAR_VISIBILITY },
  darkFantasy: { ...DEFAULT_SIDEBAR_VISIBILITY },
};

export type SidebarOptionalMeta = {
  key: SidebarVisibilityKey;
  title: string;
  description: string;
};

/** Settings toggle rows — order matches desired UX. */
export const SIDEBAR_OPTIONAL_META: SidebarOptionalMeta[] = [
  {
    key: 'chronicle',
    title: 'Летопись',
    description: 'История сезонов и пройденных арок.',
  },
  {
    key: 'skillMap',
    title: 'Карта навыков',
    description: 'Расширенная карта развития героя.',
  },
  {
    key: 'momentum',
    title: 'Инерция',
    description: 'Подробное состояние устойчивости маршрута.',
  },
  {
    key: 'heroGrowth',
    title: 'Рост героя',
    description: 'Дополнительный экран долгосрочного прогресса.',
  },
];

export function themeLabelForSidebar(themeId: AppThemeId): string {
  return themeId === 'darkFantasy' ? 'Dark Fantasy' : 'Cozy';
}
