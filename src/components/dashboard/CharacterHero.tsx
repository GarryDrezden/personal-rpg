import { Link } from 'react-router-dom';
import type { AvatarState } from '../../types/avatar';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { getDayMoodPhrase, getLevelRankTitle } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
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
  const mood = getDayMoodPhrase(todayPoints);
  const rank = getLevelRankTitle(level);
  const dayStatus = getDayStatus(todayPoints);
  const displayXp = Math.max(0, todayPoints);

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-md md:p-6">
      <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
        <div className="relative shrink-0">
          <AvatarDisplay
            stage={avatar.stage}
            gender={avatar.gender}
            imagePath={avatar.imagePath}
            weightLossKg={avatar.weightLossKg}
            hasWeightData={avatar.hasWeightData}
          />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-xs font-bold text-white shadow">
            Ур. {level}
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-700/80">
            Личная RPG
          </p>
          <h1 className="mt-1 text-2xl font-bold text-stone-900 md:text-3xl">{mood}</h1>
          <p className="mt-1 text-sm text-rpg-muted">{rank}</p>
          <p className="mt-1 text-sm font-medium text-emerald-800">{avatar.stageLabel}</p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant={displayXp >= 70 ? 'success' : displayXp >= 40 ? 'default' : 'danger'}>
              {dayStatus}
            </Badge>
            <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-gold shadow-sm">
              +{displayXp} XP сегодня
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900 shadow-sm">
              <Coins size={14} />
              {availableCoins.toLocaleString('ru')} монет
            </span>
            {todayCoins > 0 && (
              <span className="text-xs text-rpg-muted">+{todayCoins} монет сегодня</span>
            )}
          </div>

          <p className="mt-3 text-xs text-rpg-muted">
            <Link to="/measurements" className="font-medium text-gold hover:underline">
              Замеры →
            </Link>
            {' · '}
            <Link to="/settings" className="font-medium text-gold hover:underline">
              Настройки аватара →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
