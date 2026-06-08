import { Link } from 'react-router-dom';
import type { CharacterGender } from '../../types';
import type { WeightJourney } from '../../utils/weightJourney';
import { getWeightStageImage } from '../../utils/weightStages';
import { getDayMoodPhrase, getLevelRankTitle } from '../../utils/dashboard';
import { getDayStatus } from '../../utils/points';
import { Badge } from '../ui/Badge';

type CharacterHeroProps = {
  level: number;
  todayPoints: number;
  gender: CharacterGender;
  journey: WeightJourney;
};

export function CharacterHero({ level, todayPoints, gender, journey }: CharacterHeroProps) {
  const mood = getDayMoodPhrase(todayPoints);
  const rank = getLevelRankTitle(level);
  const dayStatus = getDayStatus(todayPoints);
  const displayPoints = Math.max(0, todayPoints);

  const avatarSrc = journey.hasData
    ? getWeightStageImage(journey.imageStage, gender)
    : null;

  return (
    <section className="overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 shadow-md md:p-6">
      <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
        <div className="relative shrink-0">
          <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-3xl border-2 border-amber-300/80 bg-gradient-to-br from-amber-100 to-orange-100 shadow-inner md:h-40 md:w-40">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt="Персонаж"
                className="h-full w-full object-contain object-bottom p-2"
                draggable={false}
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="text-5xl" role="img" aria-hidden>
                  🧙
                </span>
                <span className="text-xs font-medium text-amber-800/70">Персонаж</span>
              </div>
            )}
          </div>
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

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <Badge variant={displayPoints >= 70 ? 'success' : displayPoints >= 40 ? 'default' : 'danger'}>
              {dayStatus}
            </Badge>
            <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-gold shadow-sm">
              {displayPoints} очков сегодня
            </span>
          </div>

          {journey.hasData && (
            <p className="mt-3 text-xs text-rpg-muted">
              Стадия {journey.stage + 1}/{journey.visualStageCount} · цель {journey.targetWeight} кг
              {' · '}
              <Link to="/measurements" className="font-medium text-gold hover:underline">
                Замеры →
              </Link>
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
