import type { BossId } from '../types/gameAssets';
import { JOURNEY_STAGES } from './journeyMap';
import {
  BOSS_PIN_OPPOSITE,
  computeBossPinAnchor,
  computeMarkerAnchor,
  type MapAnchor,
} from './journeyMapAnchors';

export type JourneyTerrainType =
  | 'forest'
  | 'mountain'
  | 'lake'
  | 'ruins'
  | 'plateau'
  | 'fortress'
  | 'mist'
  | 'valley';

export type JourneyMarkerPlacement = 'top' | 'bottom' | 'left' | 'right';

export type JourneyMapStageConfig = {
  id: string;
  chapterNumber: number;
  terrainType: JourneyTerrainType;
  subtitle: string;
  /** SVG viewBox coordinates */
  x: number;
  y: number;
  markerPlacement: JourneyMarkerPlacement;
  bossPinPlacement: JourneyMarkerPlacement | null;
  bossId: BossId | null;
};

export const JOURNEY_MAP_VIEWBOX = { w: 1200, h: 520 } as const;
export const JOURNEY_MAP_ASPECT_RATIO = `${JOURNEY_MAP_VIEWBOX.w} / ${JOURNEY_MAP_VIEWBOX.h}`;

/** Node positions aligned to journey-map-bg-desktop.png landmarks (ruins → tower → village → citadel). */
const STAGE_LAYOUT: Omit<JourneyMapStageConfig, 'id' | 'chapterNumber' | 'subtitle'>[] = [
  {
    terrainType: 'ruins',
    x: 168,
    y: 368,
    markerPlacement: 'right',
    bossPinPlacement: 'left',
    bossId: 'lord_of_empty_day',
  },
  {
    terrainType: 'forest',
    x: 285,
    y: 318,
    markerPlacement: 'top',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'valley',
    x: 415,
    y: 248,
    markerPlacement: 'bottom',
    bossPinPlacement: 'top',
    bossId: 'divan_king',
  },
  {
    terrainType: 'plateau',
    x: 525,
    y: 278,
    markerPlacement: 'top',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'lake',
    x: 635,
    y: 318,
    markerPlacement: 'bottom',
    bossPinPlacement: 'top',
    bossId: 'misty_baron',
  },
  {
    terrainType: 'mist',
    x: 755,
    y: 338,
    markerPlacement: 'top',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'fortress',
    x: 865,
    y: 312,
    markerPlacement: 'bottom',
    bossPinPlacement: 'top',
    bossId: 'resource_devourer',
  },
  {
    terrainType: 'mountain',
    x: 985,
    y: 258,
    markerPlacement: 'bottom',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'fortress',
    x: 1085,
    y: 142,
    markerPlacement: 'left',
    bossPinPlacement: 'bottom',
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

export function nodeToSvg(config: JourneyMapStageConfig): { x: number; y: number } {
  return { x: config.x, y: config.y };
}

export function nodeToPercent(config: JourneyMapStageConfig): { left: number; top: number } {
  return {
    left: (config.x / JOURNEY_MAP_VIEWBOX.w) * 100,
    top: (config.y / JOURNEY_MAP_VIEWBOX.h) * 100,
  };
}

export function markerAnchorForConfig(config: JourneyMapStageConfig): MapAnchor {
  const node = nodeToPercent(config);
  return computeMarkerAnchor(node.left, node.top, config.markerPlacement);
}

export function bossPinAnchorForConfig(config: JourneyMapStageConfig): MapAnchor | null {
  if (!config.bossId) return null;
  const node = nodeToPercent(config);
  const placement =
    config.bossPinPlacement ?? BOSS_PIN_OPPOSITE[config.markerPlacement];
  return computeBossPinAnchor(node.left, node.top, placement);
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

export const JOURNEY_MAP_BG_DESKTOP = '/game-assets/maps/journey-map-bg-desktop.png';
export const JOURNEY_MAP_BG_MOBILE = '/game-assets/maps/journey-map-bg-mobile.png';
