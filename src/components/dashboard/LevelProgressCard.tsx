import { Flame } from 'lucide-react';
import { getLevelFromXp, getLevelRankTitle } from '../../utils/dashboard';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

const INTEGRATED_PANEL =
  'flex min-h-[8.5rem] flex-1 flex-col justify-center px-3 py-2 sm:px-4 md:min-h-[9rem]';

type LevelProgressCardProps = {
  totalXp: number;
  integrated?: boolean;
};

export function LevelProgressCard({ totalXp, integrated }: LevelProgressCardProps) {
  const { isDarkFantasy } = useAppTheme();
  const { level, currentLevelXp, nextLevelXp, progressToNextLevel } = getLevelFromXp(totalXp);
  const rank = getLevelRankTitle(level);

  const cardClass = isDarkFantasy
    ? 'border-[var(--app-border)] bg-gradient-to-br from-violet-950 to-[#171329] text-[var(--app-text)] hero-glow'
    : 'border-stone-700 bg-gradient-to-br from-stone-900 to-stone-800 text-white';

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className={integrated ? 'min-w-0' : undefined}>
          <p
            className={`uppercase tracking-wide text-[var(--app-text-muted)] ${
              integrated ? 'whitespace-nowrap text-xs' : 'text-xs opacity-80'
            }`}
          >
            Уровень
          </p>
          <p
            className={`font-bold tabular-nums text-[var(--app-primary)] ${
              integrated ? 'whitespace-nowrap text-4xl leading-none md:text-5xl' : 'text-3xl'
            }`}
          >
            {level}
          </p>
          <p
            className={`text-[var(--app-text-muted)] ${
              integrated ? 'mt-1 whitespace-nowrap text-sm' : 'mt-1 text-sm opacity-80'
            }`}
          >
            {rank}
          </p>
        </div>
        <div
          className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl ${
            integrated
              ? 'bg-[color-mix(in_srgb,var(--app-card-strong)_70%,transparent)] px-3 py-2'
              : 'bg-black/20 px-3 py-2'
          }`}
        >
          <Flame className="shrink-0 text-[var(--app-warning)]" size={18} />
          <span className={`font-semibold tabular-nums ${integrated ? 'text-sm' : ''}`}>
            {totalXp.toLocaleString('ru')} XP
          </span>
        </div>
      </div>

      <div className={integrated ? 'mt-3' : 'mt-4'}>
        <div
          className={`mb-1.5 flex justify-between gap-2 text-[var(--app-text-muted)] ${
            integrated ? 'whitespace-nowrap text-sm' : 'text-xs opacity-80'
          }`}
        >
          <span className="shrink-0">До ур. {level + 1}</span>
          <span className="shrink-0 tabular-nums">
            {currentLevelXp.toLocaleString('ru')} / {nextLevelXp.toLocaleString('ru')} XP
          </span>
        </div>
        <ProgressBar
          value={progressToNextLevel}
          color="gold"
          className={integrated ? 'h-3' : 'h-2.5'}
        />
      </div>
    </>
  );

  if (integrated) {
    return <div className={INTEGRATED_PANEL}>{content}</div>;
  }

  return <Card className={cardClass}>{content}</Card>;
}
