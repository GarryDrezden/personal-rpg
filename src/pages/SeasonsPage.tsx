import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { todayISO } from '../utils/dates';
import { getSeasonHistoryArchive } from '../game/seasons/seasonHistory';
import { SeasonHistorySection } from '../components/season/SeasonHistorySection';

export function SeasonsPage() {
  const { dailyEntries, settings } = useAppStore();
  const today = todayISO();

  const archive = useMemo(
    () => getSeasonHistoryArchive({ settings, dailyEntries, today }),
    [settings, dailyEntries, today],
  );

  return (
    <div className="space-y-6 pb-8" data-testid="seasons-page">
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--app-gold)]/55">
          Кампания
        </p>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Летопись сезонов</h1>
        <p className="max-w-2xl text-sm text-[var(--app-text-muted)]">
          История 28-дневных арок и мягких наград. Сезонные боссы — в{' '}
          <Link to="/growth/trials" className="font-medium text-[var(--app-primary)] hover:underline">
            Испытаниях
          </Link>
          .
        </p>
      </header>

      <SeasonHistorySection archive={archive} />
    </div>
  );
}
