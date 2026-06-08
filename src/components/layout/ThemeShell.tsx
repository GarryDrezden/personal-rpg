import type { ReactNode } from 'react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { THEME_SHELL_CLASS } from '../../constants/themes';

export function ThemeShell({ children }: { children: ReactNode }) {
  const { themeId } = useAppTheme();

  return (
    <div data-theme={themeId} className={THEME_SHELL_CLASS[themeId]}>
      {children}
    </div>
  );
}
