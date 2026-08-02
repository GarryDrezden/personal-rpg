import type { AppThemeId } from '../types/theme';

export type ThemeTermKey =
  | 'boss'
  | 'bossChapter'
  | 'bossActive'
  | 'mob'
  | 'quest'
  | 'questsPlural'
  | 'victory'
  | 'campaign'
  | 'chronicle'
  | 'weaknessHint'
  | 'bossAccent'
  | 'codexEntities'
  | 'camp'
  | 'campStages'
  | 'plateauActive'
  | 'plateauPossible'
  | 'plateauMark'
  | 'plateauUnmark'
  | 'codex'
  | 'weeklyTrials';

const DARK_TERMS: Record<ThemeTermKey, string> = {
  boss: 'Босс',
  bossChapter: 'Босс главы',
  bossActive: 'Текущий босс',
  mob: 'Моб дня',
  quest: 'Квест',
  questsPlural: 'квестов',
  victory: 'Победа',
  campaign: 'Кампания',
  chronicle: 'Летопись сезонов',
  weaknessHint: 'Уязвим',
  bossAccent: 'Квесты дня приближают победу над боссом главы →',
  codexEntities: 'Стадии, спутники, мобы, боссы и артефакты — в кодексе пути.',
  camp: 'Лагерь героя',
  campStages: 'Стадии лагеря',
  plateauActive: 'Удержание перевала',
  plateauPossible: 'Возможный перевал',
  plateauMark: 'Я на перевале',
  plateauUnmark: 'Снять отметку перевала',
  codex: 'Кодекс',
  weeklyTrials: 'Испытания',
};

const COZY_TERMS: Record<ThemeTermKey, string> = {
  boss: 'Главная помеха',
  bossChapter: 'Помеха главы',
  bossActive: 'Главная помеха',
  mob: 'Помеха дня',
  quest: 'Задача дня',
  questsPlural: 'задач',
  victory: 'Дом стал теплее',
  campaign: 'Путь дома',
  chronicle: 'Сезонный дневник',
  weaknessHint: 'Уходит после',
  bossAccent: 'Задачи дня помогают вернуть туда свет →',
  codexEntities: 'Стадии, спутники и образы пути — в альбоме. В уютной теме — свои иллюстрации.',
  camp: 'Укрытие дома',
  campStages: 'Стадии укрытия',
  plateauActive: 'Спокойная площадка',
  plateauPossible: 'Возможная пауза роста',
  plateauMark: 'Я на паузе роста',
  plateauUnmark: 'Снять отметку паузы',
  codex: 'Альбом',
  weeklyTrials: 'Помехи',
};

export const THEME_TERMS: Record<AppThemeId, Record<ThemeTermKey, string>> = {
  darkFantasy: DARK_TERMS,
  cozy: COZY_TERMS,
};

export function getThemeTerm(themeId: AppThemeId, key: ThemeTermKey): string {
  return THEME_TERMS[themeId]?.[key] ?? DARK_TERMS[key];
}
