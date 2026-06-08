export const WEIGHT_STAGE_COUNT = 7;

/** stage-1.png … stage-7.png — от самого тяжёлого к атлетичному */
export const WEIGHT_STAGE_IMAGES = Array.from(
  { length: WEIGHT_STAGE_COUNT },
  (_, i) => `/images/weight/stage-${i + 1}.png`,
);

export function getWeightStageImage(stage: number): string {
  return WEIGHT_STAGE_IMAGES[Math.min(WEIGHT_STAGE_COUNT - 1, Math.max(0, stage))];
}

export const STAGE_LABELS = ['Старт', '', '', '', '', '', 'Цель'] as const;
