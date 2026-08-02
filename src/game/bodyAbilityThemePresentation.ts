import type { AppThemeId } from '../types/theme';
import type { BodyAbilityDefinition } from '../types/bodyAbilityPersonal';
import { getBodyAbilityDefinition } from '../constants/bodyAbilityBank';

export type ThemedBodyAbilityPresentation = {
  abilityId: string;
  themeId: AppThemeId;
  title: string;
  description: string;
  flavor: string;
  icon: string;
};

const COZY_OVERRIDES: Partial<
  Record<string, { title?: string; flavor: string; icon: string }>
> = {
  clothes_fit_better: {
    title: 'В шкафу стало свободнее',
    flavor: 'Светлая комната и сложенная одежда — вещи снова «дышат».',
    icon: '👕',
  },
  silhouette_cleaner: {
    flavor: 'У окна силуэт выглядит собраннее — без драмы, просто заметнее порядок формы.',
    icon: '🪞',
  },
  stairs_easier: {
    flavor: 'Лестница во дворе или подъезде уже не забирает весь день.',
    icon: '🪜',
  },
  tie_shoes_easier: {
    flavor: 'У порога наклониться к шнуркам стало спокойнее.',
    icon: '👟',
  },
  alcohol_free_week: {
    flavor: 'Вечер в доме остаётся ясным — без лишнего шума.',
    icon: '🌙',
  },
  walk_as_base_not_goal: {
    flavor: 'Тропинка во дворе снова часть обычного дня.',
    icon: '🌿',
  },
};

const DARK_OVERRIDES: Partial<
  Record<string, { title?: string; flavor: string; icon: string }>
> = {
  clothes_fit_better: {
    title: 'Печать формы ослабла',
    flavor: 'Броня и одежда сидят свободнее — груз старой формы ослаб.',
    icon: '🛡️',
  },
  silhouette_cleaner: {
    flavor: 'Контур героя стал чётче на карте пути.',
    icon: '⚔️',
  },
  stairs_easier: {
    flavor: 'Подъём по каменным ступеням больше не забирает всё дыхание.',
    icon: '🗻',
  },
  tie_shoes_easier: {
    flavor: 'Снять печать скованности: наклон больше не враг.',
    icon: '👢',
  },
  alcohol_free_week: {
    flavor: 'Ночной зов ослаб — ясность удерживает лагерь.',
    icon: '🔮',
  },
  walk_as_base_not_goal: {
    flavor: 'Маршрут снова база кампании, а не редкий подвиг.',
    icon: '🗺️',
  },
};

const CATEGORY_ICONS: Record<string, string> = {
  appearance: '👔',
  measurements: '📏',
  endurance: '🥾',
  stairs_routes: '🪜',
  strength: '💪',
  flexibility: '🧘',
  nutrition_control: '🍽️',
  sleep_resource: '😴',
  alcohol_evening: '💧',
  sport_training: '🏋️',
  daily_life: '🏠',
  mobility: '🚶',
  confidence: '✨',
};

export function getThemedBodyAbilityPresentation(
  themeId: AppThemeId,
  abilityId: string,
  definition?: BodyAbilityDefinition,
): ThemedBodyAbilityPresentation {
  const def = definition ?? getBodyAbilityDefinition(abilityId);
  const fallbackTitle = def?.title ?? abilityId;
  const fallbackDescription = def?.description ?? 'Изменение тела на пути героя.';
  const baseIcon = CATEGORY_ICONS[def?.category ?? ''] ?? '✦';

  if (themeId === 'cozy') {
    const override = COZY_OVERRIDES[abilityId];
    return {
      abilityId,
      themeId,
      title: override?.title ?? fallbackTitle,
      description: fallbackDescription,
      flavor:
        override?.flavor ??
        'Маленькое домашнее изменение: тепло, порядок и возвращение лёгкости.',
      icon: override?.icon ?? baseIcon,
    };
  }

  const override = DARK_OVERRIDES[abilityId];
  return {
    abilityId,
    themeId,
    title: override?.title ?? fallbackTitle,
    description: fallbackDescription,
    flavor:
      override?.flavor ??
      'Способность на пути: печать ослабла, маршрут героя стал свободнее.',
    icon: override?.icon ?? baseIcon,
  };
}
