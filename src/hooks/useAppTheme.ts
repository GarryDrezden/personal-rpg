import { useCallback, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import type { AppThemeId } from '../types/theme';
import {
  getThemeById,
  resolveThemeId,
} from '../constants/themes';
import {
  applyThemeToDocument,
  setStoredThemeId,
} from '../utils/themeApply';

export function useAppTheme() {
  const settings = useAppStore((s) => s.settings);
  const themeId = resolveThemeId(settings.themeId);
  const theme = getThemeById(themeId);

  useEffect(() => {
    applyThemeToDocument(themeId);
    setStoredThemeId(themeId);
  }, [themeId]);

  const setThemeId = useCallback(async (nextId: AppThemeId) => {
    applyThemeToDocument(nextId);
    setStoredThemeId(nextId);
    const { settings: latest, saveSettings: persist } = useAppStore.getState();
    await persist({ ...latest, themeId: nextId });
  }, []);

  return {
    themeId,
    theme,
    setThemeId,
    isDarkFantasy: themeId === 'darkFantasy',
    isCozy: themeId === 'cozy',
  };
}
