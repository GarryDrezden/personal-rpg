import { Skull } from 'lucide-react';
import type { CharacterGender } from '../../types';
import type { WeightJourney } from '../../utils/weightJourney';
import { WEIGHT_DEATH_KG } from '../../utils/weightJourney';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { WeightSpriteProgress } from './WeightSpriteProgress';

interface WeightHeroProps {
  journey: WeightJourney;
  gender: CharacterGender;
}

export function WeightHero({ journey, gender }: WeightHeroProps) {
  const delta = journey.deltaSinceLast;

  return (
    <Card
      className={`bg-gradient-to-br from-stone-50 to-amber-50/50 ${
        journey.isGameOver ? 'border-2 border-danger ring-2 ring-red-200' : ''
      }`}
    >
      <h2 className="mb-1 text-lg font-semibold">Путь к {journey.targetWeight} кг</h2>
      <p className="mb-4 text-sm text-rpg-muted">
        {journey.hasData
          ? `Пик ${journey.peakWeight} кг · сейчас ${journey.currentWeight} кг · стадия ${journey.stage + 1} из ${journey.visualStageCount}`
          : 'Запишите стартовый вес в разделе «Замеры»'}
      </p>

      {journey.isGameOver && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-danger bg-red-50 px-4 py-3 text-danger">
          <Skull size={28} className="shrink-0" />
          <div>
            <div className="font-bold text-lg">Смерть</div>
            <div className="text-sm">
              {WEIGHT_DEATH_KG} кг — проигрыш. Персонаж не выдержал.
            </div>
          </div>
        </div>
      )}

      <WeightSpriteProgress journey={journey} gender={gender} />

      <div className="mt-4">
        {journey.hasData ? (
          <>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-rpg-muted">Прогресс</span>
              <span className="font-semibold text-gold">
                {journey.progressPercent.toFixed(0)}%
              </span>
            </div>
            <ProgressBar value={journey.progressPercent} color="success" />

            {journey.kgUntilNextStage !== null && journey.nextStage !== null && (
              <p className="mt-2 text-center text-sm font-medium text-amber-800">
                До стадии {journey.nextStage}: ещё {journey.kgUntilNextStage.toFixed(1)} кг
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
              <div className="rounded-lg bg-white/80 px-2 py-2">
                <div className="text-rpg-muted text-xs">Сброшено</div>
                <div className="font-bold text-success">
                  {journey.lostFromPeak > 0
                    ? `−${journey.lostFromPeak.toFixed(1)} кг`
                    : '0 кг'}
                </div>
              </div>
              <div className="rounded-lg bg-white/80 px-2 py-2">
                <div className="text-rpg-muted text-xs">Осталось до цели</div>
                <div className="font-bold">{journey.remaining.toFixed(1)} кг</div>
              </div>
            </div>

            {!journey.isGameOver && journey.kgUntilDeath !== null && (
              <div
                className={`mt-2 rounded-lg px-3 py-2 text-center text-xs ${
                  journey.kgUntilDeath <= 10
                    ? 'bg-red-50 font-semibold text-danger'
                    : 'bg-stone-100 text-rpg-muted'
                }`}
              >
                Лимит смерти: {WEIGHT_DEATH_KG} кг · до проигрыша {journey.kgUntilDeath.toFixed(1)} кг
              </div>
            )}

            {delta !== null && delta !== 0 && (
              <p
                className={`mt-2 text-center text-xs font-medium ${
                  delta > 0 ? 'text-danger' : 'text-success'
                }`}
              >
                С прошлого замера: {delta > 0 ? '+' : '−'}
                {Math.abs(delta).toFixed(1)} кг
              </p>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-rpg-border bg-white/60 px-4 py-4 text-center text-sm text-rpg-muted">
            Внесите первый замер — персонаж начнёт худеть вместе с вами
          </div>
        )}
      </div>
    </Card>
  );
}
