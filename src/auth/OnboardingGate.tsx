import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuth } from './useAuth';
import { needsOnboarding } from '../utils/onboardingState';
import { withOnboardingCompletedFlag } from '../utils/onboardingCompletion';
import { useEffect, useRef } from 'react';

type OnboardingGateProps = {
  children: ReactNode;
};

/**
 * Redirects new users to /start until route setup is complete.
 * Legacy users with profile/progress are not forced into onboarding.
 */
export function OnboardingGate({ children }: OnboardingGateProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const settings = useAppStore((s) => s.settings);
  const saveSettings = useAppStore((s) => s.saveSettings);
  const dailyEntries = useAppStore((s) => s.dailyEntries);
  const measurements = useAppStore((s) => s.measurements);
  const hasProgressData = dailyEntries.length > 0 || measurements.length > 0;
  const pending = needsOnboarding(settings, profile, { hasProgressData });
  const migratedRef = useRef(false);

  useEffect(() => {
    if (migratedRef.current) return;
    if (settings.onboardingCompleted === true) return;
    if (pending) return;
    // Soft migration: mark legacy/progress users completed without forcing UI.
    migratedRef.current = true;
    void saveSettings(withOnboardingCompletedFlag(settings));
  }, [pending, saveSettings, settings]);

  if (pending && location.pathname !== '/start') {
    return <Navigate to="/start" replace />;
  }

  if (!pending && location.pathname === '/start') {
    return <Navigate to="/today" replace />;
  }

  return <>{children}</>;
}
