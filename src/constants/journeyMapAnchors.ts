import type { JourneyCardPlacement } from './journeyMapConfig';

export const DESKTOP_CARD_WIDTH_PCT = 14;
export const DESKTOP_CARD_HEIGHT_PCT = 13;
export const DESKTOP_BOSS_SIZE_PCT = 4;

const PLACEMENT_META: Record<
  JourneyCardPlacement,
  { offsetX: number; offsetY: number; transform: string }
> = {
  top: { offsetX: 0, offsetY: -15, transform: 'translate(-50%, -100%)' },
  bottom: { offsetX: 0, offsetY: 15, transform: 'translate(-50%, 0)' },
  left: { offsetX: -12, offsetY: 0, transform: 'translate(-100%, -50%)' },
  right: { offsetX: 12, offsetY: 0, transform: 'translate(0, -50%)' },
  topLeft: { offsetX: -9, offsetY: -15, transform: 'translate(-100%, -100%)' },
  topRight: { offsetX: 9, offsetY: -15, transform: 'translate(0, -100%)' },
  bottomLeft: { offsetX: -9, offsetY: 15, transform: 'translate(-100%, 0)' },
  bottomRight: { offsetX: 9, offsetY: 15, transform: 'translate(0, 0)' },
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function horizontalBounds(
  placement: JourneyCardPlacement,
  boxWidth: number,
): { min: number; max: number } {
  const margin = 2;
  if (placement === 'left' || placement === 'topLeft' || placement === 'bottomLeft') {
    return { min: margin + boxWidth, max: 100 - margin };
  }
  if (placement === 'right' || placement === 'topRight' || placement === 'bottomRight') {
    return { min: margin, max: 100 - margin - boxWidth };
  }
  return { min: margin + boxWidth / 2, max: 100 - margin - boxWidth / 2 };
}

function verticalBounds(
  placement: JourneyCardPlacement,
  boxHeight: number,
): { min: number; max: number } {
  const margin = 2;
  if (placement === 'top' || placement === 'topLeft' || placement === 'topRight') {
    return { min: margin + boxHeight, max: 100 - margin };
  }
  if (placement === 'bottom' || placement === 'bottomLeft' || placement === 'bottomRight') {
    return { min: margin, max: 100 - margin - boxHeight };
  }
  return { min: margin + boxHeight / 2, max: 100 - margin - boxHeight / 2 };
}

export type DesktopAnchor = {
  left: number;
  top: number;
  transform: string;
};

export function computeDesktopAnchor(
  nodeX: number,
  nodeY: number,
  placement: JourneyCardPlacement,
  box: { w: number; h: number } = {
    w: DESKTOP_CARD_WIDTH_PCT,
    h: DESKTOP_CARD_HEIGHT_PCT,
  },
): DesktopAnchor {
  const meta = PLACEMENT_META[placement];
  const xBounds = horizontalBounds(placement, box.w);
  const yBounds = verticalBounds(placement, box.h);

  return {
    left: clamp(nodeX + meta.offsetX, xBounds.min, xBounds.max),
    top: clamp(nodeY + meta.offsetY, yBounds.min, yBounds.max),
    transform: meta.transform,
  };
}

export function computeBossAnchor(
  nodeX: number,
  nodeY: number,
  placement: JourneyCardPlacement,
): DesktopAnchor {
  const bossBox = { w: DESKTOP_BOSS_SIZE_PCT, h: DESKTOP_BOSS_SIZE_PCT };
  const meta = PLACEMENT_META[placement];
  const scaled = {
    offsetX: meta.offsetX * 0.55,
    offsetY: meta.offsetY * 0.55,
  };
  const xBounds = horizontalBounds(placement, bossBox.w);
  const yBounds = verticalBounds(placement, bossBox.h);

  return {
    left: clamp(nodeX + scaled.offsetX, xBounds.min, xBounds.max),
    top: clamp(nodeY + scaled.offsetY, yBounds.min, yBounds.max),
    transform: 'translate(-50%, -50%)',
  };
}

export function anchorToSvgPercent(anchor: Pick<DesktopAnchor, 'left' | 'top'>): {
  x: number;
  y: number;
} {
  return { x: anchor.left, y: anchor.top };
}
