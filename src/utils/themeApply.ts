import type { AppThemeId } from '../types/theme';
import { THEME_STORAGE_KEY, resolveThemeId } from '../constants/themes';

export function getStoredThemeId(): AppThemeId | null {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return null;
    return resolveThemeId(raw);
  } catch {
    return null;
  }
}

export function setStoredThemeId(themeId: AppThemeId): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {
    /* ignore */
  }
}

export function applyThemeToDocument(themeId: AppThemeId): void {
  document.documentElement.setAttribute('data-theme', themeId);
}
