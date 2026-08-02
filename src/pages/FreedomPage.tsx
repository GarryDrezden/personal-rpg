import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useAppTheme } from '../hooks/useAppTheme';
import { FreedomScoreCard } from '../components/freedom/FreedomScoreCard';
import { RemovedLoadCard } from '../components/freedom/RemovedLoadCard';
import { PlateauCard } from '../components/freedom/PlateauCard';
import { WeeklyStoryHistory } from '../components/weekly/WeeklyStoryHistory';
import { BodyAbilityPersonalGrid } from '../components/bodyAbilities/BodyAbilityPersonalGrid';
import { getFreedomMapPageCopy } from '../game/bodyAbilityFreedomUi';
import {
  calculateFreedomScore,
  hasFreedomScoreData,
} from '../utils/freedomScoreEngine';
import { calculateRemovedLoad } from '../utils/removedLoadEngine';
import { detectPlateau } from '../utils/plateauEngine';
import { getPlateauSnapshot } from '../game/plateau/plateauEngine';
import { getWeeklyStoryHistory } from '../utils/weeklyStoryHistoryEngine';
import { isBodyAbilityProfileConfigured } from '../utils/bodyAbilityPersonalEngine';

export function FreedomPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const { themeId } = useAppTheme();
  const mapCopy = getFreedomMapPageCopy(themeId);
  const mapConfigured = isBodyAbilityProfileConfigured(settings);

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
    <div className="space-y-8 pb-4" data-testid="freedom-page">
      <header className="space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--app-gold)]">
          {mapCopy.eyebrow}
        </p>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">{mapCopy.title}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--app-text-muted)]">
          {mapCopy.intro}
        </p>
      </header>

      <BodyAbilityPersonalGrid hidePageHeader />

      <div className="space-y-6 border-t border-[var(--app-border)] pt-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--app-text-muted)]">
          {themeId === 'cozy' ? 'Индекс и следы пути' : 'Индекс и следы кампании'}
        </p>
        <FreedomScoreCard result={freedomScore} hasData={hasData} />
        {hasData ? (
          <p className="text-sm text-[var(--app-text-muted)]">
            Долгий прогресс кампании:{' '}
            <Link
              to="/growth/abilities"
              className="font-medium text-[var(--app-primary)] hover:underline"
            >
              способности тела
            </Link>
            {' · '}
            <Link
              to="/growth/camp"
              className="font-medium text-[var(--app-primary)] hover:underline"
            >
              лагерь героя
            </Link>
            {plateauSnapshot.mode !== 'none'
              ? ' — на перевале особенно важны не-весовые признаки.'
              : '.'}
          </p>
        ) : null}
        <p className="text-sm">
          <Link to="/momentum" className="font-medium text-[var(--app-primary)] hover:underline">
            Посмотреть историю инерции →
          </Link>
        </p>
        {!mapConfigured ? (
          <p className="text-xs text-[var(--app-text-muted)]">
            Карта способностей настраивается отдельно — индекс свободы ниже работает и без неё.
          </p>
        ) : null}
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
    </div>
  );
}
