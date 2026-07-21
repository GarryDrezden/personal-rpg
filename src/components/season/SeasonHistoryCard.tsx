import type { SeasonHistoryEntry, SeasonRewardStatus } from '../../game/seasons/seasonTypes';
import { getSeasonRewardManifestAssetId } from '../../game/manifestAssetUi';
import { ManifestArtScene } from '../game/ManifestArtScene';
import { ProgressBar } from '../ui/ProgressBar';

const REWARD_TONE: Record<SeasonRewardStatus, string> = {
  fog: 'border-violet-500/20 text-[var(--app-text-muted)]/55',
  preview: 'border-violet-500/25 text-violet-200/70',
  awaiting: 'border-[var(--app-gold)]/35 text-[var(--app-gold)]',
  earned: 'border-emerald-400/30 text-emerald-300/85',
};

function RewardChip({ status, label }: { status: SeasonRewardStatus; label: string }) {
  return (
    <span
      className={`rounded-full border bg-[#0e0c14]/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${REWARD_TONE[status]}`}
    >
      {label}
    </span>
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
      className={`relative overflow-hidden rounded-2xl border border-violet-500/15 bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/92 to-[#08070f]/95 p-4 ${
        isCurrent ? 'ring-1 ring-[var(--app-gold)]/35' : ''
      } ${isLocked ? 'opacity-70' : ''}`}
      data-testid={`season-history-${entry.seasonIndex}`}
    >
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-500/20 bg-[#0e0c14]/80 text-2xl">
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
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--app-gold)]/70">
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
          <p className="mt-1 text-xs leading-relaxed text-[var(--app-text-muted)]/75">
            {entry.recapText}
          </p>
          {!isLocked ? (
            <>
              <div className="mt-2">
                <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/55">
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
              <p className="mt-2 text-xs text-[var(--app-text-muted)]/70">{rewardLabel}</p>
            </>
          ) : (
            <p className="mt-2 text-xs text-[var(--app-text-muted)]/55">{rewardLabel}</p>
          )}
        </div>
      </div>
    </article>
  );
}
