import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar, SIDEBAR_MARGIN } from './Sidebar';
import { ThemeShell } from './ThemeShell';
import { LegacyImportBanner } from '../auth/LegacyImportBanner';
import { useAppTheme } from '../../hooks/useAppTheme';

function isJourneyRoute(pathname: string): boolean {
  return pathname === '/journey' || pathname.endsWith('/journey');
}

function isDashboardRoute(pathname: string): boolean {
  return pathname === '/' || pathname === '';
}

export function AppShell() {
  const { pathname } = useLocation();
  const { isCozy } = useAppTheme();
  const journeyPage = isJourneyRoute(pathname);
  const dashboardPage = isDashboardRoute(pathname);

  return (
    <ThemeShell>
      <Sidebar />
      <main
        className={`${SIDEBAR_MARGIN} overflow-x-hidden pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-8${
          isCozy ? ' cozy-main' : ''
        }`}
      >
        <div
          className={
            journeyPage
              ? 'w-full px-4 py-6 md:px-6'
              : dashboardPage
                ? 'mx-auto max-w-7xl px-4 py-6'
                : 'mx-auto max-w-6xl px-4 py-6'
          }
        >
          <LegacyImportBanner />
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </ThemeShell>
  );
}
