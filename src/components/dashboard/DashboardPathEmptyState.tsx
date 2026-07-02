import { Link } from 'react-router-dom';
import type { PathSetupState } from '../../utils/dashboardPathSetup';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { EMPTY_STATE_NO_ENTRIES_ASSET_ID } from '../../game/manifestAssetUi';

type DashboardPathEmptyStateProps = {
  state: Exclude<PathSetupState, { kind: 'ready' }>;
};

export function DashboardPathEmptyState({ state }: DashboardPathEmptyStateProps) {
  return (
    <div
      data-testid="dashboard-path-empty-state"
      className="mt-3 overflow-hidden rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)]"
    >
      <ManifestArtScene
        assetId={EMPTY_STATE_NO_ENTRIES_ASSET_ID}
        alt="Здесь появятся первые следы маршрута"
        layout="empty-state"
        testId="empty-state-no-entries-art"
        className="rounded-none border-0 shadow-none"
      />
      <div className="px-3 py-3">
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
    </div>
  );
}
