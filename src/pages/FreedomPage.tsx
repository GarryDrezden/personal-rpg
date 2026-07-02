import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { FreedomScoreCard } from '../components/freedom/FreedomScoreCard';
import { RemovedLoadCard } from '../components/freedom/RemovedLoadCard';
import { PlateauCard } from '../components/freedom/PlateauCard';
import { WeeklyStoryHistory } from '../components/weekly/WeeklyStoryHistory';
import {
  calculateFreedomScore,
  hasFreedomScoreData,
} from '../utils/freedomScoreEngine';
import { calculateRemovedLoad } from '../utils/removedLoadEngine';
import { detectPlateau } from '../utils/plateauEngine';
import { getPlateauSnapshot } from '../game/plateau/plateauEngine';
import { getWeeklyStoryHistory } from '../utils/weeklyStoryHistoryEngine';

export function FreedomPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { themeId } = useAppTheme();

  const engineParams = useMemo(
    () => ({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  const freedomScore = useMemo(() => calculateFreedomScore(engineParams), [engineParams]);
  const removedLoad = useMemo(() => calculateRemovedLoad(measurements), [measurements]);
  const plateau = useMemo(() => detectPlateau(engineParams), [engineParams]);
  const hasData = hasFreedomScoreData({ dailyEntries, measurements });

  const weeklyHistory = useMemo(
    () => getWeeklyStoryHistory({ ...engineParams, limit: 4 }),
    [engineParams],
  );

  const plateauSnapshot = useMemo(
    () => getPlateauSnapshot(engineParams),
    [engineParams],
  );

  return (
    <div className="space-y-8 pb-4">
      <header>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Свобода тела</h1>
        <p className="mt-2 max-w-2xl text-sm text-[var(--app-text-muted)]">
          Свобода тела — это игровой индекс. Он не заменяет вес и не является медицинской оценкой.
          Он показывает, как разные части системы возвращают движение, контроль и устойчивость.
        </p>
      </header>

      <FreedomScoreCard result={freedomScore} hasData={hasData} />
      {hasData ? (
        <p className="text-sm text-[var(--app-text-muted)]">
          Долгий прогресс кампании:{' '}
          <Link to="/growth/abilities" className="font-medium text-[var(--app-primary)] hover:underline">
            способности тела
          </Link>
          {' · '}
          <Link to="/growth/camp" className="font-medium text-[var(--app-primary)] hover:underline">
            лагерь героя
          </Link>
          {plateauSnapshot.mode !== 'none' ? ' — на перевале особенно важны не-весовые признаки.' : '.'}
        </p>
      ) : null}
      <p className="text-sm">
        <Link to="/momentum" className="font-medium text-[var(--app-primary)] hover:underline">
          Посмотреть историю инерции →
        </Link>
      </p>
      <RemovedLoadCard result={removedLoad} themeId={themeId} />
      <PlateauCard result={plateau} />
      <WeeklyStoryHistory reports={weeklyHistory} compact />
      {weeklyHistory.length > 0 ? (
        <p className="text-center text-sm">
          <Link to="/reports" className="font-medium text-[var(--app-primary)] hover:underline">
            Все недельные отчёты и история →
          </Link>
        </p>
      ) : null}
    </div>
  );
}
