import type { AppThemeId } from './theme';
import type { CompanionId, HeroGender } from './gameAssets';
import type { NutritionTrackingMode } from './nutrition';

export type RouteMode = 'soft' | 'normal' | 'strong';

export type FirstFocusId =
  | 'nutrition'
  | 'movement'
  | 'resource'
  | 'clarity'
  | 'minimal';

/** Profile may store neutral; asset system still uses male/female. */
export type OnboardingHeroGender = HeroGender | 'neutral';

/** UI-only future theme branches (not in AppThemeId yet). */
export type FutureThemePreviewId = 'forestMyth' | 'athleteReturn';

export type OnboardingThemeChoiceId = AppThemeId | FutureThemePreviewId;

export interface OnboardingDraft {
  heroName?: string;
  startWeight?: number;
  targetWeight?: number;
  height?: number;
  heroGender?: OnboardingHeroGender;
  themeId?: AppThemeId;
  companionId?: CompanionId;
  /** @deprecated kept for draft migration from older onboarding */
  routeMode?: RouteMode;
  /** @deprecated kept for draft migration from older onboarding */
  firstFocus?: FirstFocusId;
  stepsMinimum?: number;
  stepsNormal?: number;
  stepsExcellent?: number;
  nutritionTrackingMode?: NutritionTrackingMode;
  dailyCalorieLimit?: number | null;
  alcoholTrackingEnabled?: boolean;
  sleepTrackingEnabled?: boolean;
  resourceTrackingEnabled?: boolean;
  physicalActivityEnabled?: boolean;
}

export const ONBOARDING_THEME_OPTIONS: {
  id: OnboardingThemeChoiceId;
  title: string;
  description: string;
  available: boolean;
  previewEmoji: string;
}[] = [
  {
    id: 'cozy',
    title: 'Cozy — Дом, сад и уют',
    description:
      'Забота о теле превращается в ресурсы для восстановления дома, двора и сада.',
    available: true,
    previewEmoji: '🌿',
  },
  {
    id: 'darkFantasy',
    title: 'Dark Fantasy — Путь сквозь тьму',
    description:
      'Каждый день ослабляет помехи, открывает путь и приближает героя к новой форме.',
    available: true,
    previewEmoji: '🌙',
  },
  {
    id: 'forestMyth',
    title: 'Forest Myth — Лесная мифология',
    description:
      'Скоро. Путь через лес, ремесло, духов места и восстановление живой земли.',
    available: false,
    previewEmoji: '🌲',
  },
  {
    id: 'athleteReturn',
    title: 'Athlete Return — Возвращение атлета',
    description:
      'Скоро. Кампания о возвращении силы, формы, выносливости и спортивной идентичности.',
    available: false,
    previewEmoji: '🏅',
  },
];

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
    lead: 'Это не просто трекер. Это история восстановления: ты отмечаешь день, а герой возвращает силы и меняет свой мир.',
    body: 'Мир и ритм выберешь на следующих шагах. Всё можно уточнить позже в настройках.',
  },
  {
    title: 'Герой',
    subtitle: 'Как зовут героя?',
    lead: 'Герой будет меняться по мере маршрута — не только в цифрах на весах.',
    body: 'Имя и облик можно уточнить позже. Пустое имя станет «Герой».',
  },
  {
    title: 'Мир',
    subtitle: 'В какой атмосфере пойдёт кампания?',
    lead: 'Тема задаёт визуальный язык и метафору мира — не экзамен и не навсегда.',
    body: 'Выбери доступную ветку. Будущие миры уже видны на горизонте.',
  },
  {
    title: 'Цель тела',
    subtitle: 'Откуда начинается путь тела',
    lead: 'Эти данные нужны, чтобы игра могла показывать путь тела, стадии героя и долгий прогресс.',
    body: 'Вес — только один из путей. Персонаж может расти через шаги, сон, ресурс, ясность и возвращение к ритму.',
  },
  {
    title: 'Ритм дня',
    subtitle: 'Мягкие ориентиры без давления',
    lead: 'Ритм можно менять позже в настройках.',
    body: 'Шаги, питание и трекеры — подсказки для дня, а не жёсткие правила. Питомцев при желании можно включить позже в настройках — игровые функции для них ещё не подключены.',
  },
] as const;
