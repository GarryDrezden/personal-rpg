import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useDerivedStats } from '../store/selectors';
import { todayISO, formatDateFull } from '../utils/dates';
import { getDayStatus } from '../utils/points';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatTile } from '../components/ui/StatTile';
import { Heart, Shield, Activity, Home, Palette, Gift, Flame } from 'lucide-react';
import { WeightHero } from '../components/dashboard/WeightHero';
import { calcWeightJourney } from '../utils/weightJourney';

const categories = [
  { key: 'health', title: 'Здоровье', icon: Heart, color: 'text-red-500', to: '/today' },
  { key: 'discipline', title: 'Дисциплина', icon: Shield, color: 'text-blue-500', to: '/today' },
  { key: 'activity', title: 'Активность', icon: Activity, color: 'text-green-500', to: '/today' },
  { key: 'home', title: 'Быт', icon: Home, color: 'text-amber-600', to: '/today' },
  { key: 'hobby', title: 'Хобби', icon: Palette, color: 'text-purple-500', to: '/today' },
  { key: 'rewards', title: 'Награды', icon: Gift, color: 'text-gold', to: '/rewards' },
];

export function DashboardPage() {
  const navigate = useNavigate();
  const { dailyEntries, measurements, rewards, settings } = useAppStore();
  const today = todayISO();
  const stats = useDerivedStats(dailyEntries, measurements, rewards, settings, today);
  const weightJourney = calcWeightJourney(measurements);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold md:hidden">Личная RPG</h1>
        <p className="text-rpg-muted mt-1">{formatDateFull(today)}</p>
      </header>

      <WeightHero journey={weightJourney} gender={settings.gender} />

      <Card className="bg-gradient-to-br from-amber-50 to-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm text-rpg-muted">Сегодня</div>
            <div className="text-3xl font-bold text-gold">{Math.max(0, stats.todayPoints)} очков</div>
            <Badge variant={stats.todayPoints >= 70 ? 'success' : stats.todayPoints >= 40 ? 'default' : 'danger'}>
              {getDayStatus(stats.todayPoints)}
            </Badge>
          </div>
          <div className="text-right">
            <div className="text-sm text-rpg-muted">Уровень {stats.level.level}</div>
            <div className="flex items-center gap-1 text-gold font-semibold">
              <Flame size={18} /> {stats.totalXP} XP
            </div>
          </div>
        </div>
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-xs text-rpg-muted">
            <span>До уровня {stats.level.level + 1}</span>
            <span>{stats.level.currentXP} / {stats.level.xpForNextLevel}</span>
          </div>
          <ProgressBar value={stats.level.progressPercent} color="gold" />
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Неделя" value={`${stats.weekTotal}`} sub={`${stats.weekPercent}% цели`} />
        <StatTile label="Банк" value={stats.availablePoints} sub="для наград" />
        <StatTile label="Зал" value={`${stats.gymCount}/${stats.weekly.gymTarget}`} />
        <StatTile label="Шаги/нед" value={stats.weekSteps.toLocaleString('ru')} />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Калории ок" value={`${stats.caloriesOkDays}/7`} />
        <StatTile label="Без алкоголя" value={`${stats.noAlcoholDays}/7`} />
        <StatTile
          label="Вес"
          value={stats.latest?.weight?.toFixed(1) ?? '—'}
          sub={stats.latest ? `талия ${stats.latest.waist}` : undefined}
        />
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Категории</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {categories.map(({ title, icon: Icon, color, to }) => (
            <Card key={title} onClick={() => navigate(to)} className="flex items-center gap-3">
              <Icon className={color} size={28} />
              <span className="font-medium">{title}</span>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Серии</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatTile label="Без алкоголя" value={`${stats.streaks.noAlcohol} дн.`} />
          <StatTile label="Калории в норме" value={`${stats.streaks.caloriesOk} дн.`} />
          <StatTile label="Шаги выполнены" value={`${stats.streaks.stepsOk} дн.`} />
          <StatTile label="Дневник" value={`${stats.streaks.journal} дн.`} />
        </div>
      </section>
    </div>
  );
}
