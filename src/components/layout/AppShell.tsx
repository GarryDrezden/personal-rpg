import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar, SIDEBAR_MARGIN } from './Sidebar';
import { ThemeShell } from './ThemeShell';
import { LegacyImportBanner } from '../auth/LegacyImportBanner';

export function AppShell() {
  return (
    <ThemeShell>
      <Sidebar />
      <main className={`${SIDEBAR_MARGIN} pb-[4.75rem] md:pb-8`}>
        <div className="mx-auto max-w-6xl px-4 py-6">
          <LegacyImportBanner />
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </ThemeShell>
  );
}
