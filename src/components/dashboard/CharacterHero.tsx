import { Link } from 'react-router-dom';
import type { AvatarState } from '../../types/avatar';
import { AVATAR_STAGE_COUNT } from '../../constants/avatar';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { getDayMoodPhrase, getLevelRankTitle } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Badge } from '../ui/Badge';
import { Coins } from 'lucide-react';

type CharacterHeroProps = {
  level: number;
  todayPoints: number;
  todayCoins: number;
  availableCoins: number;
  avatar: AvatarState;
};

export function CharacterHero({
  level,
  todayPoints,
  todayCoins,
  availableCoins,
  avatar,
}: CharacterHeroProps) {
  const { isDarkFantasy } = useAppTheme();
  const mood = getDayMoodPhrase(todayPoints);
  const rank = getLevelRankTitle(level);
  const dayStatus = getDayStatus(todayPoints);
  const displayXp = Math.max(0, todayPoints);

  const shellClass = isDarkFantasy
    ? 'overflow-hidden rounded-3xl border border-[var(--app-border)] bg-gradient-to-br from-[#171329] via-[#111022] to-[#090812] p-5 shadow-[var(--app-shadow)] hero-glow md:p-6'
    : 'overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-md md:p-6';

  return (
    <section className={shellClass}>
      <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
        <div className="flex shrink-0 flex-col items-center">
          <div className="relative">
            <AvatarDisplay
              stage={avatar.stage}
              gender={avatar.gender}
              imagePath={avatar.imagePath}
              weightLossKg={avatar.weightLossKg}
              hasWeightData={avatar.hasWeightData}
              showFooter={false}
            />
            <div className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[var(--app-primary)] px-3 py-0.5 text-xs font-bold text-slate-950 shadow">
              Ур. {level}
            </div>
          </div>
          <div className="mt-5 text-center text-xs">
            <p className="font-semibold text-[var(--app-text)]">
              Этап {avatar.stage}/{AVATAR_STAGE_COUNT}
            </p>
            <p className="text-[var(--app-text-muted)]">{avatar.stageLabel}</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)] opacity-80">
            Личная RPG
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--app-text)] md:text-3xl">{mood}</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{rank}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant={displayXp >= 70 ? 'success' : displayXp >= 40 ? 'default' : 'danger'}>
              {dayStatus}
            </Badge>
            <span className="rounded-full bg-[var(--app-card-strong)] px-3 py-1 text-sm font-semibold text-[var(--app-primary)] shadow-sm">
              +{displayXp} XP сегодня
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--app-primary-soft)] px-3 py-1 text-sm font-semibold text-[var(--app-primary)] shadow-sm">
              <Coins size={14} />
              {availableCoins.toLocaleString('ru')} монет
            </span>
            {todayCoins > 0 && (
              <span className="text-xs text-[var(--app-text-muted)]">+{todayCoins} монет сегодня</span>
            )}
          </div>

          <p className="mt-3 text-xs text-[var(--app-text-muted)]">
            <Link to="/measurements" className="font-medium text-[var(--app-primary)] hover:underline">
              Замеры →
            </Link>
            {' · '}
            <Link to="/settings" className="font-medium text-[var(--app-primary)] hover:underline">
              Настройки аватара →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
