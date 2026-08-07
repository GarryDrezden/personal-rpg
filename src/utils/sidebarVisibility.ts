import type { AppSettings } from '../types';
import type {
  SidebarVisibilityKey,
  SidebarVisibilitySettings,
  ThemeSidebarSettings,
} from '../types/sidebar';
import type { AppThemeId } from '../types/theme';
import {
  DEFAULT_SIDEBAR_VISIBILITY,
  DEFAULT_THEME_SIDEBAR_SETTINGS,
  SIDEBAR_VISIBILITY_KEYS,
} from '../constants/sidebarVisibility';
import { resolveThemeId } from '../constants/themes';

function asBool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

export function normalizeSidebarVisibilitySettings(
  raw?: Partial<SidebarVisibilitySettings> | null,
): SidebarVisibilitySettings {
  const base = { ...DEFAULT_SIDEBAR_VISIBILITY };
  if (!raw || typeof raw !== 'object') return base;
  for (const key of SIDEBAR_VISIBILITY_KEYS) {
    base[key] = asBool(raw[key], base[key]);
  }
  return base;
}

/** Safe normalize for missing/partial legacy payloads — all optional items default off. */
export function normalizeThemeSidebarSettings(
  raw?: Partial<Record<string, Partial<SidebarVisibilitySettings>>> | null,
): ThemeSidebarSettings {
  if (!raw || typeof raw !== 'object') {
    return {
      cozy: { ...DEFAULT_SIDEBAR_VISIBILITY },
      darkFantasy: { ...DEFAULT_SIDEBAR_VISIBILITY },
    };
  }
  return {
    cozy: normalizeSidebarVisibilitySettings(raw.cozy),
    darkFantasy: normalizeSidebarVisibilitySettings(raw.darkFantasy),
  };
}

export function getSidebarVisibilityForTheme(
  settings: Pick<AppSettings, 'sidebarVisibility'> | AppSettings | null | undefined,
  themeId: AppThemeId,
): SidebarVisibilitySettings {
  const normalized = normalizeThemeSidebarSettings(settings?.sidebarVisibility);
  return normalized[resolveThemeId(themeId)];
}

export function isSidebarOptionalVisible(
  settings: Pick<AppSettings, 'sidebarVisibility'> | AppSettings | null | undefined,
  themeId: AppThemeId,
  key: SidebarVisibilityKey,
): boolean {
  return getSidebarVisibilityForTheme(settings, themeId)[key] === true;
}

export function withSidebarVisibilityToggle(
  settings: AppSettings,
  themeId: AppThemeId,
  key: SidebarVisibilityKey,
  enabled: boolean,
): AppSettings {
  const resolved = resolveThemeId(themeId);
  const sidebarVisibility = normalizeThemeSidebarSettings(settings.sidebarVisibility);
  return {
    ...settings,
    sidebarVisibility: {
      ...sidebarVisibility,
      [resolved]: {
        ...sidebarVisibility[resolved],
        [key]: enabled,
      },
    },
  };
}

export { DEFAULT_THEME_SIDEBAR_SETTINGS };
