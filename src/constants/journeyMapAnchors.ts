import type { JourneyMarkerPlacement } from './journeyMapConfig';

export const MARKER_WIDTH_PCT = 9.5;
export const MARKER_HEIGHT_PCT = 9;
export const BOSS_PIN_SIZE_PCT = 3.2;

const PLACEMENT_META: Record<
  JourneyMarkerPlacement,
  { offsetX: number; offsetY: number; transform: string }
> = {
  top: { offsetX: 0, offsetY: -10, transform: 'translate(-50%, -100%)' },
  bottom: { offsetX: 0, offsetY: 10, transform: 'translate(-50%, 0)' },
  left: { offsetX: -8.5, offsetY: 0, transform: 'translate(-100%, -50%)' },
  right: { offsetX: 8.5, offsetY: 0, transform: 'translate(0, -50%)' },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function horizontalBounds(
  placement: JourneyMarkerPlacement,
  boxWidth: number,
): { min: number; max: number } {
  const margin = 1.5;
  if (placement === 'left') {
    return { min: margin + boxWidth, max: 100 - margin };
  }
  if (placement === 'right') {
    return { min: margin, max: 100 - margin - boxWidth };
  }
  return { min: margin + boxWidth / 2, max: 100 - margin - boxWidth / 2 };
}

function verticalBounds(
  placement: JourneyMarkerPlacement,
  boxHeight: number,
): { min: number; max: number } {
  const margin = 1.5;
  if (placement === 'top') {
    return { min: margin + boxHeight, max: 100 - margin };
  }
  if (placement === 'bottom') {
    return { min: margin, max: 100 - margin - boxHeight };
  }
  return { min: margin + boxHeight / 2, max: 100 - margin - boxHeight / 2 };
}

export type MapAnchor = {
  left: number;
  top: number;
  transform: string;
};

export function computeMarkerAnchor(
  nodeLeftPct: number,
  nodeTopPct: number,
  placement: JourneyMarkerPlacement,
  box: { w: number; h: number } = { w: MARKER_WIDTH_PCT, h: MARKER_HEIGHT_PCT },
): MapAnchor {
  const meta = PLACEMENT_META[placement];
  const xBounds = horizontalBounds(placement, box.w);
  const yBounds = verticalBounds(placement, box.h);

  return {
    left: clamp(nodeLeftPct + meta.offsetX, xBounds.min, xBounds.max),
    top: clamp(nodeTopPct + meta.offsetY, yBounds.min, yBounds.max),
    transform: meta.transform,
  };
}

export function computeBossPinAnchor(
  nodeLeftPct: number,
  nodeTopPct: number,
  placement: JourneyMarkerPlacement,
): MapAnchor {
  const bossBox = { w: BOSS_PIN_SIZE_PCT, h: BOSS_PIN_SIZE_PCT };
  const meta = PLACEMENT_META[placement];
  const scaled = { offsetX: meta.offsetX * 0.65, offsetY: meta.offsetY * 0.65 };
  const xBounds = horizontalBounds(placement, bossBox.w);
  const yBounds = verticalBounds(placement, bossBox.h);

  return {
    left: clamp(nodeLeftPct + scaled.offsetX, xBounds.min, xBounds.max),
    top: clamp(nodeTopPct + scaled.offsetY, yBounds.min, yBounds.max),
    transform: 'translate(-50%, -50%)',
  };
}

export const BOSS_PIN_OPPOSITE: Record<JourneyMarkerPlacement, JourneyMarkerPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};
