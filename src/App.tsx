import { useEffect, lazy, Suspense } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';

import { TodayPage } from './pages/TodayPage';

import { AchievementToastHost } from './components/achievements/AchievementToastHost';

import { BodyAbilityUnlockHost } from './components/bodyAbilities/BodyAbilityUnlockHost';

import { FreedomLevelUnlockHost } from './components/freedom/FreedomLevelUnlockHost';

import { MomentumCoinHost } from './components/momentum/MomentumCoinHost';

import { PageLoader } from './components/ui/PageLoader';

import { useAppStore } from './store/appStore';



const WeekPage = lazy(() =>

  import('./pages/WeekPage').then((m) => ({ default: m.WeekPage })),

);

const MeasurementsPage = lazy(() =>

  import('./pages/MeasurementsPage').then((m) => ({ default: m.MeasurementsPage })),

);

const RewardsPage = lazy(() =>

  import('./pages/RewardsPage').then((m) => ({ default: m.RewardsPage })),

);

const SettingsPage = lazy(() =>

  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),

);

const AchievementsPage = lazy(() =>

  import('./pages/AchievementsPage').then((m) => ({ default: m.AchievementsPage })),

);

const SkillsPage = lazy(() =>

  import('./pages/SkillsPage').then((m) => ({ default: m.SkillsPage })),

);

const ProgressMapPage = lazy(() =>

  import('./pages/ProgressMapPage').then((m) => ({ default: m.ProgressMapPage })),

);

const WeeklyReportsPage = lazy(() =>

  import('./pages/WeeklyReportsPage').then((m) => ({ default: m.WeeklyReportsPage })),

);

const InsightsPage = lazy(() =>

  import('./pages/InsightsPage').then((m) => ({ default: m.InsightsPage })),

);

const BossesPage = lazy(() =>

  import('./pages/BossesPage').then((m) => ({ default: m.BossesPage })),

);

const BodyAbilitiesPage = lazy(() =>

  import('./pages/BodyAbilitiesPage').then((m) => ({ default: m.BodyAbilitiesPage })),

);

const JourneyMapPage = lazy(() =>

  import('./pages/JourneyMapPage').then((m) => ({ default: m.JourneyMapPage })),

);

const FreedomPage = lazy(() =>

  import('./pages/FreedomPage').then((m) => ({ default: m.FreedomPage })),

);

const MomentumPage = lazy(() =>

  import('./pages/MomentumPage').then((m) => ({ default: m.MomentumPage })),

);

const FaqPage = lazy(() =>

  import('./pages/FaqPage').then((m) => ({ default: m.FaqPage })),

);

const GameCodexPage = lazy(() =>

  import('./pages/GameCodexPage').then((m) => ({ default: m.GameCodexPage })),

);



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

      <Suspense fallback={<PageLoader />}>

        <Routes>

          <Route element={<AppShell />}>

            <Route path="/" element={<DashboardPage />} />

            <Route path="/today" element={<TodayPage />} />

            <Route path="/week" element={<WeekPage />} />

            <Route path="/bosses" element={<BossesPage />} />

            <Route path="/measurements" element={<MeasurementsPage />} />

            <Route path="/rewards" element={<RewardsPage />} />

            <Route path="/achievements" element={<AchievementsPage />} />

            <Route path="/skills" element={<SkillsPage />} />

            <Route path="/abilities" element={<BodyAbilitiesPage />} />

            <Route path="/journey" element={<JourneyMapPage />} />

            <Route path="/freedom" element={<FreedomPage />} />

            <Route path="/momentum" element={<MomentumPage />} />

            <Route path="/map" element={<ProgressMapPage />} />

            <Route path="/reports" element={<WeeklyReportsPage />} />

            <Route path="/insights" element={<InsightsPage />} />

            <Route path="/settings" element={<SettingsPage />} />

            <Route path="/faq" element={<FaqPage />} />

            <Route path="/codex" element={<GameCodexPage />} />

          </Route>

        </Routes>

      </Suspense>

      <AchievementToastHost />

      <BodyAbilityUnlockHost />

      <FreedomLevelUnlockHost />

      <MomentumCoinHost />

    </BrowserRouter>

  );

}


