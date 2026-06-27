import { Link } from 'react-router-dom';
import type { PathSetupState } from '../../utils/dashboardPathSetup';

type DashboardPathEmptyStateProps = {
  state: Exclude<PathSetupState, { kind: 'ready' }>;
};

export function DashboardPathEmptyState({ state }: DashboardPathEmptyStateProps) {
  return (
    <div
      data-testid="dashboard-path-empty-state"
      className="mt-3 rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-3 py-3"
    >
      <p className="text-sm font-semibold text-[var(--app-text)]">{state.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
        {state.description}
      </p>
      <Link
        to={state.ctaRoute}
        className="mt-3 inline-flex rounded-lg bg-[var(--app-primary)] px-3 py-2 text-sm font-semibold text-slate-950 transition hover:brightness-105"
      >
        {state.ctaLabel} →
      </Link>
    </div>
  );
}
