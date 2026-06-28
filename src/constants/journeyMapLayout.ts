/**
 * Fixed node + label coordinates for the development map (percent of viewBox).
 * Labels alternate above/below the path; x spread 5–93 to use full map width.
 */
export type JourneyLabelPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

export type JourneyNodeLayout = {
  stageId: string;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
  labelPosition: JourneyLabelPosition;
};

export const JOURNEY_MAP_VIEWBOX = { w: 1200, h: 720 } as const;

export const JOURNEY_MAP_LAYOUT: JourneyNodeLayout[] = [
  {
    stageId: 'stage_01_system_awakening',
    x: 5,
    y: 64,
    labelX: 5,
    labelY: 46,
    labelPosition: 'top',
  },
  {
    stageId: 'stage_02_first_load_removed',
    x: 16,
    y: 54,
    labelX: 16,
    labelY: 76,
    labelPosition: 'bottom',
  },
  {
    stageId: 'stage_03_movement_base',
    x: 27,
    y: 40,
    labelX: 27,
    labelY: 22,
    labelPosition: 'top',
  },
  {
    stageId: 'stage_04_regime_control',
    x: 38,
    y: 32,
    labelX: 38,
    labelY: 56,
    labelPosition: 'bottom',
  },
  {
    stageId: 'stage_05_endurance_return',
    x: 49,
    y: 38,
    labelX: 49,
    labelY: 20,
    labelPosition: 'top',
  },
  {
    stageId: 'stage_06_constraints_weakened',
    x: 60,
    y: 52,
    labelX: 60,
    labelY: 72,
    labelPosition: 'bottom',
  },
  {
    stageId: 'stage_07_stable_system',
    x: 71,
    y: 36,
    labelX: 71,
    labelY: 18,
    labelPosition: 'top',
  },
  {
    stageId: 'stage_08_new_mobility',
    x: 82,
    y: 50,
    labelX: 82,
    labelY: 68,
    labelPosition: 'bottom',
  },
  {
    stageId: 'stage_09_big_rebirth',
    x: 93,
    y: 28,
    labelX: 93,
    labelY: 12,
    labelPosition: 'top',
  },
];

const layoutByStageId = new Map(JOURNEY_MAP_LAYOUT.map((l) => [l.stageId, l]));

export function getJourneyNodeLayout(stageId: string, fallbackIndex: number): JourneyNodeLayout {
  return (
    layoutByStageId.get(stageId) ??
    JOURNEY_MAP_LAYOUT[fallbackIndex] ??
    JOURNEY_MAP_LAYOUT[0]
  );
}

export function percentToSvg(x: number, y: number): { x: number; y: number } {
  return {
    x: (x / 100) * JOURNEY_MAP_VIEWBOX.w,
    y: (y / 100) * JOURNEY_MAP_VIEWBOX.h,
  };
}

export function nodeToSvg(layout: Pick<JourneyNodeLayout, 'x' | 'y'>): { x: number; y: number } {
  return percentToSvg(layout.x, layout.y);
}

export function labelToSvg(layout: Pick<JourneyNodeLayout, 'labelX' | 'labelY'>): {
  x: number;
  y: number;
} {
  return percentToSvg(layout.labelX, layout.labelY);
}

/** Smooth cubic path through node coordinates. */
export function buildJourneyMapPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function getLabelTransform(labelPosition: JourneyLabelPosition): string {
  switch (labelPosition) {
    case 'top':
      return 'translate(-50%, -100%)';
    case 'bottom':
      return 'translate(-50%, 0)';
    case 'left':
      return 'translate(-100%, -50%)';
    case 'right':
      return 'translate(0, -50%)';
    case 'top-left':
      return 'translate(-85%, -100%)';
    case 'top-right':
      return 'translate(-85%, -100%)';
    case 'bottom-left':
      return 'translate(-85%, 0)';
    case 'bottom-right':
      return 'translate(-85%, 0)';
    default:
      return 'translate(-50%, -50%)';
  }
}
