import type { BossId } from '../types/gameAssets';
import { JOURNEY_STAGES } from './journeyMap';
import {
  computeBossAnchor,
  computeDesktopAnchor,
  type DesktopAnchor,
} from './journeyMapAnchors';

export type JourneyTerrainType =
  | 'forest'
  | 'mountain'
  | 'lake'
  | 'ruins'
  | 'plateau'
  | 'fortress'
  | 'mist';

export type JourneyCardPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export type JourneyMobileSide = 'left' | 'right';

export type JourneyMapStageConfig = {
  id: string;
  chapterNumber: number;
  terrainType: JourneyTerrainType;
  subtitle: string;
  node: { x: number; y: number };
  cardPlacement: JourneyCardPlacement;
  bossPlacement: JourneyCardPlacement | null;
  mobile: {
    order: number;
    side: JourneyMobileSide;
  };
  bossId: BossId | null;
};

export const JOURNEY_MAP_VIEWBOX = { w: 1200, h: 720 } as const;
export const JOURNEY_MAP_ASPECT_RATIO = `${JOURNEY_MAP_VIEWBOX.w} / ${JOURNEY_MAP_VIEWBOX.h}`;

/**
 * Node-anchored layout: cards and bosses are offsets from node, not free coordinates.
 * Coordinates are % of the shared coordinate layer (matches SVG viewBox).
 */
const STAGE_LAYOUT: Omit<JourneyMapStageConfig, 'id' | 'chapterNumber' | 'subtitle'>[] = [
  {
    terrainType: 'forest',
    node: { x: 12, y: 66 },
    cardPlacement: 'right',
    bossPlacement: 'left',
    mobile: { order: 1, side: 'left' },
    bossId: 'lord_of_empty_day',
  },
  {
    terrainType: 'plateau',
    node: { x: 24, y: 54 },
    cardPlacement: 'topLeft',
    bossPlacement: null,
    mobile: { order: 2, side: 'left' },
    bossId: null,
  },
  {
    terrainType: 'lake',
    node: { x: 36, y: 43 },
    cardPlacement: 'bottomRight',
    bossPlacement: 'top',
    mobile: { order: 3, side: 'left' },
    bossId: 'divan_king',
  },
  {
    terrainType: 'ruins',
    node: { x: 48, y: 34 },
    cardPlacement: 'top',
    bossPlacement: null,
    mobile: { order: 4, side: 'left' },
    bossId: null,
  },
  {
    terrainType: 'mountain',
    node: { x: 58, y: 44 },
    cardPlacement: 'bottomLeft',
    bossPlacement: 'right',
    mobile: { order: 5, side: 'left' },
    bossId: 'misty_baron',
  },
  {
    terrainType: 'mist',
    node: { x: 68, y: 36 },
    cardPlacement: 'topRight',
    bossPlacement: null,
    mobile: { order: 6, side: 'left' },
    bossId: null,
  },
  {
    terrainType: 'fortress',
    node: { x: 78, y: 48 },
    cardPlacement: 'bottomRight',
    bossPlacement: 'top',
    mobile: { order: 7, side: 'left' },
    bossId: 'resource_devourer',
  },
  {
    terrainType: 'plateau',
    node: { x: 88, y: 40 },
    cardPlacement: 'bottomLeft',
    bossPlacement: null,
    mobile: { order: 8, side: 'left' },
    bossId: null,
  },
  {
    terrainType: 'fortress',
    node: { x: 94, y: 24 },
    cardPlacement: 'left',
    bossPlacement: 'bottom',
    mobile: { order: 9, side: 'left' },
    bossId: 'old_form_guardian',
  },
];

export const JOURNEY_MAP_STAGE_CONFIG: JourneyMapStageConfig[] = JOURNEY_STAGES.map(
  (stage, index) => {
    const layout = STAGE_LAYOUT[index] ?? STAGE_LAYOUT[0]!;
    return {
      id: stage.id,
      chapterNumber: stage.order,
      subtitle: stage.subtitle,
      ...layout,
    };
  },
);

const configById = new Map(JOURNEY_MAP_STAGE_CONFIG.map((c) => [c.id, c]));

export function getJourneyMapStageConfig(stageId: string, fallbackIndex = 0): JourneyMapStageConfig {
  return configById.get(stageId) ?? JOURNEY_MAP_STAGE_CONFIG[fallbackIndex]!;
}

export function percentToSvg(x: number, y: number): { x: number; y: number } {
  return {
    x: (x / 100) * JOURNEY_MAP_VIEWBOX.w,
    y: (y / 100) * JOURNEY_MAP_VIEWBOX.h,
  };
}

export function nodeToSvg(config: JourneyMapStageConfig): { x: number; y: number } {
  return percentToSvg(config.node.x, config.node.y);
}

export function cardAnchorForConfig(config: JourneyMapStageConfig): DesktopAnchor {
  return computeDesktopAnchor(config.node.x, config.node.y, config.cardPlacement);
}

export function bossAnchorForConfig(config: JourneyMapStageConfig): DesktopAnchor | null {
  if (!config.bossId || !config.bossPlacement) return null;
  return computeBossAnchor(config.node.x, config.node.y, config.bossPlacement);
}

/** @deprecated Use cardAnchorForConfig */
export function cardToPercent(config: JourneyMapStageConfig): { x: number; y: number } {
  const anchor = cardAnchorForConfig(config);
  return { x: anchor.left, y: anchor.top };
}

/** @deprecated Use bossAnchorForConfig */
export function bossToPercent(config: JourneyMapStageConfig): { x: number; y: number } | null {
  const anchor = bossAnchorForConfig(config);
  return anchor ? { x: anchor.left, y: anchor.top } : null;
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

export const JOURNEY_MAP_BG_DESKTOP = '/game-assets/maps/journey-map-bg-desktop.webp';
export const JOURNEY_MAP_BG_MOBILE = '/game-assets/maps/journey-map-bg-mobile.webp';
