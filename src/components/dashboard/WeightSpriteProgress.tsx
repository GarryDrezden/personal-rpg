import type { CharacterGender } from '../../types';
import type { WeightJourney } from '../../utils/weightJourney';
import {
  getActiveWeightStageImages,
  getWeightStageImage,
  STAGE_LABELS,
} from '../../utils/weightStages';

interface WeightSpriteProgressProps {
  journey: WeightJourney;
  gender: CharacterGender;
}

export function WeightSpriteProgress({ journey, gender }: WeightSpriteProgressProps) {
  const currentStage = journey.hasData ? journey.stage : 0;
  const imageStage = journey.hasData ? journey.imageStage : journey.visualStartImage;
  const stageImages = getActiveWeightStageImages(
    gender,
    journey.visualStartImage,
    journey.visualStageCount,
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-center rounded-xl bg-white/80 py-4">
        <img
          src={getWeightStageImage(imageStage, gender)}
          alt={`Стадия ${currentStage + 1}`}
          className="h-44 w-auto object-contain transition-opacity duration-300 sm:h-52"
          draggable={false}
        />
      </div>

      <div>
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-stone-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: journey.hasData
                ? `${(currentStage / Math.max(1, journey.visualStageCount - 1)) * 100}%`
                : '0%',
            }}
          />
        </div>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${journey.visualStageCount}, minmax(0, 1fr))`,
          }}
        >
          {stageImages.map((src, stage) => {
            const reached = journey.hasData && stage <= currentStage;
            const active = journey.hasData && stage === currentStage;
            const imageIndex = journey.visualStartImage + stage;
            const label = STAGE_LABELS[imageIndex];

            return (
              <div key={src} className="flex flex-col items-center gap-1.5">
                <div
                  className={`relative flex h-14 w-full items-end justify-center rounded-lg border-2 bg-white p-0.5 transition-all sm:h-16 md:h-20 ${
                    active
                      ? 'border-gold shadow-md ring-2 ring-amber-200'
                      : reached
                        ? 'border-emerald-300'
                        : 'border-stone-200 opacity-40'
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="max-h-full w-auto object-contain object-bottom"
                    draggable={false}
                  />
                </div>
                {label && (
                  <span
                    className={`text-[10px] font-medium sm:text-xs ${
                      active ? 'text-gold' : 'text-rpg-muted'
                    }`}
                  >
                    {label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
