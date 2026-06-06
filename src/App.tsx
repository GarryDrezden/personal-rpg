import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { TodayPage } from './pages/TodayPage';
import { WeekPage } from './pages/WeekPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';
import { useAppStore } from './store/appStore';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-rpg-muted">Загрузка…</p>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-danger font-medium">Не удалось подключиться к API</p>
      <p className="text-sm text-rpg-muted">{message}</p>
      <p className="text-sm text-rpg-muted max-w-md">
        Убедитесь, что nginx и PHP запущены на порту 8080, или используйте{' '}
        <code className="bg-stone-100 px-1 rounded">npm run dev</code> с работающим API.
      </p>
    </div>
  );
}

export default function App() {
  const { init, loading, error } = useAppStore();

  useEffect(() => {
    void init();
  }, [init]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/week" element={<WeekPage />} />
          <Route path="/measurements" element={<MeasurementsPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
