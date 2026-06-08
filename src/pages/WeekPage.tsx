import { useAppStore } from '../store/appStore';
import { useGameStats } from '../hooks/useGameStats';
import { todayISO, weekStart, weekDays, formatDateRu } from '../utils/dates';
import { calcDailyPoints, calcWeeklyBonuses, getWeekStatus } from '../utils/points';
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Неделя</h1>
        <p className="text-rpg-muted">
          {formatDateRu(days[0]!)} — {formatDateRu(days[6]!)}
        </p>
      </header>

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
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{formatDateRu(date, 'EEE d MMM')}</span>
                  {isToday && <Badge variant="gold">сегодня</Badge>}
                </div>
                <span className={`font-bold ${pts < 0 ? 'text-danger' : pts >= 70 ? 'text-success' : ''}`}>
                  {pts} оч.
                </span>
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
        <StatTile label="Шаги" value={stats.weekSteps.toLocaleString('ru')} sub={`~${Math.round(stats.weekSteps / 7)} / день`} />
      </div>

      <section>
        <h2 className="mb-3 font-semibold">Недельные бонусы</h2>
        <div className="space-y-2">
          {[
            { label: 'Норма зала', ok: stats.gymCount >= stats.weekly.gymTarget, pts: bonuses.gymWeeklyBonus },
            { label: '7 дней без алкоголя', ok: stats.noAlcoholDays === 7, pts: bonuses.noAlcoholWeekBonus },
            { label: '7 дней калории в лимите', ok: stats.caloriesOkDays === 7, pts: bonuses.caloriesWeekBonus },
            { label: 'Замеры в понедельник', ok: bonuses.measurementsMondayBonus > 0, pts: bonuses.measurementsMondayBonus },
          ].map((b) => (
            <div key={b.label} className="flex items-center justify-between rounded-xl border border-rpg-border bg-white px-4 py-3">
              <span className="flex items-center gap-2">
                {b.ok ? <Check className="text-success" size={18} /> : <X className="text-stone-400" size={18} />}
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
