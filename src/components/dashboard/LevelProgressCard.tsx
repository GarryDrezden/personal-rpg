import { Flame } from 'lucide-react';
import { getLevelFromXp, getLevelRankTitle } from '../../utils/dashboard';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

type LevelProgressCardProps = {
  totalXp: number;
};

export function LevelProgressCard({ totalXp }: LevelProgressCardProps) {
  const { level, currentLevelXp, nextLevelXp, progressToNextLevel } = getLevelFromXp(totalXp);
  const rank = getLevelRankTitle(level);

  return (
    <Card className="bg-gradient-to-br from-stone-900 to-stone-800 text-white border-stone-700">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone-400">Уровень</p>
          <p className="text-3xl font-bold text-amber-300">{level}</p>
          <p className="mt-1 text-sm text-stone-300">{rank}</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-stone-700/80 px-3 py-2">
          <Flame className="text-orange-400" size={18} />
          <span className="font-semibold">{totalXp.toLocaleString('ru')} XP</span>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex justify-between text-xs text-stone-400">
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
