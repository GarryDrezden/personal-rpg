import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { todayISO } from '../utils/dates';
import { getSeasonHistoryArchive } from '../game/seasons/seasonHistory';
import { SeasonHistorySection } from '../components/season/SeasonHistorySection';
import { useAppTheme } from '../hooks/useAppTheme';

export function SeasonsPage() {
  const { dailyEntries, settings } = useAppStore();
  const { themeId } = useAppTheme();
  const today = todayISO();

  const archive = useMemo(
    () => getSeasonHistoryArchive({ settings, dailyEntries, today }),
    [settings, dailyEntries, today],
  );

  const isCozy = themeId === 'cozy';

  return (
    <div className="space-y-6 pb-8" data-testid="seasons-page">
      <header className={`space-y-2${isCozy ? ' cozy-home-hero' : ''}`}>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/70">
          {isCozy ? 'Садовый журнал' : 'Кампания'}
        </p>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Летопись сезонов</h1>
        <p className="max-w-2xl text-sm text-[var(--app-text-muted)]">
          {isCozy
            ? 'Страницы сезонов — как записи в альбоме двора и дома. Мягкие награды без боя.'
            : 'История 28-дневных арок и мягких наград. Сезонные боссы — в '}
          {!isCozy ? (
            <>
              <Link
                to="/growth/trials"
                className="font-medium text-[var(--app-primary)] hover:underline"
              >
                Испытаниях
              </Link>
              .
            </>
          ) : (
            <>
              {' '}
              Сезонные испытания — в{' '}
              <Link
                to="/growth/trials"
                className="font-medium text-[var(--app-garden)] hover:underline"
              >
                Росте героя
              </Link>
              .
            </>
          )}
        </p>
      </header>

      <SeasonHistorySection archive={archive} />
    </div>
  );
}
