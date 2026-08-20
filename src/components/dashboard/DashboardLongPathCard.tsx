import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useGameHeroState } from '../../hooks/useGameHeroState';
import { useAppStore } from '../../store/appStore';
import { getJourneyMapSummary } from '../../utils/journeyMapEngine';

export function DashboardLongPathCard() {
  const { isCozy } = useAppTheme();
  const { settings, dailyEntries, measurements } = useAppStore();
  const game = useGameHeroState();

  const journey = useMemo(
    () => getJourneyMapSummary({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  const current = journey.currentStage;
  const chapterLine = current
    ? `Глава ${current.stage.order} из ${journey.totalStages}`
    : `Глав завершено: ${journey.completedStages} из ${journey.totalStages}`;
  const bodyLine = `Стадия тела ${game.bodyStage} из 20`;

  return (
    <section
      data-testid="dashboard-long"
      aria-labelledby="dashboard-long-heading"
      className={`px-4 py-3 sm:max-w-3xl ${
        isCozy
          ? 'rounded-xl'
          : 'rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] shadow-[var(--app-shadow)]'
      }`}
    >
      <h2
        id="dashboard-long-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]"
      >
        {isCozy ? 'Путь' : 'Долгий путь'}
      </h2>
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold text-[var(--app-text)]">{chapterLine}</p>
        <Link
          to="/journey"
          className="text-sm font-semibold text-[var(--app-primary)] hover:underline"
        >
          Карта →
        </Link>
      </div>
      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm text-[var(--app-text-muted)]">{bodyLine}</p>
        <Link
          to="/freedom"
          className="text-sm font-medium text-[var(--app-primary)] hover:underline"
        >
          Тело →
        </Link>
      </div>
    </section>
  );
}
