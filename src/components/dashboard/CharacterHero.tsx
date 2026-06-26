import { Link } from 'react-router-dom';
import type { AvatarState } from '../../types/avatar';
import { AVATAR_STAGE_COUNT } from '../../constants/avatar';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { LevelProgressCard } from './LevelProgressCard';
import { TodayStatusCard } from './TodayStatusCard';
import { getDayMoodPhrase, getLevelRankTitle } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Badge } from '../ui/Badge';
import { Coins } from 'lucide-react';

type CharacterHeroProps = {
  level: number;
  totalXp: number;
  todayPoints: number;
  todayCoins: number;
  availableCoins: number;
  avatar: AvatarState;
};

export function CharacterHero({
  level,
  totalXp,
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

  const statsDivider = isDarkFantasy
    ? 'border-[color-mix(in_srgb,var(--app-border)_55%,transparent)]'
    : 'border-amber-200/70';

  return (
    <section className={shellClass}>
      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,50%)] lg:items-stretch lg:gap-6">
        <div className="flex shrink-0 flex-col items-center lg:justify-center">
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

        <div className="flex min-w-0 flex-col justify-center text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)] opacity-80">
            Личная RPG
          </p>
          <h1 className="mt-1 text-2xl font-bold text-[var(--app-text)] md:text-3xl">{mood}</h1>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{rank}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 lg:hidden">
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

          <div className="mt-4 hidden flex-wrap items-center gap-2 lg:flex">
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

        <div
          className={`flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-stretch sm:gap-0 lg:min-h-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 ${statsDivider}`}
        >
          <LevelProgressCard totalXp={totalXp} integrated />
          <div
            className={`hidden w-px shrink-0 self-stretch sm:block ${
              isDarkFantasy ? 'bg-[var(--app-border)]/40' : 'bg-amber-200/80'
            }`}
          />
          <TodayStatusCard todayPoints={todayPoints} todayCoins={todayCoins} integrated />
        </div>
      </div>
    </section>
  );
}
