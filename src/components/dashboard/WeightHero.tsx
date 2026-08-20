import type { CharacterGender } from '../../types';
import type { WeightJourney } from '../../utils/weightJourney';
import { CARD_ACCENT, SURFACE_INSET } from '../../constants/cardTheme';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { WeightSpriteProgress } from './WeightSpriteProgress';

interface WeightHeroProps {
  journey: WeightJourney;
  gender: CharacterGender;
}

/** Legacy weight path card. Live body visual is Avatar Stages — this is unused on Dashboard. */
export function WeightHero({ journey, gender }: WeightHeroProps) {
  const delta = journey.deltaSinceLast;

  return (
    <Card className={CARD_ACCENT.primary}>
      <h2 className="mb-1 text-lg font-semibold text-[var(--app-text)]">
        Путь к {journey.targetWeight} кг
      </h2>
      <p className="mb-4 text-sm text-[var(--app-text-muted)]">
        {journey.hasData
          ? `Пик ${journey.peakWeight} кг · сейчас ${journey.currentWeight} кг · стадия ${journey.stage + 1} из ${journey.visualStageCount}`
          : 'Запишите стартовый вес в разделе «Замеры»'}
      </p>

      <WeightSpriteProgress journey={journey} gender={gender} />

      <div className="mt-4">
        {journey.hasData ? (
          <>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-[var(--app-text-muted)]">Прогресс</span>
              <span className="font-semibold text-[var(--app-primary)]">
                {journey.progressPercent.toFixed(0)}%
              </span>
            </div>
            <ProgressBar value={journey.progressPercent} color="success" />

            {journey.kgUntilNextStage !== null && journey.nextStage !== null && (
              <p className="mt-2 text-center text-sm font-medium text-[var(--app-primary)]">
                До стадии {journey.nextStage}: ещё {journey.kgUntilNextStage.toFixed(1)} кг
              </p>
            )}

            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-sm">
              <div className={`px-2 py-2 ${SURFACE_INSET}`}>
                <div className="text-xs text-[var(--app-text-muted)]">Сброшено</div>
                <div className="font-bold text-[var(--app-success)]">
                  {journey.lostFromPeak > 0
                    ? `−${journey.lostFromPeak.toFixed(1)} кг`
                    : '0 кг'}
                </div>
              </div>
              <div className={`px-2 py-2 ${SURFACE_INSET}`}>
                <div className="text-xs text-[var(--app-text-muted)]">Осталось до цели</div>
                <div className="font-bold text-[var(--app-text)]">
                  {journey.remaining.toFixed(1)} кг
                </div>
              </div>
            </div>

            {delta !== null && delta !== 0 && (
              <p
                className={`mt-2 text-center text-xs font-medium ${
                  delta > 0 ? 'text-[var(--app-text-muted)]' : 'text-[var(--app-success)]'
                }`}
              >
                С прошлого замера: {delta > 0 ? '+' : '−'}
                {Math.abs(delta).toFixed(1)} кг
              </p>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-4 text-center text-sm text-[var(--app-text-muted)]">
            Внесите первый замер — путь тела начнёт отображаться вместе с данными
          </div>
        )}
      </div>
    </Card>
  );
}
