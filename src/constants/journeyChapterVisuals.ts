import type { JourneyTerrainType } from './journeyMapConfig';

export type ChapterBiomeVisual = {
  biomeKey: JourneyTerrainType;
  loreTag: string;
  /** Optional per-chapter art: `/game-assets/maps/chapters/chapter-01-ruins.webp` */
  assetPath: string;
  gradient: string;
  vignetteOverlay: string;
  accent: string;
};

const CHAPTER_ASSET = (n: number, slug: string) =>
  `/game-assets/maps/chapters/chapter-${String(n).padStart(2, '0')}-${slug}.webp`;

export const CHAPTER_BIOME_VISUALS: ChapterBiomeVisual[] = [
  {
    biomeKey: 'ruins',
    loreTag: 'Руины · начало пути',
    assetPath: CHAPTER_ASSET(1, 'ruins'),
    gradient: 'linear-gradient(135deg, #1a1520 0%, #2d2438 45%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.35) 100%)',
    accent: '#c4b5fd',
  },
  {
    biomeKey: 'road',
    loreTag: 'Каменистый маршрут',
    assetPath: CHAPTER_ASSET(2, 'crack'),
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.3) 100%)',
    accent: '#a8a29e',
  },
  {
    biomeKey: 'tower',
    loreTag: 'Открытый тракт',
    assetPath: CHAPTER_ASSET(3, 'road'),
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 45%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.25) 100%)',
    accent: '#94a3b8',
  },
  {
    biomeKey: 'ridge',
    loreTag: 'Башня · контроль',
    assetPath: CHAPTER_ASSET(4, 'tower'),
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.35) 100%)',
    accent: '#818cf8',
  },
  {
    biomeKey: 'valley',
    loreTag: 'Перевал · подъём',
    assetPath: CHAPTER_ASSET(5, 'ridge'),
    gradient: 'linear-gradient(135deg, #14532d 0%, #1e3a2f 45%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.3) 100%)',
    accent: '#6ee7b7',
  },
  {
    biomeKey: 'lake',
    loreTag: 'Озеро · равнина',
    assetPath: CHAPTER_ASSET(6, 'lake'),
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #164e63 50%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.28) 100%)',
    accent: '#67e8f9',
  },
  {
    biomeKey: 'village',
    loreTag: 'Крепость · порядок',
    assetPath: CHAPTER_ASSET(7, 'fortress-order'),
    gradient: 'linear-gradient(135deg, #292524 0%, #44403c 45%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.9) 0%, rgba(15,23,42,0.32) 100%)',
    accent: '#d6d3d1',
  },
  {
    biomeKey: 'mountain-road',
    loreTag: 'Река · проход',
    assetPath: CHAPTER_ASSET(8, 'river'),
    gradient: 'linear-gradient(135deg, #134e4a 0%, #1e3a5f 50%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.3) 100%)',
    accent: '#5eead4',
  },
  {
    biomeKey: 'fortress',
    loreTag: 'Цитадель · вершина',
    assetPath: CHAPTER_ASSET(9, 'citadel'),
    gradient: 'linear-gradient(135deg, #422006 0%, #713f12 35%, #0f172a 100%)',
    vignetteOverlay: 'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.4) 100%)',
    accent: '#fcd34d',
  },
];

const byTerrain = new Map(CHAPTER_BIOME_VISUALS.map((v) => [v.biomeKey, v]));

export function getChapterBiomeVisual(
  terrainType: JourneyTerrainType,
  chapterNumber: number,
): ChapterBiomeVisual {
  return byTerrain.get(terrainType) ?? CHAPTER_BIOME_VISUALS[Math.min(chapterNumber - 1, 8)]!;
}
