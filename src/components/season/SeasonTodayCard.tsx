import { Link } from 'react-router-dom';
import type { SeasonSnapshotWithRecap } from '../../game/seasons/seasonEngine';
import type { BossCampaignSnapshot } from '../../game/bosses/bossTypes';
import { getSeasonRewardStatus } from '../../game/seasons/seasonRecap';
import {
  getThemedSeasonBossPresentation,
  getThemedSeasonRewardLabel,
  getThemedSeasonRewardName,
} from '../../game/themeCampaignPresentation';
import { getSeasonBossManifestAssetId } from '../../game/manifestAssetUi';
import { useAppTheme } from '../../hooks/useAppTheme';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { CozyArtPlaceholder } from '../game/CozyArtPlaceholder';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type SeasonTodayCardProps = {
  season: SeasonSnapshotWithRecap;
  boss?: BossCampaignSnapshot | null;
};

const VISIBLE_QUESTS = 3;

export function SeasonTodayCard({ season, boss }: SeasonTodayCardProps) {
  const { themeId, isCozy } = useAppTheme();
  const topQuests = season.quests
    .filter((q) => !q.completed)
    .sort((a, b) => b.current / b.target - a.current / a.target)
    .slice(0, VISIBLE_QUESTS);

  const displayQuests =
    topQuests.length > 0 ? topQuests : season.quests.slice(0, VISIBLE_QUESTS);

  const bossArtId = boss ? getSeasonBossManifestAssetId(season.seasonIndex) : undefined;
  const rewardName = getThemedSeasonRewardName(
    themeId,
    season.seasonIndex,
    season.config.rewardName,
  );
  const rewardLabel = getThemedSeasonRewardLabel(
    themeId,
    getSeasonRewardStatus(season.partialStatus, false),
    rewardName,
  );
  const bossPresentation = boss
    ? getThemedSeasonBossPresentation(themeId, boss.currentBoss, boss.bossStatus)
    : null;

  return (
    <Card
      data-testid="season-today-card"
      className="border-[var(--app-border)] bg-[var(--app-bg-soft)]/60"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-gold)]">
            Сезон {season.seasonIndex} — {season.config.title}
          </p>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">
            День {season.dayNumber} из {season.seasonLength}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-[var(--app-gold)]/30 bg-[var(--app-primary-soft)]/40 px-2.5 py-1 text-xs font-medium text-[var(--app-gold)]">
          {season.partialStatusLabel}
        </span>
      </div>

      <p className="mt-2 text-sm text-[var(--app-text)]">Фокус: {season.config.focus}</p>
      <p className="mt-1.5 text-xs text-[var(--app-text-muted)]">
        {rewardLabel}
        {' · '}
        <Link to="/seasons" className="font-medium text-[var(--app-primary)] hover:underline">
          {isCozy ? 'Дневник' : 'Летопись'}
        </Link>
      </p>

      <div className="mt-3">
        <div className="mb-1 flex justify-between text-xs text-[var(--app-text-muted)]">
          <span>{isCozy ? 'Путь сезона дома' : 'Путь сезона'}</span>
          <span>
            {season.dayNumber}/{season.seasonLength}
          </span>
        </div>
        <ProgressBar value={season.dayNumber} max={season.seasonLength} />
      </div>

      <ul className="mt-3 space-y-2">
        {displayQuests.map((quest) => (
          <li key={quest.id} className="text-xs">
            <div className="flex justify-between gap-2 text-[var(--app-text)]">
              <span className="min-w-0 truncate">{quest.label}</span>
              <span className="shrink-0 tabular-nums text-[var(--app-text-muted)]">
                {quest.current}/{quest.target}
              </span>
            </div>
            <ProgressBar
              className="mt-1 h-1.5"
              value={quest.current}
              max={quest.target}
              color={quest.completed ? 'success' : 'gold'}
            />
          </li>
        ))}
      </ul>

      <div
        className="mt-3 rounded-lg border border-[var(--app-border)]/80 bg-[var(--app-card)]/50 px-3 py-2.5"
        data-testid="season-boss-line"
      >
        {boss && bossPresentation ? (
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
                alt={bossPresentation.title}
                layout="boss-compact"
                testId="season-boss-art"
              />
            ) : (
              <span
                aria-hidden
                className="flex h-14 w-10 shrink-0 items-center justify-center text-xl"
              >
                {boss.currentBoss.icon}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-[var(--app-text)]">
                {bossPresentation.shortTitle}
              </p>
              <p className="mt-0.5 text-xs text-[var(--app-gold)]">{bossPresentation.statusLabel}</p>
              <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                {bossPresentation.weaknessText}
              </p>
              {!isCozy && boss.weaknessSignals.length > 0 ? (
                <p className="mt-1 text-xs text-[var(--app-text-muted)]">
                  {boss.weaknessSignals.join(' · ')}
                </p>
              ) : null}
              <div className="mt-2">
                <ProgressBar value={boss.bossProgressPercent} max={100} />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[var(--app-text-muted)]">
            {season.config.miniBossName} {season.config.miniBossHint}.
          </p>
        )}
      </div>
    </Card>
  );
}
