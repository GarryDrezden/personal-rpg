import type { SeasonSnapshotWithRecap } from '../../game/seasons/seasonEngine';
import type { BossCampaignSnapshot } from '../../game/bosses/bossTypes';
import { getSeasonRewardStatus } from '../../game/seasons/seasonRecap';
import {
  getThemedSeasonBossPresentation,
  getThemedSeasonRewardLabel,
  getThemedSeasonRewardName,
} from '../../game/themeCampaignPresentation';
import {
  getSeasonBossManifestAssetId,
  getSeasonRewardManifestAssetId,
} from '../../game/manifestAssetUi';
import {
  getCozySeasonObstaclePath,
  getCozySeasonRewardPath,
} from '../../game/cozyCampaignArt';
import { getThemeTerm } from '../../constants/themeTerms';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  CampaignDashboardCardHeader,
  CampaignDashboardCardShell,
} from '../campaign/CampaignDashboardCardShell';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { CozyArtScene } from '../game/CozyArtScene';
import { CozyArtPlaceholder } from '../game/CozyArtPlaceholder';
import { ProgressBar } from '../ui/ProgressBar';

type SeasonDashboardSummaryProps = {
  season: SeasonSnapshotWithRecap;
  compact?: boolean;
  boss?: BossCampaignSnapshot | null;
};

export function SeasonDashboardSummary({
  season,
  compact = false,
  boss,
}: SeasonDashboardSummaryProps) {
  const { themeId, isCozy } = useAppTheme();
  const rewardStatus = getSeasonRewardStatus(season.partialStatus, false);
  const rewardName = getThemedSeasonRewardName(
    themeId,
    season.seasonIndex,
    season.config.rewardName,
  );
  const rewardLabel = getThemedSeasonRewardLabel(themeId, rewardStatus, rewardName);
  const rewardArtId = getSeasonRewardManifestAssetId(season.seasonIndex);
  const bossArtId = boss ? getSeasonBossManifestAssetId(season.seasonIndex) : undefined;
  const bossPresentation = boss
    ? getThemedSeasonBossPresentation(themeId, boss.currentBoss, boss.bossStatus)
    : null;
  const cozyRewardSrc = isCozy ? getCozySeasonRewardPath(season.seasonIndex) : null;
  const cozyObstacleSrc = isCozy ? getCozySeasonObstaclePath(season.seasonIndex) : null;

  const art = isCozy ? (
    cozyRewardSrc ? (
      <CozyArtScene
        src={cozyRewardSrc}
        alt={`Награда сезона: ${rewardName}`}
        layout="reward-banner"
        testId="season-reward-art"
        className={`rounded-none border-0 shadow-none ${
          rewardStatus === 'earned' ? '' : 'opacity-80'
        }`}
        objectPosition="center 55%"
      />
    ) : (
      <CozyArtPlaceholder
        label={`Награда сезона: ${rewardName}`}
        layout="banner"
        testId="season-reward-art"
        className={`rounded-none border-0 ${rewardStatus === 'earned' ? '' : 'opacity-80'}`}
      />
    )
  ) : rewardArtId ? (
    <ManifestArtScene
      assetId={rewardArtId}
      alt={`Награда сезона: ${rewardName}`}
      layout="reward-banner"
      testId="season-reward-art"
      className={`rounded-none border-0 shadow-none ${
        rewardStatus === 'earned' ? '' : 'opacity-70'
      }`}
    />
  ) : (
    <div
      className="flex h-[5.25rem] w-full items-center justify-center bg-[var(--app-bg-soft)] sm:h-[7.5rem] md:h-[10rem]"
      data-testid="season-reward-art"
      aria-hidden
    />
  );

  return (
    <CampaignDashboardCardShell
      testId="season-dashboard-summary"
      art={art}
      artCaption={rewardLabel}
    >
      <CampaignDashboardCardHeader
        eyebrow={`Сезон ${season.seasonIndex}`}
        title={season.config.title}
        meta={`День ${season.dayNumber}/${season.seasonLength}`}
      />

      <p className="mt-1 text-xs text-[var(--app-text-muted)]">{season.partialStatusLabel}</p>

      <div className="mt-2">
        <ProgressBar value={season.completedQuestCount} max={season.quests.length} />
        <p className="mt-1 text-xs text-[var(--app-text-muted)]">
          {season.completedQuestCount} из {season.quests.length}{' '}
          {getThemeTerm(themeId, 'questsPlural')}
          {!compact && season.questsNearCompletion > 0
            ? ` · ${season.questsNearCompletion} близко к закрытию`
            : ''}
        </p>
      </div>

      {!compact ? (
        <p className="mt-2 text-xs text-[var(--app-text-muted)] line-clamp-2">{season.recapText}</p>
      ) : null}

      {boss && bossPresentation ? (
        <div
          className="mt-auto border-t border-[var(--app-border)]/60 pt-2"
          data-testid="dashboard-boss-summary"
        >
          <div className="flex items-start gap-3">
            {isCozy ? (
              cozyObstacleSrc ? (
                <CozyArtScene
                  src={cozyObstacleSrc}
                  alt={bossPresentation.shortTitle}
                  layout="boss-compact"
                  testId="season-boss-art"
                />
              ) : (
                <CozyArtPlaceholder
                  label={bossPresentation.shortTitle}
                  layout="compact"
                  testId="season-boss-art"
                />
              )
            ) : bossArtId ? (
              <ManifestArtScene
                assetId={bossArtId}
                alt={bossPresentation.shortTitle}
                layout="boss-compact"
                testId="season-boss-art"
              />
            ) : (
              <span aria-hidden className="shrink-0 text-base">
                {boss.currentBoss.icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--app-text)]">
                {bossPresentation.shortTitle}
              </p>
              <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">
                {bossPresentation.statusLabel}
              </p>
              <div className="mt-1.5">
                <ProgressBar value={boss.bossProgressPercent} max={100} />
              </div>
              {boss.weaknessSignals.length > 0 && !isCozy ? (
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                  {boss.weaknessSignals.join(' · ')}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                  {bossPresentation.weaknessText}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </CampaignDashboardCardShell>
  );
}
