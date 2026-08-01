import { Link } from 'react-router-dom';
import type { BaseProgressionSnapshot } from '../../types/baseV1';
import { getThemeTerm } from '../../constants/themeTerms';
import { getBaseStageManifestAssetId } from '../../game/manifestAssetUi';
import { useAppTheme } from '../../hooks/useAppTheme';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { CozyArtPlaceholder } from '../game/CozyArtPlaceholder';
import { ProgressBar } from '../ui/ProgressBar';

type BaseDashboardSummaryProps = {
  snapshot: BaseProgressionSnapshot;
  compact?: boolean;
};

export function BaseDashboardSummary({ snapshot, compact = false }: BaseDashboardSummaryProps) {
  const { themeId, isCozy } = useAppTheme();
  const { currentStage, nextStage, progressPercent, flavorText } = snapshot;
  const stageArtId = getBaseStageManifestAssetId(currentStage.id);

  return (
    <section
      data-testid="base-dashboard-summary"
      className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80 px-4 py-3"
    >
      {stageArtId && !compact ? (
        isCozy ? (
          <CozyArtPlaceholder
            label={currentStage.title}
            layout="banner"
            className="mb-3"
            testId="base-dashboard-art"
          />
        ) : (
          <ManifestArtScene
            assetId={stageArtId}
            alt={currentStage.title}
            compact
            className="mb-3"
            testId="base-dashboard-art"
          />
        )
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
            {getThemeTerm(themeId, 'camp')}
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[var(--app-text)]">
            <span aria-hidden>{currentStage.icon}</span>
            <span className="truncate">{currentStage.title}</span>
          </p>
        </div>
        {nextStage ? (
          <span className="text-xs text-[var(--app-text-muted)]">
            {progressPercent}% до «{nextStage.shortTitle}»
          </span>
        ) : (
          <span className="text-xs text-[var(--app-gold)]">Максимальная стадия</span>
        )}
      </div>

      {nextStage ? (
        <div className="mt-2">
          <ProgressBar value={progressPercent} max={100} />
        </div>
      ) : null}

      <p className="mt-2 text-xs text-[var(--app-text-muted)] line-clamp-2">
        {compact
          ? `${isCozy ? 'День' : 'Маршрут'}: ${snapshot.recentContributors.slice(0, 2).join(', ')}.`
          : `${isCozy ? 'Ритм укрепился' : 'Маршрут укрепился'}: ${snapshot.recentContributors.join(', ')}.`}
      </p>
      {!compact ? (
        <p className="mt-1 text-xs text-[var(--app-text-muted)] line-clamp-2">{flavorText}</p>
      ) : null}

      <Link
        to="/growth/camp"
        className="mt-2 inline-block text-xs font-semibold text-[var(--app-primary)] hover:underline"
      >
        {compact ? getThemeTerm(themeId, 'campStages') : `Все ${getThemeTerm(themeId, 'campStages').toLowerCase()}`}
      </Link>
    </section>
  );
}
