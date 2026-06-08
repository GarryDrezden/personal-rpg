import { Flame } from 'lucide-react';
import { getLevelFromXp, getLevelRankTitle } from '../../utils/dashboard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type LevelProgressCardProps = {
  totalXp: number;
};

export function LevelProgressCard({ totalXp }: LevelProgressCardProps) {
  const { isDarkFantasy } = useAppTheme();
  const { level, currentLevelXp, nextLevelXp, progressToNextLevel } = getLevelFromXp(totalXp);
  const rank = getLevelRankTitle(level);

  const cardClass = isDarkFantasy
    ? 'border-[var(--app-border)] bg-gradient-to-br from-violet-950 to-[#171329] text-[var(--app-text)] hero-glow'
    : 'border-stone-700 bg-gradient-to-br from-stone-900 to-stone-800 text-white';

  return (
    <Card className={cardClass}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide opacity-60">Уровень</p>
          <p className="text-3xl font-bold text-[var(--app-primary)]">{level}</p>
          <p className="mt-1 text-sm opacity-80">{rank}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-black/20 px-3 py-2">
          <Flame className="text-[var(--app-warning)]" size={18} />
          <span className="font-semibold">{totalXp.toLocaleString('ru')} XP</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs opacity-60">
          <span>До уровня {level + 1}</span>
          <span>
            {currentLevelXp.toLocaleString('ru')} / {nextLevelXp.toLocaleString('ru')} XP
          </span>
        </div>
        <ProgressBar value={progressToNextLevel} color="gold" className="h-2.5" />
      </div>
    </Card>
  );
}
