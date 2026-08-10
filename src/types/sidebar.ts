import type { AppThemeId } from './theme';

/** Opt-in sidebar sections — extend carefully for future advanced screens. */
export type SidebarVisibilityKey =
  | 'chronicle'
  | 'skillMap'
  | 'momentum'
  | 'heroGrowth'
  | 'companions';

export type SidebarVisibilitySettings = Record<SidebarVisibilityKey, boolean>;

export type ThemeSidebarSettings = Record<AppThemeId, SidebarVisibilitySettings>;
