import { useMemo } from 'react';
import { Scroll } from 'lucide-react';
import type { SeasonHistoryArchive } from '../../game/seasons/seasonTypes';
import { getVisibleSeasonHistory } from '../../game/seasons/seasonHistory';
import { SeasonHistoryCard } from './SeasonHistoryCard';

type SeasonHistorySectionProps = {
  archive: SeasonHistoryArchive;
};

export function SeasonHistorySection({ archive }: SeasonHistorySectionProps) {
  const visible = useMemo(() => getVisibleSeasonHistory(archive, 2), [archive]);
  const current = visible.find((e) => e.isCurrent);
  const open = visible.filter((e) => !e.isLocked && !e.isCurrent);
  const fog = visible.filter((e) => e.isLocked);

  return (
    <section className="space-y-4" data-testid="season-history-section">
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/20 bg-gradient-to-br from-[#14101f]/90 via-[#0e0c18]/95 to-[#08070f] px-4 py-5 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/55">
          Seasons
        </p>
        <div className="mt-1.5 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--app-gold)]/25 bg-[#0e0c14]/70 text-[var(--app-gold)]">
            <Scroll className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--app-text)] sm:text-xl">
              Летопись сезонов
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]/80">
              28-дневные арки пути. Награда сезона — мягкий след: она появляется, когда сезон
              пройден или усилен. Без боя и без новых обязанностей.
            </p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-3 py-3">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/60">
              Сейчас
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--app-gold)]">
              Сезон {archive.currentSeasonIndex}
            </dd>
          </div>
          <div className="rounded-xl border border-violet-500/15 bg-[#0e0c14]/50 px-3 py-3">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]/60">
              Наград у тебя
            </dt>
            <dd className="mt-1 text-xl font-bold text-[var(--app-text)]">
              {archive.earnedRewardCount}
              <span className="text-sm font-medium text-[var(--app-text-muted)]/45">
                {' '}
                / {archive.entries.length}
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {current ? (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--app-gold)]/70">
            Текущий сезон
          </h3>
          <SeasonHistoryCard entry={current} />
        </div>
      ) : null}

      {open.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-violet-200/50">
            Пройденные арки
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[...open].reverse().map((entry) => (
              <SeasonHistoryCard key={entry.seasonIndex} entry={entry} />
            ))}
          </div>
        </div>
      ) : null}

      {fog.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]/45">
            В тумане впереди
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {fog.map((entry) => (
              <SeasonHistoryCard key={entry.seasonIndex} entry={entry} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
