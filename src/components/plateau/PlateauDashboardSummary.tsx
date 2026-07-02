import { Link } from 'react-router-dom';
import type { PlateauSnapshot } from '../../types/plateauV1';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID } from '../../game/manifestAssetUi';

type PlateauDashboardSummaryProps = {
  snapshot: PlateauSnapshot;
  onToggleManual: () => void;
  compact?: boolean;
};

export function PlateauDashboardSummary({
  snapshot,
  onToggleManual,
  compact = false,
}: PlateauDashboardSummaryProps) {
  if (snapshot.mode === 'none') return null;

  const rh = snapshot.routeHolding;

  return (
    <section
      data-testid="plateau-dashboard-summary"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      <div className="flex items-start gap-3">
        <ManifestArtScene
          assetId={PLATEAU_ARTIFACT_PASS_STONE_ASSET_ID}
          alt="Камень перевала — удержание маршрута"
          layout="artifact-icon"
          testId="plateau-artifact-art"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
                {snapshot.mode === 'active' ? 'Удержание перевала' : 'Возможный перевал'}
              </p>
              <p className="mt-1 text-sm text-[var(--app-text)]">{snapshot.title}</p>
            </div>
            {snapshot.hasWeightData ? (
              <span className="text-xs text-[var(--app-text-muted)]">
                {snapshot.daysSinceBestWeight} дн. без лучшего веса
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-[var(--app-text-muted)] line-clamp-2">
            Маршрут: {rh.routeHeldDays} дн. за {rh.windowDays}
            {compact ? '' : ` · ${snapshot.supportiveLine}`}
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 pl-[3.75rem]">
        <button
          type="button"
          onClick={onToggleManual}
          className="text-xs font-semibold text-[var(--app-primary)] hover:underline"
        >
          {snapshot.manualActive ? 'Снять отметку перевала' : 'Я на перевале'}
        </button>
        <Link to="/growth/abilities" className="text-xs text-[var(--app-primary)] hover:underline">
          Способности тела
        </Link>
      </div>
    </section>
  );
}
