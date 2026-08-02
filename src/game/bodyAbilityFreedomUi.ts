import type { AppThemeId } from '../types/theme';
import type {
  BodyAbilityDifficulty,
  BodyAbilityPersonalItem,
  BodyAbilityStatus,
} from '../types/bodyAbilityPersonal';

export type BodyAbilityMapFilter =
  | 'all'
  | 'confirmable'
  | 'unlocked'
  | 'long_path';

export const BODY_ABILITY_MAP_FILTERS: BodyAbilityMapFilter[] = [
  'all',
  'confirmable',
  'unlocked',
  'long_path',
];

const LONG_PATH: BodyAbilityDifficulty[] = ['late', 'epic'];

export function isLongPathAbility(item: BodyAbilityPersonalItem): boolean {
  return LONG_PATH.includes(item.definition.difficulty);
}

export function isConfirmableAbility(item: BodyAbilityPersonalItem): boolean {
  if (item.user.status === 'suggested') return true;
  if (item.user.status !== 'locked') return false;
  return item.definition.unlockMode !== 'auto';
}

export function filterPersonalAbilityItems(
  items: BodyAbilityPersonalItem[],
  filter: BodyAbilityMapFilter,
): BodyAbilityPersonalItem[] {
  switch (filter) {
    case 'confirmable':
      return items.filter(isConfirmableAbility);
    case 'unlocked':
      return items.filter((i) => i.user.status === 'unlocked');
    case 'long_path':
      return items.filter(isLongPathAbility);
    case 'all':
    default:
      return items;
  }
}

export function getBodyAbilityMapFilterLabel(
  filter: BodyAbilityMapFilter,
  themeId: AppThemeId,
): string {
  if (themeId === 'cozy') {
    const cozy: Record<BodyAbilityMapFilter, string> = {
      all: 'Все',
      confirmable: 'Можно подтвердить',
      unlocked: 'Уже светит',
      long_path: 'Долгий путь',
    };
    return cozy[filter];
  }
  const dark: Record<BodyAbilityMapFilter, string> = {
    all: 'Все',
    confirmable: 'Можно подтвердить',
    unlocked: 'Печати сняты',
    long_path: 'Дальний путь',
  };
  return dark[filter];
}

export function getBodyAbilityStatusLabel(
  status: BodyAbilityStatus,
  themeId: AppThemeId,
): string {
  if (themeId === 'cozy') {
    const cozy: Record<BodyAbilityStatus, string> = {
      locked: 'Ещё впереди',
      suggested: 'Проверь себя',
      unlocked: 'Открыто',
      hidden: 'Скрыто',
    };
    return cozy[status];
  }
  const dark: Record<BodyAbilityStatus, string> = {
    locked: 'Под печатью',
    suggested: 'Проверь путь',
    unlocked: 'Печать снята',
    hidden: 'В тумане',
  };
  return dark[status];
}

export function getFreedomMapPageCopy(themeId: AppThemeId): {
  eyebrow: string;
  title: string;
  intro: string;
  emptyTitle: string;
  emptyBody: string;
  setupCta: string;
  mapTitle: string;
  suggestedTitle: string;
  archivedTitle: string;
  archivedHint: string;
  unlockedProgress: (open: number, total: number) => string;
} {
  if (themeId === 'cozy') {
    return {
      eyebrow: 'Дом и тело',
      title: 'Свобода тела',
      intro:
        'Персональная карта тепла и лёгкости. Не список обязанностей — следы того, как дом и тело снова становятся своими.',
      emptyTitle: 'Карта тела ещё не собрана',
      emptyBody:
        'Ответь на несколько вопросов — и мы соберём тёплую сетку изменений под твой путь. Можно сделать позже, приложение не торопит.',
      setupCta: 'Настроить карту тела',
      mapTitle: 'Твоя карта возможностей',
      suggestedTitle: 'Кажется, стало теплее',
      archivedTitle: 'Уже открыто ранее',
      archivedHint: 'Сохранено в истории дома — вне активной карты.',
      unlockedProgress: (open, total) => `Открыто ${open} из ${total}`,
    };
  }

  return {
    eyebrow: 'Кампания тела',
    title: 'Свобода тела',
    intro:
      'Персональная карта печатей и артефактов пути. Не чеклист — маршрут, где тело возвращает силы.',
    emptyTitle: 'Карта печатей ещё не собрана',
    emptyBody:
      'Ответь на несколько вопросов — и игра соберёт сетку способностей под твой путь. Можно отложить: кампания ждёт без давления.',
    setupCta: 'Настроить карту тела',
    mapTitle: 'Карта способностей',
    suggestedTitle: 'Печать ослабла — проверь',
    archivedTitle: 'Уже открыто ранее',
    archivedHint: 'Хранится в летописи, вне активной сетки.',
    unlockedProgress: (open, total) => `Снято печатей ${open} / ${total}`,
  };
}

export function sortPersonalAbilityItems(
  items: BodyAbilityPersonalItem[],
): BodyAbilityPersonalItem[] {
  const rank: Record<BodyAbilityStatus, number> = {
    suggested: 0,
    unlocked: 1,
    locked: 2,
    hidden: 3,
  };
  return [...items].sort((a, b) => {
    const byStatus = rank[a.user.status] - rank[b.user.status];
    if (byStatus !== 0) return byStatus;
    return a.definition.id.localeCompare(b.definition.id);
  });
}
