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
import { getThemeTerm } from '../../constants/themeTerms';
import { useAppTheme } from '../../hooks/useAppTheme';
import { ManifestArtScene } from '../game/ManifestArtScene';
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

  return (
    <section
      data-testid="season-dashboard-summary"
      className="overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80"
    >
      {rewardArtId || isCozy ? (
        <div className="border-b border-[var(--app-border)]/60 bg-[var(--app-bg-soft)]/30">
          {isCozy ? (
            <CozyArtPlaceholder
              label={`Награда сезона: ${rewardName}`}
              layout="banner"
              testId="season-reward-art"
              className={`rounded-none border-0 ${rewardStatus === 'earned' ? '' : 'opacity-80'}`}
            />
          ) : (
            <ManifestArtScene
              assetId={rewardArtId!}
              alt={`Награда сезона: ${rewardName}`}
              layout="reward-banner"
              testId="season-reward-art"
              className={`rounded-none border-0 shadow-none ${
                rewardStatus === 'earned' ? '' : 'opacity-70'
              }`}
            />
          )}
          <p className="px-3 py-2 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
            {rewardLabel}
          </p>
        </div>
      ) : (
        <p
          className="border-b border-[var(--app-border)]/60 px-3 py-2 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]"
          data-testid="season-reward-label"
        >
          {rewardLabel}
        </p>
      )}

      <div className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
              Сезон {season.seasonIndex}
            </p>
            <p className="truncate text-sm font-medium text-[var(--app-text)]">
              {season.config.title}
            </p>
          </div>
          <p className="text-xs text-[var(--app-text-muted)]">
            День {season.dayNumber}/{season.seasonLength}
          </p>
        </div>

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
          <div className="mt-2 border-t border-[var(--app-border)]/60 pt-2" data-testid="dashboard-boss-summary">
            <div className="flex items-start gap-3">
              {isCozy ? (
                <CozyArtPlaceholder
                  label={bossPresentation.shortTitle}
                  layout="compact"
                  testId="season-boss-art"
                />
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
      </div>
    </section>
  );
}
