import type { AppThemeId } from './theme';
import type { CompanionId, HeroGender } from './gameAssets';

export type RouteMode = 'soft' | 'normal' | 'strong';

export type FirstFocusId =
  | 'nutrition'
  | 'movement'
  | 'resource'
  | 'clarity'
  | 'minimal';

export interface OnboardingDraft {
  startWeight?: number;
  targetWeight?: number;
  height?: number;
  heroGender?: HeroGender;
  themeId?: AppThemeId;
  companionId?: CompanionId;
  routeMode?: RouteMode;
  firstFocus?: FirstFocusId;
}

export const FIRST_FOCUS_OPTIONS: {
  id: FirstFocusId;
  title: string;
  hint: string;
}[] = [
  { id: 'nutrition', title: 'Контроль питания', hint: 'Мягкий учёт без давления' },
  { id: 'movement', title: 'Движение', hint: 'Шаги и активность в центре дня' },
  { id: 'resource', title: 'Ресурс', hint: 'Сон и восстановление важнее рывка' },
  { id: 'clarity', title: 'Ясность', hint: 'Дневник и спокойная рефлексия' },
  { id: 'minimal', title: 'Минимальный день', hint: 'Удержать короткий шаг, когда тяжело' },
];

export const ROUTE_MODE_OPTIONS: {
  id: RouteMode;
  title: string;
  hint: string;
}[] = [
  { id: 'soft', title: 'Мягкий старт', hint: 'Можно идти мягко — меньше целей, больше возврата' },
  { id: 'normal', title: 'Обычный маршрут', hint: 'Сбалансированный ритм без гонки' },
  { id: 'strong', title: 'Усиленный ритм', hint: 'Чуть выше планка, но без идеального дня' },
];

/** User-facing step copy for «Пробуждение ядра» (not “onboarding”). */
export const ONBOARDING_STEP_COPY = [
  {
    title: 'Пробуждение ядра',
    subtitle: 'Кампания начинается',
    lead: 'Это не гонка и не таблица штрафов. Personal RPG помогает удерживать путь день за днём: отмечать состояние, видеть прогресс и возвращаться завтра.',
    body: 'Сейчас ядро пробуждается — соберём старт маршрута: тело, героя, спутника и первый фокус. Можно идти мягко, без идеального дня.',
  },
  {
    title: 'Стартовая точка',
    subtitle: 'Отмечаем, откуда начинается путь',
    lead: 'Эти цифры — не приговор и не норма из таблицы. Маршруту нужна отправная точка, чтобы показывать движение.',
    body: 'Темп выбираешь ты. Вес важен, но путь шире: движение, ресурс и ясность тоже считаются.',
  },
  {
    title: 'Облик героя',
    subtitle: 'Персонаж начинает путь',
    lead: 'Герой будет меняться по мере маршрута — не только в цифрах на весах.',
    body: 'Выбери облик и атмосферу мира. Это визуальный тон кампании, а не экзамен.',
  },
  {
    title: 'Спутник на маршруте',
    subtitle: 'Союзник выходит в путь',
    lead: 'Спутник не оценивает день — он помогает удерживать маршрут рядом.',
    body: 'Выбери того, кто пойдёт с тобой в первые шаги. Можно сменить позже в настройках.',
  },
  {
    title: 'Первый ритм',
    subtitle: 'Мягкий старт без давления',
    lead: 'Ритм и фокус задают тон первых недель — без жёстких правил.',
    body: 'Маршрут открыт. Сегодня не нужно быть идеальным — достаточно удержать первый шаг.',
  },
] as const;
