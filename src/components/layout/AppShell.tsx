import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar, SIDEBAR_MARGIN } from './Sidebar';
import { ThemeShell } from './ThemeShell';
import { LegacyImportBanner } from '../auth/LegacyImportBanner';

function isJourneyRoute(pathname: string): boolean {
  return pathname === '/journey' || pathname.endsWith('/journey');
}

export function AppShell() {
  const { pathname } = useLocation();
  const journeyPage = isJourneyRoute(pathname);

  return (
    <ThemeShell>
      <Sidebar />
      <main className={`${SIDEBAR_MARGIN} overflow-x-hidden pb-[4.75rem] md:pb-8`}>
        <div
          className={
            journeyPage
              ? 'w-full px-4 py-6 md:px-6'
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
