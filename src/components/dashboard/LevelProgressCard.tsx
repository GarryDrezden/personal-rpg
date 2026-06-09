import { Flame } from 'lucide-react';
import { getLevelFromXp, getLevelRankTitle } from '../../utils/dashboard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type LevelProgressCardProps = {
  totalXp: number;
  embedded?: boolean;
};

export function LevelProgressCard({ totalXp, embedded }: LevelProgressCardProps) {
  const { isDarkFantasy } = useAppTheme();
  const { level, currentLevelXp, nextLevelXp, progressToNextLevel } = getLevelFromXp(totalXp);
  const rank = getLevelRankTitle(level);

  const cardClass = isDarkFantasy
    ? 'border-[var(--app-border)] bg-gradient-to-br from-violet-950 to-[#171329] text-[var(--app-text)] hero-glow'
    : 'border-stone-700 bg-gradient-to-br from-stone-900 to-stone-800 text-white';

  return (
    <Card className={`${cardClass} ${embedded ? '!p-3' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide opacity-60">Уровень</p>
          <p
            className={`font-bold text-[var(--app-primary)] ${embedded ? 'text-2xl' : 'text-3xl'}`}
          >
            {level}
          </p>
          <p className={`opacity-80 ${embedded ? 'text-xs' : 'mt-1 text-sm'}`}>{rank}</p>
        </div>
        <div
          className={`flex items-center gap-1 rounded-xl bg-black/20 ${embedded ? 'px-2 py-1.5' : 'gap-1.5 px-3 py-2'}`}
        >
          <Flame className="text-[var(--app-warning)]" size={embedded ? 14 : 18} />
          <span className={`font-semibold ${embedded ? 'text-xs' : ''}`}>
            {totalXp.toLocaleString('ru')} XP
          </span>
        </div>
      </div>

      <div className={embedded ? 'mt-3' : 'mt-4'}>
        <div className="mb-1 flex justify-between text-[10px] opacity-60">
          <span>До ур. {level + 1}</span>
          <span>
            {currentLevelXp.toLocaleString('ru')} / {nextLevelXp.toLocaleString('ru')}
          </span>
        </div>
        <ProgressBar value={progressToNextLevel} color="gold" className={embedded ? 'h-2' : 'h-2.5'} />
      </div>
    </Card>
  );
}
