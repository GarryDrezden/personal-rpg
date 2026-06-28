import { useEffect, lazy, Suspense } from 'react';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './auth/AuthProvider';

import { ProtectedRoute, GuestRoute } from './auth/ProtectedRoute';

import { AppShell } from './components/layout/AppShell';

import { DashboardPage } from './pages/DashboardPage';

import { TodayPage } from './pages/TodayPage';

import { LoginPage } from './pages/LoginPage';

import { RegisterPage } from './pages/RegisterPage';

import { AchievementToastHost } from './components/achievements/AchievementToastHost';

import { BodyAbilityUnlockHost } from './components/bodyAbilities/BodyAbilityUnlockHost';

import { FreedomLevelUnlockHost } from './components/freedom/FreedomLevelUnlockHost';

import { MomentumCoinHost } from './components/momentum/MomentumCoinHost';

import { PageLoader } from './components/ui/PageLoader';

import { SaveStatusIndicator } from './components/auth/SaveStatusIndicator';

import { useAppStore } from './store/appStore';



const GrowthHubPage = lazy(() =>

  import('./pages/GrowthHubPage').then((m) => ({ default: m.GrowthHubPage })),

);

const WeekPage = lazy(() =>

  import('./pages/WeekPage').then((m) => ({ default: m.WeekPage })),

);

const MeasurementsPage = lazy(() =>

  import('./pages/MeasurementsPage').then((m) => ({ default: m.MeasurementsPage })),

);

const SettingsPage = lazy(() =>

  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage })),

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

      <p className="font-medium text-[var(--app-danger)]">Не удалось загрузить данные</p>

      <p className="text-sm text-[var(--app-text-muted)]">{message}</p>

      <p className="max-w-md text-sm text-[var(--app-text-muted)]">

        Убедитесь, что backend запущен:{' '}

        <code className="rounded bg-[var(--app-card-strong)] px-1">npm run dev:server</code>

      </p>

    </div>

  );

}



function AuthenticatedApp() {

  const { init, loading, error } = useAppStore();



  useEffect(() => {

    void init();

  }, [init]);



  if (loading) return <LoadingScreen />;

  if (error) return <ErrorScreen message={error} />;



  return (

    <Suspense fallback={<PageLoader />}>

      <Routes>

        <Route element={<AppShell />}>

          <Route path="/" element={<DashboardPage />} />

          <Route path="/today" element={<TodayPage />} />

          <Route path="/week" element={<WeekPage />} />

          <Route path="/growth" element={<Navigate to="/growth/skills" replace />} />

          <Route path="/growth/:tab" element={<GrowthHubPage />} />

          <Route path="/skills" element={<Navigate to="/growth/skills" replace />} />

          <Route path="/abilities" element={<Navigate to="/growth/abilities" replace />} />

          <Route path="/rewards" element={<Navigate to="/growth/rewards" replace />} />

          <Route path="/achievements" element={<Navigate to="/growth/achievements" replace />} />

          <Route path="/bosses" element={<Navigate to="/growth/trials" replace />} />

          <Route path="/measurements" element={<MeasurementsPage />} />

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

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

      <AchievementToastHost />

      <BodyAbilityUnlockHost />

      <FreedomLevelUnlockHost />

      <MomentumCoinHost />

      <SaveStatusIndicator />

    </Suspense>

  );

}



export default function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>

          <Route element={<GuestRoute />}>

            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />

          </Route>

          <Route element={<ProtectedRoute />}>

            <Route path="/*" element={<AuthenticatedApp />} />

          </Route>

        </Routes>

      </BrowserRouter>

    </AuthProvider>

  );

}

