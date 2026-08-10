import { useAppStore } from '../store/appStore';
import { useAppTheme } from './useAppTheme';
import { isSidebarOptionalVisible } from '../utils/sidebarVisibility';

/** Whether companion / pet chrome should render for the active theme. */
export function useCompanionsVisible(): boolean {
  const { themeId } = useAppTheme();
  const settings = useAppStore((s) => s.settings);
  return isSidebarOptionalVisible(settings, themeId, 'companions');
}
