import { Link } from 'react-router-dom';
import type { BaseProgressionSnapshot } from '../../types/baseV1';
import { getThemeTerm } from '../../constants/themeTerms';
import { getBaseStageManifestAssetId } from '../../game/manifestAssetUi';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  CampaignDashboardCardHeader,
  CampaignDashboardCardShell,
} from '../campaign/CampaignDashboardCardShell';
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
  const nextStageArtId = nextStage ? getBaseStageManifestAssetId(nextStage.id) : undefined;
  const focusStage = nextStage ?? currentStage;
  const focusArtId = nextStageArtId ?? stageArtId;

  const routeLine = compact
    ? `${isCozy ? 'День' : 'Маршрут'}: ${snapshot.recentContributors.slice(0, 2).join(', ')}.`
    : `${isCozy ? 'Ритм укрепился' : 'Маршрут укрепился'}: ${snapshot.recentContributors.join(', ')}.`;

  const art = stageArtId ? (
    isCozy ? (
      <CozyArtPlaceholder
        label={currentStage.title}
        layout="banner"
        testId="base-dashboard-art"
        className="rounded-none border-0"
      />
    ) : (
      <ManifestArtScene
        assetId={stageArtId}
        alt={currentStage.title}
        layout="reward-banner"
        testId="base-dashboard-art"
        className="rounded-none border-0 shadow-none"
      />
    )
  ) : (
    <div
      className="flex h-[5.25rem] w-full items-center justify-center bg-[var(--app-bg-soft)] sm:h-[7.5rem] md:h-[10rem]"
      data-testid="base-dashboard-art"
      aria-hidden
    />
  );

  return (
    <CampaignDashboardCardShell
      testId="base-dashboard-summary"
      art={art}
      artCaption={currentStage.shortTitle || currentStage.title}
    >
      <CampaignDashboardCardHeader
        eyebrow={getThemeTerm(themeId, 'camp')}
        title={
          <span className="inline-flex max-w-full items-center gap-2">
            <span aria-hidden>{currentStage.icon}</span>
            <span className="truncate">{currentStage.title}</span>
          </span>
        }
        meta={
          nextStage
            ? `${progressPercent}% до «${nextStage.shortTitle}»`
            : 'Максимальная стадия'
        }
      />

      <p className="mt-1 text-xs text-[var(--app-text-muted)] line-clamp-2">{routeLine}</p>

      <div className="mt-2">
        <ProgressBar value={nextStage ? progressPercent : 100} max={100} />
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">
          {nextStage
            ? `Стадия ${currentStage.level} → ${nextStage.level}`
            : `Стадия ${currentStage.level} · максимум`}
        </p>
      </div>

      {!compact ? (
        <p className="mt-2 text-xs text-[var(--app-text-muted)] line-clamp-2">{flavorText}</p>
      ) : null}

      <div
        className="mt-auto border-t border-[var(--app-border)]/60 pt-2"
        data-testid="dashboard-camp-stage-summary"
      >
        <div className="flex items-start gap-3">
          {isCozy ? (
            <CozyArtPlaceholder
              label={focusStage.title}
              layout="compact"
              testId="base-next-stage-art"
            />
          ) : focusArtId ? (
            <ManifestArtScene
              assetId={focusArtId}
              alt={focusStage.title}
              layout="boss-compact"
              testId="base-next-stage-art"
              dimmed={Boolean(nextStage)}
            />
          ) : (
            <span aria-hidden className="shrink-0 text-base">
              {focusStage.icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[var(--app-text)]">{focusStage.title}</p>
            <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
              {nextStage ? 'Следующая стадия лагеря' : 'Текущая стадия лагеря'}
            </p>
            {nextStage ? (
              <div className="mt-1.5">
                <ProgressBar value={progressPercent} max={100} />
              </div>
            ) : null}
            <Link
              to="/growth/camp"
              className="mt-1 inline-block text-xs font-semibold text-[var(--app-primary)] hover:underline"
            >
              {getThemeTerm(themeId, 'campStages')}
            </Link>
          </div>
        </div>
      </div>
    </CampaignDashboardCardShell>
  );
}
