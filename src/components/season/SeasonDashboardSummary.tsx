import type { SeasonSnapshotWithRecap } from '../../game/seasons/seasonEngine';
import type { BossCampaignSnapshot } from '../../game/bosses/bossTypes';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { getSeasonRewardManifestAssetId } from '../../game/manifestAssetUi';
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
  const rewardArtId = getSeasonRewardManifestAssetId(season.seasonIndex);

  return (
    <section
      data-testid="season-dashboard-summary"
      className="overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80"
    >
      {rewardArtId ? (
        <div className="border-b border-[var(--app-border)]/60 bg-[var(--app-bg-soft)]/30">
          <ManifestArtScene
            assetId={rewardArtId}
            alt={`Награда сезона: ${season.config.rewardName}`}
            layout="reward-banner"
            testId="season-reward-art"
            className="rounded-none border-0 shadow-none"
          />
          <p className="px-3 py-2 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
            Награда сезона: {season.config.rewardName}
          </p>
        </div>
      ) : null}

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
            {season.completedQuestCount} из {season.quests.length} квестов
            {!compact && season.questsNearCompletion > 0
              ? ` · ${season.questsNearCompletion} близко к закрытию`
              : ''}
          </p>
        </div>

        {!compact ? (
          <p className="mt-2 text-xs text-[var(--app-text-muted)] line-clamp-2">{season.recapText}</p>
        ) : null}

        {boss ? (
          <div className="mt-2 border-t border-[var(--app-border)]/60 pt-2" data-testid="dashboard-boss-summary">
            <p className="text-xs font-medium text-[var(--app-text)]">
              {boss.currentBoss.icon} {boss.currentBoss.shortTitle}
            </p>
            <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">{boss.bossStatusLabel}</p>
            <div className="mt-1.5">
              <ProgressBar value={boss.bossProgressPercent} max={100} />
            </div>
            {boss.weaknessSignals.length > 0 ? (
              <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                {boss.weaknessSignals.join(' · ')}
              </p>
            ) : (
              <p className="mt-1 text-xs text-[var(--app-text-muted)]">{boss.nextWeaknessHint}</p>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

