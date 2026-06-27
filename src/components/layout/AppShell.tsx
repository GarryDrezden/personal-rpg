import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { ThemeShell } from './ThemeShell';

export function AppShell() {
  return (
    <ThemeShell>
      <Sidebar />
      <main className="md:ml-64 pb-[4.75rem] md:pb-8">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </ThemeShell>
  );
}
