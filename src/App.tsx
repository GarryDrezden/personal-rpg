import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { TodayPage } from './pages/TodayPage';
import { WeekPage } from './pages/WeekPage';
import { MeasurementsPage } from './pages/MeasurementsPage';
import { RewardsPage } from './pages/RewardsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AchievementsPage } from './pages/AchievementsPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProgressMapPage } from './pages/ProgressMapPage';
import { WeeklyReportsPage } from './pages/WeeklyReportsPage';
import { InsightsPage } from './pages/InsightsPage';
import { AchievementToastHost } from './components/achievements/AchievementToastHost';
import { useAppStore } from './store/appStore';

function LoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
      <p className="text-[var(--app-text-muted)]">Загрузка…</p>
    </div>
  );
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[var(--app-bg)] p-6 text-center text-[var(--app-text)]">
      <p className="font-medium text-[var(--app-danger)]">Не удалось подключиться к API</p>
      <p className="text-sm text-[var(--app-text-muted)]">{message}</p>
      <p className="max-w-md text-sm text-[var(--app-text-muted)]">
        Убедитесь, что nginx и PHP запущены на порту 8080, или используйте{' '}
        <code className="rounded bg-[var(--app-card-strong)] px-1">npm run dev</code> с работающим API.
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
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/map" element={<ProgressMapPage />} />
          <Route path="/reports" element={<WeeklyReportsPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <AchievementToastHost />
    </BrowserRouter>
  );
}
