import { useMemo } from 'react';
import { Scroll } from 'lucide-react';
import type { SeasonHistoryArchive } from '../../game/seasons/seasonTypes';
import { partitionSeasonHistory } from '../../game/seasons/seasonHistory';
import { SeasonHistoryCard } from './SeasonHistoryCard';
import { useAppTheme } from '../../hooks/useAppTheme';

type SeasonHistorySectionProps = {
  archive: SeasonHistoryArchive;
};

export function SeasonHistorySection({ archive }: SeasonHistorySectionProps) {
  const { isCozy } = useAppTheme();
  const { current, completed, upcoming } = useMemo(
    () => partitionSeasonHistory(archive),
    [archive],
  );

  return (
    <section className="space-y-4" data-testid="season-history-section">
      <div className="season-chronicle-hero">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/70">
          Сезонный альбом
        </p>
        <div className="mt-1.5 flex items-start gap-3">
          <div className="season-chronicle-icon">
            <Scroll className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[var(--app-text)] sm:text-xl">
              Летопись сезонов
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
              {isCozy
                ? 'Сезонный дневник — арка заботы, а не календарный месяц. Новая страница откроется, когда текущая собрана. Пропущенные дни не закрывают сезон сами.'
                : 'Сезон — арка кампании, а не календарный месяц. Он остаётся текущим, пока не пройден. Пропуск дней не завершает арку и не открывает следующую.'}
            </p>
          </div>
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-3">
          <div className="season-chronicle-stat">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
              Сейчас
            </dt>
            <dd className="mt-1 text-sm font-semibold text-[var(--app-gold)]">
              Сезон {archive.currentSeasonIndex}
            </dd>
          </div>
          <div className="season-chronicle-stat">
            <dt className="text-[10px] uppercase tracking-wide text-[var(--app-text-muted)]">
              Наград у тебя
            </dt>
            <dd className="mt-1 text-xl font-bold text-[var(--app-text)]">
              {archive.earnedRewardCount}
              <span className="text-sm font-medium text-[var(--app-text-muted)]">
                {' '}
                / {archive.entries.length}
              </span>
            </dd>
          </div>
        </dl>
        {current && !current.isCompleted ? (
          <p
            className="mt-3 text-xs text-[var(--app-text-muted)]"
            data-testid="season-arc-continues"
          >
            {isCozy
              ? 'Сезонный дневник ещё открыт. Дом ещё собирает следы этого сезона.'
              : 'Арка ещё не завершена. Путь сезона продолжается.'}
          </p>
        ) : null}
      </div>

      {current ? (
        <div className="space-y-2">
          <h3 className="season-section-label text-xs font-semibold uppercase tracking-widest text-[var(--app-gold)]/70">
            Текущий сезон
          </h3>
          <SeasonHistoryCard entry={current} />
        </div>
      ) : null}

      {completed.length > 0 ? (
        <div className="space-y-2" data-testid="season-completed-section">
          <h3 className="season-section-label text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
            Пройденные арки
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[...completed].reverse().map((entry) => (
              <SeasonHistoryCard key={entry.seasonIndex} entry={entry} />
            ))}
          </div>
        </div>
      ) : null}

      {upcoming.length > 0 ? (
        <div className="space-y-2" data-testid="season-upcoming-section">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
            Впереди в тумане
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {upcoming.map((entry) => (
              <SeasonHistoryCard key={entry.seasonIndex} entry={entry} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
