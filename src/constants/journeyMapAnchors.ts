import type { JourneyPinPlacement } from './journeyMapConfig';

export const PIN_WIDTH_PCT = 8;
export const PIN_HEIGHT_PCT = 7;
export const BOSS_PIN_SIZE_PCT = 2.8;

const PLACEMENT_META: Record<
  JourneyPinPlacement,
  { offsetX: number; offsetY: number; transform: string }
> = {
  top: { offsetX: 0, offsetY: -9, transform: 'translate(-50%, -100%)' },
  bottom: { offsetX: 0, offsetY: 9, transform: 'translate(-50%, 0)' },
  left: { offsetX: -7.5, offsetY: 0, transform: 'translate(-100%, -50%)' },
  right: { offsetX: 7.5, offsetY: 0, transform: 'translate(0, -50%)' },
  topLeft: { offsetX: -6, offsetY: -9, transform: 'translate(-100%, -100%)' },
  topRight: { offsetX: 6, offsetY: -9, transform: 'translate(0, -100%)' },
  bottomLeft: { offsetX: -6, offsetY: 9, transform: 'translate(-100%, 0)' },
  bottomRight: { offsetX: 6, offsetY: 9, transform: 'translate(0, 0)' },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function horizontalBounds(
  placement: JourneyPinPlacement,
  boxWidth: number,
): { min: number; max: number } {
  const margin = 1.2;
  if (placement === 'left' || placement === 'topLeft' || placement === 'bottomLeft') {
    return { min: margin + boxWidth, max: 100 - margin };
  }
  if (placement === 'right' || placement === 'topRight' || placement === 'bottomRight') {
    return { min: margin, max: 100 - margin - boxWidth };
  }
  return { min: margin + boxWidth / 2, max: 100 - margin - boxWidth / 2 };
}

function verticalBounds(
  placement: JourneyPinPlacement,
  boxHeight: number,
): { min: number; max: number } {
  const margin = 1.2;
  if (placement === 'top' || placement === 'topLeft' || placement === 'topRight') {
    return { min: margin + boxHeight, max: 100 - margin };
  }
  if (placement === 'bottom' || placement === 'bottomLeft' || placement === 'bottomRight') {
    return { min: margin, max: 100 - margin - boxHeight };
  }
  return { min: margin + boxHeight / 2, max: 100 - margin - boxHeight / 2 };
}

export type MapAnchor = {
  left: number;
  top: number;
  transform: string;
};

export function computePinAnchor(
  nodeLeftPct: number,
  nodeTopPct: number,
  placement: JourneyPinPlacement,
  offset?: { x: number; y: number },
  box: { w: number; h: number } = { w: PIN_WIDTH_PCT, h: PIN_HEIGHT_PCT },
): MapAnchor {
  const meta = PLACEMENT_META[placement];
  const ox = offset?.x ?? 0;
  const oy = offset?.y ?? 0;
  const xBounds = horizontalBounds(placement, box.w);
  const yBounds = verticalBounds(placement, box.h);

  return {
    left: clamp(nodeLeftPct + meta.offsetX + ox, xBounds.min, xBounds.max),
    top: clamp(nodeTopPct + meta.offsetY + oy, yBounds.min, yBounds.max),
    transform: meta.transform,
  };
}

export function computeBossPinAnchor(
  nodeLeftPct: number,
  nodeTopPct: number,
  placement: JourneyPinPlacement,
  offset?: { x: number; y: number },
): MapAnchor {
  const bossBox = { w: BOSS_PIN_SIZE_PCT, h: BOSS_PIN_SIZE_PCT };
  const meta = PLACEMENT_META[placement];
  const scaled = { offsetX: meta.offsetX * 0.55, offsetY: meta.offsetY * 0.55 };
  const ox = offset?.x ?? 0;
  const oy = offset?.y ?? 0;
  const xBounds = horizontalBounds(placement, bossBox.w);
  const yBounds = verticalBounds(placement, bossBox.h);

  return {
    left: clamp(nodeLeftPct + scaled.offsetX + ox, xBounds.min, xBounds.max),
    top: clamp(nodeTopPct + scaled.offsetY + oy, yBounds.min, yBounds.max),
    transform: 'translate(-50%, -50%)',
  };
}

export const BOSS_PIN_OPPOSITE: Record<JourneyPinPlacement, JourneyPinPlacement> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  topLeft: 'bottomRight',
  topRight: 'bottomLeft',
  bottomLeft: 'topRight',
  bottomRight: 'topLeft',
};

/** @deprecated Use computePinAnchor */
export const computeMarkerAnchor = computePinAnchor;

export const MARKER_WIDTH_PCT = PIN_WIDTH_PCT;
export const MARKER_HEIGHT_PCT = PIN_HEIGHT_PCT;
