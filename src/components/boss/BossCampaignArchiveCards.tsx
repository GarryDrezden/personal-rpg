import type { ActBossProgressEntry, BossArchiveEntry, BossStatus } from '../../game/bosses/bossTypes';
import { ProgressBar } from '../ui/ProgressBar';
import { TRIALS_CARD, TRIALS_PANEL } from './trialsUi';

const STATUS_LABEL: Record<BossStatus, string> = {
  untouched: 'Не тронут',
  noticed: 'Замечен',
  weakened: 'Слабеет',
  broken: 'Надломлен',
  sealed: 'Печать',
};

function StatusChip({ status, locked }: { status: BossStatus; locked?: boolean }) {
  if (locked) {
    return (
      <span className="rounded-full border border-violet-500/20 bg-[#0e0c14]/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-text-muted)]/55">
        В тумане
      </span>
    );
  }
  const tone =
    status === 'sealed'
      ? 'border-emerald-400/30 text-emerald-300/85'
      : status === 'broken' || status === 'weakened'
        ? 'border-[var(--app-gold)]/35 text-[var(--app-gold)]'
        : 'border-violet-500/25 text-violet-200/70';
  return (
    <span
      className={`rounded-full border bg-[#0e0c14]/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tone}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export function CampaignBossCard({ entry }: { entry: BossArchiveEntry }) {
  const { boss, progressPercent, status, statusLabel, isCurrent, isLocked, artUrl } = entry;

  return (
    <article
      className={`${TRIALS_CARD} p-4 ${isCurrent ? 'ring-1 ring-[var(--app-gold)]/35' : ''} ${
        isLocked ? 'opacity-70' : ''
      }`}
      data-testid={`campaign-boss-${boss.id}`}
    >
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-violet-500/20 bg-[#0e0c14]/80 text-2xl">
          {artUrl && !isLocked ? (
            <img src={artUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span aria-hidden>{boss.icon}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-[var(--app-text)]">{boss.title}</h3>
            <StatusChip status={status} locked={isLocked} />
            {isCurrent ? (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--app-gold)]">
                Сейчас
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[var(--app-text-muted)]/75">
            {isLocked ? 'Откроется вместе с сезоном.' : statusLabel}
          </p>
          {!isLocked ? (
            <div className="mt-2">
              <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/55">
                <span>Ослабление</span>
                <span>{progressPercent}%</span>
              </div>
              <ProgressBar
                value={progressPercent}
                color={progressPercent >= 75 ? 'success' : 'gold'}
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ActBossCard({ entry }: { entry: ActBossProgressEntry }) {
  const {
    boss,
    progressPercent,
    status,
    statusLabel,
    isCurrentAct,
    isLocked,
    sealedSeasonCount,
    seasonTotal,
    completedChapterCount,
    chapterTotal,
    seasonRange,
  } = entry;

  return (
    <article
      className={`${TRIALS_PANEL} p-4 ${isCurrentAct ? 'ring-1 ring-red-400/30' : ''} ${
        isLocked ? 'opacity-70' : ''
      }`}
      data-testid={`act-boss-${boss.id}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-300/55">
            Акт {boss.actId}
          </p>
          <h3 className="mt-1 text-base font-semibold text-[var(--app-text)]">
            <span className="mr-2" aria-hidden>
              {boss.icon}
            </span>
            {boss.title}
          </h3>
        </div>
        <StatusChip status={status} locked={isLocked} />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-muted)]/80">
        {isLocked ? statusLabel : boss.flavorLine}
      </p>
      {!isLocked ? (
        <>
          <p className="mt-2 text-xs text-[var(--app-text-muted)]/65">{statusLabel}</p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/55">
              <span>Прогресс акта</span>
              <span>{progressPercent}%</span>
            </div>
            <ProgressBar
              value={progressPercent}
              color={progressPercent >= 75 ? 'success' : 'gold'}
            />
          </div>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-[var(--app-text-muted)]/70">
            <div className="rounded-lg border border-violet-500/15 bg-[#0e0c14]/50 px-3 py-2">
              <dt>Сезоны {seasonRange[0]}–{seasonRange[1]}</dt>
              <dd className="mt-0.5 font-semibold text-[var(--app-text)]">
                {sealedSeasonCount}/{seasonTotal} печать
              </dd>
            </div>
            <div className="rounded-lg border border-violet-500/15 bg-[#0e0c14]/50 px-3 py-2">
              <dt>Главы</dt>
              <dd className="mt-0.5 font-semibold text-[var(--app-text)]">
                {completedChapterCount}/{chapterTotal} пройдено
              </dd>
            </div>
          </dl>
        </>
      ) : null}
    </article>
  );
}
