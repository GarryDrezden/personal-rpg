import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { useAppStore } from '../../store/appStore';
import { getSeasonSnapshot } from '../../game/seasons/seasonEngine';
import { todayISO } from '../../utils/dates';
import { getDashboardNextProgress } from '../../utils/dashboardNextProgress';
import { getJourneyMapSummary } from '../../utils/journeyMapEngine';

export function DashboardNextCard() {
  const { themeId, isCozy } = useAppTheme();
  const { settings, dailyEntries, measurements } = useAppStore();
  const game = useGameHeroState();
  const today = todayISO();

  const journeySummary = useMemo(
    () => getJourneyMapSummary({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );
  const season = useMemo(
    () => getSeasonSnapshot({ settings, dailyEntries, today }),
    [settings, dailyEntries, today],
  );
  const next = useMemo(
    () =>
      getDashboardNextProgress({
        themeId,
        settings,
        dailyEntries,
        measurements,
        season,
        journeySummary,
        bodyStage: game.bodyStage,
        today,
      }),
    [
      themeId,
      settings,
      dailyEntries,
      measurements,
      season,
      journeySummary,
      game.bodyStage,
    ],
  );

  if (!next) return null;

  return (
    <section
      data-testid="dashboard-next"
      aria-labelledby="dashboard-next-heading"
      className={`px-4 py-3 sm:max-w-3xl ${
        isCozy
          ? 'rounded-xl'
          : 'rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-[var(--app-shadow)]'
      }`}
    >
      <h2
        id="dashboard-next-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]"
      >
        {isCozy ? 'Дальше' : 'Следующий шаг'}
      </h2>
      <p className="mt-1.5 text-sm font-semibold leading-snug text-[var(--app-text)]">
        {next.title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
        {next.description}
      </p>
      <Link
        to={next.targetRoute}
        className="mt-2 inline-flex text-sm font-semibold text-[var(--app-primary)] hover:underline"
      >
        {next.actionLabel} →
      </Link>
    </section>
  );
}
