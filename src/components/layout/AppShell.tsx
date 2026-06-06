import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="md:ml-60 pb-20 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
