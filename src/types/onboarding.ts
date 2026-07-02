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
  { id: 'soft', title: 'Мягкий старт', hint: 'Меньше целей, больше возврата' },
  { id: 'normal', title: 'Обычный маршрут', hint: 'Сбалансированный ритм' },
  { id: 'strong', title: 'Усиленный ритм', hint: 'Чуть выше планка, без гонки' },
];
