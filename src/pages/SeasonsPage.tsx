import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { todayISO } from '../utils/dates';
import { getSeasonHistoryArchive } from '../game/seasons/seasonHistory';
import { SeasonHistorySection } from '../components/season/SeasonHistorySection';
import { getThemedSeasonPresentation } from '../constants/themeContentRegistry';
import { useAppTheme } from '../hooks/useAppTheme';

export function SeasonsPage() {
  const { dailyEntries, settings } = useAppStore();
  const { themeId } = useAppTheme();
  const today = todayISO();

  const archive = useMemo(
    () => getSeasonHistoryArchive({ settings, dailyEntries, today }),
    [settings, dailyEntries, today],
  );

  const seasonCopy = getThemedSeasonPresentation(themeId);
  const isCozy = themeId === 'cozy';
  const current = archive.entries.find((e) => e.isCurrent);
  const isEmpty =
    archive.earnedRewardCount === 0 && (current?.completedQuestCount ?? 0) === 0;

  return (
    <div className="space-y-6 pb-8" data-testid="seasons-page">
      <header className={`space-y-2${isCozy ? ' cozy-home-hero' : ''}`}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/70">
          {seasonCopy.eyebrow}
        </p>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">{seasonCopy.title}</h1>
        <p className="max-w-2xl text-sm text-[var(--app-text-muted)]">{seasonCopy.intro}</p>
        {isCozy ? (
          <p className="text-xs font-medium text-[var(--app-garden)]">
            {seasonCopy.careTraces} · {seasonCopy.notes} · {seasonCopy.reward}
          </p>
        ) : (
          <p className="text-sm text-[var(--app-text-muted)]">
            Сезонные боссы — в{' '}
            <Link
              to="/growth/trials"
              className="font-medium text-[var(--app-primary)] hover:underline"
            >
              Испытаниях
            </Link>
            .
          </p>
        )}
        {isCozy ? (
          <p className="text-sm text-[var(--app-text-muted)]">
            Сезонные заметки — в{' '}
            <Link
              to="/growth/trials"
              className="font-medium text-[var(--app-garden)] hover:underline"
            >
              Росте героя
            </Link>
            .
          </p>
        ) : null}
      </header>

      {isEmpty ? (
        <p
          className="rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3 text-sm text-[var(--app-text-muted)]"
          data-testid="seasons-empty"
        >
          {seasonCopy.empty}
        </p>
      ) : null}

      <SeasonHistorySection archive={archive} />
    </div>
  );
}
