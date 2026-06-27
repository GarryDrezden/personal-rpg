import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useGameStats } from '../hooks/useGameStats';
import { todayISO, weekStart, weekDays, formatDateRu } from '../utils/dates';
import { calcDailyPoints, calcWeeklyBonuses, getWeekStatus } from '../utils/points';
import { isStepsMinimumDone, isStepsNormalDone, isStepsExcellentDone, getWeeklyStepsDistribution } from '../utils/stepsEngine';
import { getWeeklyBoss } from '../utils/bossEngine';
import { WeeklyBossCard } from '../components/boss/WeeklyBossCard';
import { WeeklyStepsDistributionChart } from '../components/steps/WeeklyStepsDistributionChart';
import { WeeklyStoryCard } from '../components/weekly/WeeklyStoryCard';
import { PlateauCard } from '../components/freedom/PlateauCard';
import { generateWeeklyStoryReport } from '../utils/weeklyStoryEngine';
import { detectPlateau } from '../utils/plateauEngine';
import {
  calculateMomentumHistory,
  getMomentumSummary,
  getTopWeekMomentumFactors,
} from '../utils/momentumEngine';
import { MomentumWeekBlock } from '../components/momentum/MomentumWeekBlock';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatTile } from '../components/ui/StatTile';
import { Check, X } from 'lucide-react';

