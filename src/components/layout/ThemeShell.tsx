import type { ReactNode } from 'react';
import { useAppTheme } from '../../hooks/useAppTheme';
import { THEME_SHELL_CLASS } from '../../constants/themes';

export function ThemeShell({ children }: { children: ReactNode }) {
  const { themeId, isCozy } = useAppTheme();

  return (
    <div data-theme={themeId} className={THEME_SHELL_CLASS[themeId]}>
      {isCozy ? (
        <div className="cozy-atmosphere" aria-hidden>
          <div className="cozy-atmosphere__wash" />
          <div className="cozy-atmosphere__sun" />
          <div className="cozy-atmosphere__texture" />
          <div className="cozy-atmosphere__botanical cozy-atmosphere__botanical--tl" />
          <div className="cozy-atmosphere__botanical cozy-atmosphere__botanical--br" />
          <div className="cozy-atmosphere__vignette" />
        </div>
      ) : null}
      {children}
    </div>
  );
}
