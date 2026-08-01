import type { SeasonHistoryEntry, SeasonRewardStatus } from '../../game/seasons/seasonTypes';
import { getSeasonRewardManifestAssetId } from '../../game/manifestAssetUi';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { ProgressBar } from '../ui/ProgressBar';

function RewardChip({ status, label }: { status: SeasonRewardStatus; label: string }) {
  return (
    <span className={`season-reward-chip season-reward-chip--${status}`}>{label}</span>
  );
}

const REWARD_EMOJI = '✨';

export function SeasonHistoryCard({ entry }: { entry: SeasonHistoryEntry }) {
  const { config, isCurrent, isLocked, rewardStatus, rewardLabel } = entry;
  const rewardArtId =
    !isLocked && rewardStatus === 'earned'
      ? getSeasonRewardManifestAssetId(entry.seasonIndex)
      : undefined;

  return (
    <article
      className={`season-history-card${isCurrent ? ' season-history-card--current ring-1 ring-[var(--app-gold)]/30' : ''}${
        isLocked ? ' opacity-70' : ''
      }`}
      data-testid={`season-history-${entry.seasonIndex}`}
    >
      <div className="flex gap-3">
        <div className="season-history-thumb">
          {rewardArtId ? (
            <ManifestArtScene
              assetId={rewardArtId}
              alt={config.rewardName}
              layout="boss-compact"
              testId={`season-history-reward-art-${entry.seasonIndex}`}
              className="h-full w-full rounded-none border-0"
            />
          ) : (
            <span aria-hidden>{isLocked ? '🌫️' : REWARD_EMOJI}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--app-gold)]/80">
              Сезон {entry.seasonIndex}
            </p>
            {isCurrent ? (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-gold)]">
                Сейчас
              </span>
            ) : null}
            <RewardChip
              status={rewardStatus}
              label={
                rewardStatus === 'earned'
                  ? 'У тебя'
                  : rewardStatus === 'awaiting'
                    ? 'Почти'
                    : rewardStatus === 'fog'
                      ? 'В тумане'
                      : 'Ждёт'
              }
            />
          </div>
          <h3 className="mt-1 text-sm font-semibold text-[var(--app-text)]">{config.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--app-text-muted)]">
            {entry.recapText}
          </p>
          {!isLocked ? (
            <>
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
                  <span>{entry.partialStatusLabel}</span>
                  <span>
                    {entry.completedQuestCount}/{entry.questTotal}
                  </span>
                </div>
                <ProgressBar
                  value={entry.completedQuestCount}
                  max={entry.questTotal}
                  color={
                    rewardStatus === 'earned'
                      ? 'success'
                      : rewardStatus === 'awaiting'
                        ? 'gold'
                        : undefined
                  }
                />
              </div>
              <p className="mt-2 text-xs text-[var(--app-text-muted)]">{rewardLabel}</p>
            </>
          ) : (
            <p className="mt-2 text-xs text-[var(--app-text-muted)]">{rewardLabel}</p>
          )}
        </div>
      </div>
    </article>
  );
}