export function WeekPage() {
  const { dailyEntries, measurements, settings } = useAppStore();
  const today = todayISO();
  const ws = weekStart(today);
  const days = weekDays(ws);
  const stats = useGameStats(today);
  const bonuses = calcWeeklyBonuses(ws, dailyEntries, measurements, settings);

  const weeklyBoss = useMemo(
    () =>
      getWeeklyBoss({
        weekStart: ws,
        dailyEntries,
        settings,
        measurements,
      }),
    [ws, dailyEntries, settings, measurements],
  );

  const stepsStats = useMemo(() => {
    const entries = days.map((d) => dailyEntries.find((e) => e.date === d));
    const minimumDays = entries.filter(
      (e) => e && isStepsMinimumDone(e.steps, settings, e.date),
    ).length;
    const normalDays = entries.filter(
      (e) => e && isStepsNormalDone(e.steps, settings, e.date),
    ).length;
    const excellentDays = entries.filter(
      (e) => e && isStepsExcellentDone(e.steps, settings, e.date),
    ).length;
    const totalSteps = entries.reduce((s, e) => s + (e?.steps ?? 0), 0);
    const avgSteps = Math.round(totalSteps / 7);
    return { minimumDays, normalDays, excellentDays, totalSteps, avgSteps };
  }, [days, dailyEntries, settings]);

  const stepsDistribution = useMemo(
    () =>
      getWeeklyStepsDistribution({
        weekStart: ws,
        dailyEntries,
        settings,
      }),
    [ws, dailyEntries, settings],
  );

  const weeklyStory = useMemo(
    () =>
      generateWeeklyStoryReport({
        weekStart: ws,
        dailyEntries,
        measurements,
        settings,
        today,
      }),
    [ws, dailyEntries, measurements, settings, today],
  );

  const momentumSummary = useMemo(
    () => getMomentumSummary({ today, dailyEntries, settings }),
    [today, dailyEntries, settings],
  );

  const momentumHistory = useMemo(
    () => calculateMomentumHistory({ dailyEntries, settings }),
    [dailyEntries, settings],
  );

  const topMomentumFactors = useMemo(
    () => getTopWeekMomentumFactors(momentumHistory, ws),
    [momentumHistory, ws],
  );

  const plateau = useMemo(
    () => detectPlateau({ dailyEntries, measurements, settings }),
    [dailyEntries, measurements, settings],
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Неделя</h1>
          <p className="text-rpg-muted">
            {formatDateRu(days[0]!)} — {formatDateRu(days[6]!)}
          </p>
        </div>
        <Link
          to="/growth/trials"
          className="text-sm font-medium text-[var(--app-primary)] hover:underline"
        >
          Испытания недели →
        </Link>
      </header>

      <WeeklyStoryCard report={weeklyStory} />
      <MomentumWeekBlock
        summary={momentumSummary}
        topFactors={topMomentumFactors}
        weekMomentumDelta={weeklyStory.momentumDelta ?? momentumSummary.weekDelta}
        momentumSummaryText={weeklyStory.momentumSummaryText}
      />
      <PlateauCard result={plateau} />

      <WeeklyBossCard boss={weeklyBoss} variant="full" />

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <span className="text-3xl font-bold">{stats.weekTotal}</span>
            <span className="text-rpg-muted"> / {stats.weekly.weeklyPointsGoal} XP</span>
          </div>
          <Badge variant={stats.weekPercent >= 80 ? 'success' : stats.weekPercent >= 50 ? 'default' : 'danger'}>
            {getWeekStatus(stats.weekPercent)}
          </Badge>
        </div>
        <ProgressBar value={stats.weekPercent} color={stats.weekPercent >= 100 ? 'success' : 'gold'} />
        <p className="mt-2 text-sm text-rpg-muted">{stats.weekPercent}% выполнения</p>
      </Card>

      <div className="space-y-2">
        {days.map((date) => {
          const entry = dailyEntries.find((e) => e.date === date);
          const pts = entry ? calcDailyPoints(entry, settings) : 0;
          const isToday = date === today;
          return (
            <Card key={date} className={isToday ? 'ring-2 ring-gold/50' : ''}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="font-medium">{formatDateRu(date, 'EEE d MMM')}</span>
                  {isToday && <Badge variant="gold">сегодня</Badge>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`font-bold ${pts < 0 ? 'text-danger' : pts >= 70 ? 'text-success' : ''}`}>
                    {pts} оч.
                  </span>
                  <Link
                    to={isToday ? '/today' : `/today?date=${date}`}
                    className="shrink-0 text-sm font-medium text-[var(--app-primary)] hover:underline"
                  >
                    {entry ? 'Изменить' : 'Внести'}
                  </Link>
                </div>
              </div>
              {entry && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-rpg-muted">
                  {entry.calories !== null && <span>🍽 {entry.calories}</span>}
                  {entry.steps !== null && <span>👟 {entry.steps}</span>}
                  {entry.alcohol && <span>🍷 {entry.alcohol}</span>}
                  {entry.gym && <span>🏋️ зал</span>}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Калории в лимите" value={`${stats.caloriesOkDays}/7`} />
        <StatTile label="Без алкоголя" value={`${stats.noAlcoholDays}/7`} />
        <StatTile label="Зал" value={`${stats.gymCount}/${stats.weekly.gymTarget}`} />
        <StatTile label="Шаги всего" value={stepsStats.totalSteps.toLocaleString('ru')} sub={`~${stepsStats.avgSteps} / день`} />
      </div>

      <Card>
        <h2 className="mb-3 font-semibold text-[var(--app-text)]">Шаги за неделю</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <StatTile label="Минимум 7000+" value={`${stepsStats.minimumDays}/7`} sub="удержание дня" />
          <StatTile label="Норма 11500+" value={`${stepsStats.normalDays}/7`} sub="хороший темп" />
          <StatTile label="Отлично 14000+" value={`${stepsStats.excellentDays}/7`} sub="максимум" />
        </div>
      </Card>

      <WeeklyStepsDistributionChart distribution={stepsDistribution} />

      <section>
        <h2 className="mb-3 font-semibold">Недельные бонусы</h2>
        <div className="space-y-2">
          {[
            { label: 'Норма зала', ok: stats.gymCount >= stats.weekly.gymTarget, pts: bonuses.gymWeeklyBonus },
            { label: '7 дней без алкоголя', ok: stats.noAlcoholDays === 7, pts: bonuses.noAlcoholWeekBonus },
            { label: '7 дней калории в лимите', ok: stats.caloriesOkDays === 7, pts: bonuses.caloriesWeekBonus },
            { label: 'Замеры в понедельник', ok: bonuses.measurementsMondayBonus > 0, pts: bonuses.measurementsMondayBonus },
          ].map((b) => (
            <div key={b.label} className="flex items-center justify-between rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] px-4 py-3">
              <span className="flex items-center gap-2 text-[var(--app-text)]">
                {b.ok ? <Check className="text-[var(--app-success)]" size={18} /> : <X className="text-[var(--app-text-muted)]" size={18} />}
                {b.label}
              </span>
              <span className="font-medium text-gold">+{b.pts}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
