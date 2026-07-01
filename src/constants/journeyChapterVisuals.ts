import type { JourneyTerrainType } from './journeyMapConfig';

export type JourneyChapterVisual = {
  artPath: string;
  /** Alternate extensions if .webp missing */
  artPathFallbacks: readonly string[];
  biome: string;
  label: string;
  symbol: string;
  captionTitle: string;
  captionSubtitle: string;
  gradient: string;
  accent: string;
};

const CHAPTER_ART = (n: number, slug: string) => {
  const base = `/game-assets/maps/chapters/chapter-${String(n).padStart(2, '0')}-${slug}`;
  return {
    artPath: `${base}.webp`,
    artPathFallbacks: [`${base}.png`, `${base}.jpg`] as const,
  };
};

export const JOURNEY_CHAPTER_VISUALS = {
  1: {
    ...CHAPTER_ART(1, 'ruins'),
    biome: 'ruins',
    label: 'Руины · начало пути',
    symbol: '✦',
    captionTitle: 'Пробуждение ядра',
    captionSubtitle: 'Первые данные зажгли внутреннее ядро.',
    gradient: 'linear-gradient(135deg, #1a1520 0%, #2d2438 45%, #0f172a 100%)',
    accent: '#f5c657',
  },
  2: {
    ...CHAPTER_ART(2, 'burden'),
    biome: 'burden',
    label: 'Каменный маршрут',
    symbol: '◆',
    captionTitle: 'Первая трещина в грузе',
    captionSubtitle: 'Тяжесть дала трещину. Появился шанс.',
    gradient: 'linear-gradient(135deg, #1c1917 0%, #292524 50%, #0f172a 100%)',
    accent: '#f5c657',
  },
  3: {
    ...CHAPTER_ART(3, 'road'),
    biome: 'road',
    label: 'Открытый тракт',
    symbol: '✧',
    captionTitle: 'Основа движения',
    captionSubtitle: 'Путь открылся. Ты начал двигаться вперёд.',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 45%, #0f172a 100%)',
    accent: '#f5c657',
  },
  4: {
    ...CHAPTER_ART(4, 'watchtower'),
    biome: 'watchtower',
    label: 'Башня · контроль',
    symbol: '♜',
    captionTitle: 'Контроль режима',
    captionSubtitle: 'Ты нашёл порядок. Режим стал твоей опорой.',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #0f172a 100%)',
    accent: '#f5c657',
  },
  5: {
    ...CHAPTER_ART(5, 'pass'),
    biome: 'pass',
    label: 'Перевал · подъём',
    symbol: '▲',
    captionTitle: 'Возврат выносливости',
    captionSubtitle: 'Ты поднялся выше. Сила возвращается.',
    gradient: 'linear-gradient(135deg, #14532d 0%, #1e3a2f 45%, #0f172a 100%)',
    accent: '#f5c657',
  },
  6: {
    ...CHAPTER_ART(6, 'lake'),
    biome: 'lake',
    label: 'Озеро · равнина',
    symbol: '≈',
    captionTitle: 'Печать тяжести ослабла',
    captionSubtitle: 'Нагрузка ослабевает. Лёгкость становится реальностью.',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #164e63 50%, #0f172a 100%)',
    accent: '#f5c657',
  },
  7: {
    ...CHAPTER_ART(7, 'fortress'),
    biome: 'fortress',
    label: 'Крепость · опора',
    symbol: '⬟',
    captionTitle: 'Устойчивая система',
    captionSubtitle: 'Система работает на тебя. Ты под защитой.',
    gradient: 'linear-gradient(135deg, #292524 0%, #44403c 45%, #0f172a 100%)',
    accent: '#f5c657',
  },
  8: {
    ...CHAPTER_ART(8, 'river'),
    biome: 'river',
    label: 'Река · свобода',
    symbol: '〰',
    captionTitle: 'Новая мобильность',
    captionSubtitle: 'Ты свободнее. Движение без границ.',
    gradient: 'linear-gradient(135deg, #134e4a 0%, #1e3a5f 50%, #0f172a 100%)',
    accent: '#f5c657',
  },
  9: {
    ...CHAPTER_ART(9, 'citadel'),
    biome: 'citadel',
    label: 'Цитадель · перерождение',
    symbol: '✹',
    captionTitle: 'Великое перерождение',
    captionSubtitle: 'Ты у цели. Новая версия тебя готова.',
    gradient: 'linear-gradient(135deg, #422006 0%, #713f12 35%, #0f172a 100%)',
    accent: '#fcd34d',
  },
} as const satisfies Record<number, JourneyChapterVisual>;

export type ChapterBiomeVisual = JourneyChapterVisual & {
  biomeKey: JourneyTerrainType;
  assetPath: string;
  vignetteOverlay: string;
};

/** @deprecated Use getJourneyChapterVisual(chapterNumber) — keyed by chapter, not terrain */
export const CHAPTER_BIOME_VISUALS: ChapterBiomeVisual[] = Object.values(JOURNEY_CHAPTER_VISUALS).map(
  (v) => ({
    ...v,
    biomeKey: 'ruins' as JourneyTerrainType,
    assetPath: v.artPath,
    vignetteOverlay:
      'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.35) 100%)',
  }),
);

export function getJourneyChapterVisual(chapterNumber: number): JourneyChapterVisual {
  const key = Math.min(Math.max(1, chapterNumber), 9) as keyof typeof JOURNEY_CHAPTER_VISUALS;
  return JOURNEY_CHAPTER_VISUALS[key];
}

/** Resolve chapter art URLs to try (.webp first, then png/jpg) */
export function getChapterArtCandidates(chapterNumber: number): string[] {
  const visual = getJourneyChapterVisual(chapterNumber);
  return [visual.artPath, ...visual.artPathFallbacks];
}

export function getChapterBiomeVisual(
  _terrainType: JourneyTerrainType,
  chapterNumber: number,
): ChapterBiomeVisual {
  const visual = getJourneyChapterVisual(chapterNumber);
  return {
    ...visual,
    biomeKey: _terrainType,
    assetPath: visual.artPath,
    vignetteOverlay:
      'linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.35) 100%)',
  };
}
