import type { BossId, ChapterNumber } from '../types/gameAssets';

export type GameChapterMeta = {
  chapter: ChapterNumber;
  title: string;
  stageRange: [number, number];
  bossId: BossId;
  description: string;
};

export const GAME_CHAPTERS: GameChapterMeta[] = [
  {
    chapter: 1,
    title: 'Пробуждение системы',
    stageRange: [1, 4],
    bossId: 'lord_of_empty_day',
    description: 'Первый этап: включить систему и перестать исчезать из учёта.',
  },
  {
    chapter: 2,
    title: 'Первый сброс груза',
    stageRange: [5, 8],
    bossId: 'divan_king',
    description: 'Тело начинает возвращать движение, а день — опору.',
  },
  {
    chapter: 3,
    title: 'Возврат контроля',
    stageRange: [9, 12],
    bossId: 'misty_baron',
    description: 'Главный бой за ясность, учёт и устойчивость.',
  },
  {
    chapter: 4,
    title: 'Сильная база',
    stageRange: [13, 16],
    bossId: 'resource_devourer',
    description: 'Путь учится держаться не на героизме, а на системе.',
  },
  {
    chapter: 5,
    title: 'Новая форма',
    stageRange: [17, 20],
    bossId: 'old_form_guardian',
    description: 'Финальный этап большой трансформации и новая глава тела.',
  },
];

export function getChapterMeta(chapter: ChapterNumber): GameChapterMeta {
  return GAME_CHAPTERS.find((c) => c.chapter === chapter) ?? GAME_CHAPTERS[0]!;
}
