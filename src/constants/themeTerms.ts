import type { AppThemeId } from '../types/theme';

export type ThemeTermKey =
  | 'boss'
  | 'bossChapter'
  | 'bossActive'
  | 'mob'
  | 'quest'
  | 'victory'
  | 'campaign'
  | 'chronicle'
  | 'weaknessHint'
  | 'bossAccent'
  | 'codexEntities';

const DARK_TERMS: Record<ThemeTermKey, string> = {
  boss: 'Босс',
  bossChapter: 'Босс главы',
  bossActive: 'Текущий босс',
  mob: 'Моб дня',
  quest: 'Квест',
  victory: 'Победа',
  campaign: 'Кампания',
  chronicle: 'Летопись сезонов',
  weaknessHint: 'Уязвим',
  bossAccent: 'Квесты дня приближают победу над боссом главы →',
  codexEntities: 'Стадии, спутники, мобы, боссы и артефакты — в кодексе пути.',
};

const COZY_TERMS: Record<ThemeTermKey, string> = {
  boss: 'Главная помеха',
  bossChapter: 'Помеха главы',
  bossActive: 'Главная помеха',
  mob: 'Помеха дня',
  quest: 'Задача дня',
  victory: 'Дом стал теплее',
  campaign: 'Путь дома',
  chronicle: 'Сезонный дневник',
  weaknessHint: 'Уходит после',
  bossAccent: 'Задачи дня помогают привести дом и день в порядок →',
  codexEntities: 'Стадии, спутники и образы пути — в кодексе. В уютной теме — свои иллюстрации.',
};

export const THEME_TERMS: Record<AppThemeId, Record<ThemeTermKey, string>> = {
  darkFantasy: DARK_TERMS,
  cozy: COZY_TERMS,
};

export function getThemeTerm(themeId: AppThemeId, key: ThemeTermKey): string {
  return THEME_TERMS[themeId]?.[key] ?? DARK_TERMS[key];
}
