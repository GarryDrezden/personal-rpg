import type { BossId } from '../types/gameAssets';
import { JOURNEY_STAGES } from './journeyMap';

export type JourneyTerrainType =
  | 'forest'
  | 'mountain'
  | 'lake'
  | 'ruins'
  | 'plateau'
  | 'fortress'
  | 'mist';

export type JourneyCardSide = 'top' | 'bottom';
export type JourneyMobileSide = 'left' | 'right';

export type JourneyMapStageConfig = {
  id: string;
  chapterNumber: number;
  terrainType: JourneyTerrainType;
  subtitle: string;
  desktop: {
    nodeX: number;
    nodeY: number;
    cardSide: JourneyCardSide;
  };
  mobile: {
    order: number;
    side: JourneyMobileSide;
  };
  bossId: BossId | null;
};

export const JOURNEY_MAP_VIEWBOX = { w: 1200, h: 720 } as const;

/** Desktop card offset from node (% of viewBox height). */
const CARD_OFFSET_TOP = 22;
const CARD_OFFSET_BOTTOM = 18;

/**
 * S-curve node layout with alternating card sides to avoid overlap.
 * Coordinates are % of viewBox (1200×720).
 */
const STAGE_LAYOUT: Omit<JourneyMapStageConfig, 'id' | 'chapterNumber' | 'subtitle'>[] = [
  {
    terrainType: 'forest',
    desktop: { nodeX: 7, nodeY: 68, cardSide: 'bottom' },
    mobile: { order: 1, side: 'left' },
    bossId: 'lord_of_empty_day',
  },
  {
    terrainType: 'plateau',
    desktop: { nodeX: 19, nodeY: 54, cardSide: 'top' },
    mobile: { order: 2, side: 'right' },
    bossId: null,
  },
  {
    terrainType: 'lake',
    desktop: { nodeX: 31, nodeY: 40, cardSide: 'bottom' },
    mobile: { order: 3, side: 'left' },
    bossId: 'divan_king',
  },
  {
    terrainType: 'ruins',
    desktop: { nodeX: 43, nodeY: 34, cardSide: 'top' },
    mobile: { order: 4, side: 'right' },
    bossId: null,
  },
  {
    terrainType: 'mountain',
    desktop: { nodeX: 55, nodeY: 46, cardSide: 'bottom' },
    mobile: { order: 5, side: 'left' },
    bossId: 'misty_baron',
  },
  {
    terrainType: 'mist',
    desktop: { nodeX: 67, nodeY: 38, cardSide: 'top' },
    mobile: { order: 6, side: 'right' },
    bossId: null,
  },
  {
    terrainType: 'fortress',
    desktop: { nodeX: 79, nodeY: 52, cardSide: 'bottom' },
    mobile: { order: 7, side: 'left' },
    bossId: 'resource_devourer',
  },
  {
    terrainType: 'plateau',
    desktop: { nodeX: 88, nodeY: 42, cardSide: 'top' },
    mobile: { order: 8, side: 'right' },
    bossId: null,
  },
  {
    terrainType: 'fortress',
    desktop: { nodeX: 95, nodeY: 24, cardSide: 'bottom' },
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
  return percentToSvg(config.desktop.nodeX, config.desktop.nodeY);
}

export function cardToPercent(config: JourneyMapStageConfig): { x: number; y: number } {
  const { nodeX, nodeY, cardSide } = config.desktop;
  const y =
    cardSide === 'top'
      ? Math.max(6, nodeY - CARD_OFFSET_TOP)
      : Math.min(90, nodeY + CARD_OFFSET_BOTTOM);
  return { x: nodeX, y };
}

export function bossToPercent(config: JourneyMapStageConfig): { x: number; y: number } | null {
  if (!config.bossId) return null;
  const { nodeX, nodeY, cardSide } = config.desktop;
  const offsetY = cardSide === 'top' ? 10 : -10;
  return {
    x: Math.min(98, Math.max(2, nodeX + (cardSide === 'top' ? 5 : -5))),
    y: Math.min(92, Math.max(8, nodeY + offsetY)),
  };
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

export function getCardTransform(cardSide: JourneyCardSide): string {
  return cardSide === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)';
}

export const JOURNEY_MAP_BG_DESKTOP = '/game-assets/maps/journey-map-bg-desktop.webp';
export const JOURNEY_MAP_BG_MOBILE = '/game-assets/maps/journey-map-bg-mobile.webp';
