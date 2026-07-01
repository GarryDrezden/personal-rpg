import type { BossId } from '../types/gameAssets';
import { JOURNEY_STAGES } from './journeyMap';
import {
  BOSS_PIN_OPPOSITE,
  computeBossPinAnchor,
  computePinAnchor,
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
  | 'valley'
  | 'road'
  | 'tower'
  | 'ridge'
  | 'village'
  | 'mountain-road';

export type JourneyPinPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight';

export type JourneyMapStageConfig = {
  id: string;
  chapterNumber: number;
  terrainType: JourneyTerrainType;
  subtitle: string;
  shortTitle: string;
  x: number;
  y: number;
  pinPlacement: JourneyPinPlacement;
  pinOffset?: { x: number; y: number };
  bossPinPlacement: JourneyPinPlacement | null;
  bossPinOffset?: { x: number; y: number };
  bossId: BossId | null;
};

export const JOURNEY_MAP_VIEWBOX = { w: 1200, h: 520 } as const;
export const JOURNEY_MAP_ASPECT_RATIO = '16 / 7';

const STAGE_LAYOUT: Omit<JourneyMapStageConfig, 'id' | 'chapterNumber' | 'subtitle'>[] = [
  {
    terrainType: 'ruins',
    shortTitle: 'Пробуждение',
    x: 135,
    y: 355,
    pinPlacement: 'bottomRight',
    bossPinPlacement: 'left',
    bossId: 'lord_of_empty_day',
  },
  {
    terrainType: 'road',
    shortTitle: 'Трещина',
    x: 260,
    y: 315,
    pinPlacement: 'top',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'tower',
    shortTitle: 'База',
    x: 390,
    y: 260,
    pinPlacement: 'bottom',
    bossPinPlacement: 'top',
    bossId: 'divan_king',
  },
  {
    terrainType: 'ridge',
    shortTitle: 'Контроль',
    x: 520,
    y: 230,
    pinPlacement: 'top',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'valley',
    shortTitle: 'Выносливость',
    x: 640,
    y: 285,
    pinPlacement: 'bottom',
    bossPinPlacement: 'top',
    bossId: 'misty_baron',
  },
  {
    terrainType: 'lake',
    shortTitle: 'Лёгкость',
    x: 765,
    y: 250,
    pinPlacement: 'topRight',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'village',
    shortTitle: 'Система',
    x: 890,
    y: 310,
    pinPlacement: 'bottomRight',
    bossPinPlacement: 'top',
    bossId: 'resource_devourer',
  },
  {
    terrainType: 'mountain-road',
    shortTitle: 'Мобильность',
    x: 1025,
    y: 270,
    pinPlacement: 'bottomLeft',
    bossPinPlacement: null,
    bossId: null,
  },
  {
    terrainType: 'fortress',
    shortTitle: 'Перерождение',
    x: 1125,
    y: 150,
    pinPlacement: 'left',
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

export function pinAnchorForConfig(config: JourneyMapStageConfig): MapAnchor {
  const node = nodeToPercent(config);
  return computePinAnchor(node.left, node.top, config.pinPlacement, config.pinOffset);
}

export function bossPinAnchorForConfig(config: JourneyMapStageConfig): MapAnchor | null {
  if (!config.bossId) return null;
  const node = nodeToPercent(config);
  const placement =
    config.bossPinPlacement ?? BOSS_PIN_OPPOSITE[config.pinPlacement];
  return computeBossPinAnchor(node.left, node.top, placement, config.bossPinOffset);
}

/** @deprecated Use pinAnchorForConfig */
export const markerAnchorForConfig = pinAnchorForConfig;

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
