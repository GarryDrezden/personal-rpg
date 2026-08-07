import type { HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import type { AvatarVisualStage } from '../../types/avatarAssets';

/**
 * Production avatar art anchors.
 * Body Stage stays 1–20; art uses this configurable set only.
 * Future: may expand without changing Body Stage engine.
 */
export const AVATAR_VISUAL_STAGES: readonly AvatarVisualStage[] = [
  1, 5, 10, 15, 20,
];

export type { AvatarVisualStage };

export const AVATAR_VISUAL_STAGE_COUNT = AVATAR_VISUAL_STAGES.length;

export function clampAvatarBodyStage(
  stage: number | null | undefined,
): HeroStageNumber {
  if (stage == null || Number.isNaN(Number(stage))) return 1;
  const n = Math.round(Number(stage));
  return Math.min(HERO_STAGE_COUNT, Math.max(1, n)) as HeroStageNumber;
}

/**
 * Map Body Stage (1–20) → Avatar Visual Stage (production art key).
 * Presentation only — does not change AvatarStageEngine / bodyProgress.
 */
export function getAvatarVisualStage(
  bodyStage: number | null | undefined,
): AvatarVisualStage {
  const stage = clampAvatarBodyStage(bodyStage);
  if (stage <= 4) return 1;
  if (stage <= 8) return 5;
  if (stage <= 12) return 10;
  if (stage <= 16) return 15;
  return 20;
}

export function isAvatarVisualStage(stage: number): stage is AvatarVisualStage {
  return (AVATAR_VISUAL_STAGES as readonly number[]).includes(stage);
}

export function listAvatarVisualStages(): AvatarVisualStage[] {
  return [...AVATAR_VISUAL_STAGES];
}

/** Body-stage inclusive range that shares one visual anchor. */
export function getAvatarVisualStageBodyRange(
  visualStage: AvatarVisualStage,
): { from: HeroStageNumber; to: HeroStageNumber } {
  switch (visualStage) {
    case 1:
      return { from: 1, to: 4 };
    case 5:
      return { from: 5, to: 8 };
    case 10:
      return { from: 9, to: 12 };
    case 15:
      return { from: 13, to: 16 };
    case 20:
      return { from: 17, to: 20 };
    default: {
      const _exhaustive: never = visualStage;
      return _exhaustive;
    }
  }
}

/** Human-readable mapping rows for docs / DEV QA. */
export function getAvatarVisualStageMappingRows(): Array<{
  visualStage: AvatarVisualStage;
  bodyFrom: HeroStageNumber;
  bodyTo: HeroStageNumber;
  label: string;
}> {
  return AVATAR_VISUAL_STAGES.map((visualStage) => {
    const { from, to } = getAvatarVisualStageBodyRange(visualStage);
    return {
      visualStage,
      bodyFrom: from,
      bodyTo: to,
      label: `Body ${String(from).padStart(2, '0')}–${String(to).padStart(2, '0')} → ${String(visualStage).padStart(2, '0')}`,
    };
  });
}
