import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAuth } from '../auth/useAuth';
import { needsOnboarding } from '../utils/onboardingState';

type OnboardingGateProps = {
  children: ReactNode;
};

/**
 * Redirects new users to /start until route setup is complete.
 */
export function OnboardingGate({ children }: OnboardingGateProps) {
  const location = useLocation();
  const { profile } = useAuth();
  const settings = useAppStore((s) => s.settings);
  const pending = needsOnboarding(settings, profile);

  if (pending && location.pathname !== '/start') {
    return <Navigate to="/start" replace />;
  }

  if (!pending && location.pathname === '/start') {
    return <Navigate to="/today" replace />;
  }

  return <>{children}</>;
}
