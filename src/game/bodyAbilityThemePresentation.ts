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
    title: 'Лестница занимает меньше дыхания',
    flavor: 'Лестница во дворе или подъезде уже не забирает весь день.',
    icon: '🪜',
  },
  walk_easier_short: {
    title: 'Короткая прогулка снова обычная',
    flavor: 'Знакомый круг вокруг дома перестал быть событием.',
    icon: '🚶',
  },
  get_up_easier: {
    title: 'Подъём с места спокойнее',
    flavor: 'Встать с дивана или кровати занимает меньше сбора.',
    icon: '🛏️',
  },
  legs_back_load_less: {
    title: 'День меньше оседает в спине и ногах',
    flavor: 'После обычных дел тело не выглядит выжатым — наблюдение, не диагноз.',
    icon: '🏠',
  },
  load_reduction_felt: {
    title: 'Свой вес несётся спокойнее',
    flavor: 'Повседневная нагрузка ощущается иначе. Это сигнал пути, не медицинский вывод.',
    icon: '⚖️',
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
    title: 'Каменные ступени не забирают всё дыхание',
    flavor: 'Подъём по ступеням больше не снимает всю выдержку.',
    icon: '🗻',
  },
  walk_easier_short: {
    title: 'Короткий выход снова обычный ход',
    flavor: 'Знакомый участок тропы не требует сбора.',
    icon: '🥾',
  },
  get_up_easier: {
    title: 'Подъём из лагеря спокойнее',
    flavor: 'Встать с камня или лежанки занимает меньше усилия.',
    icon: '🪨',
  },
  legs_back_load_less: {
    title: 'Дневная ноша меньше давит на стойку',
    flavor: 'После обычного перехода броня не кажется тяжелее — наблюдение, не диагноз.',
    icon: '🛡️',
  },
  load_reduction_felt: {
    title: 'Вес тела держится ровнее на маршруте',
    flavor: 'Повседневная нагрузка мягче. Это сигнал пути, не медицинский вывод.',
    icon: '⚖️',
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

const COZY_CATEGORY_FLAVOR: Record<string, string> = {
  appearance: 'Одежда и отражение в быту стали чуть свободнее.',
  measurements: 'Цифры сдвинулись. Дом опирается на замер, не на ощущение.',
  endurance: 'Маршрут держится дольше без лишнего сбора.',
  stairs_routes: 'Подъёмы в доме и дворе занимают меньше дня.',
  strength: 'Обычные тяжести в быту слушаются спокойнее.',
  flexibility: 'Наклон и поворот в комнате стали свободнее.',
  nutrition_control: 'Стол предсказуемее. Выбор снова на тарелке.',
  sleep_resource: 'Ночь и паузы лучше держат тепло дома.',
  alcohol_evening: 'Вечер остаётся ясным чаще.',
  sport_training: 'Нагрузка в движении легла в привычный ритм.',
  daily_life: 'Бытовые дела занимают меньше всего дня.',
  mobility: 'Тело свободнее входит в обычное движение.',
  confidence: 'В знакомой одежде и на знакомой дорожке спокойнее без громких слов.',
};

const DF_CATEGORY_FLAVOR: Record<string, string> = {
  appearance: 'Форма на карте стала собраннее. Без речи о зеркале как приговоре.',
  measurements: 'Цифры сдвинулись. Смотрим на след, не на легенду.',
  endurance: 'Переход держится дольше. Выдержка, не штурм.',
  stairs_routes: 'Каменные ступени занимают меньше дыхания.',
  strength: 'Ноша на маршруте слушается спокойнее.',
  flexibility: 'Скованность уступила место шагу.',
  nutrition_control: 'Рацион лагеря стал читаемее.',
  sleep_resource: 'Сон и паузы крепят позицию лучше рывка.',
  alcohol_evening: 'Ночной зов тише. Ясность держит караул.',
  sport_training: 'Нагрузка легла в контур, не в героизм.',
  daily_life: 'Быт лагеря занимает меньше всей выдержки.',
  mobility: 'Тело свободнее входит в движение по тропе.',
  confidence: 'Шаг увереннее в знакомой броне — без титула.',
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
        COZY_CATEGORY_FLAVOR[def?.category ?? ''] ??
        'Маленькое домашнее изменение: порядок в быту и свободнее движение.',
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
      DF_CATEGORY_FLAVOR[def?.category ?? ''] ??
      'Сдвиг на маршруте: движение свободнее, выдержка ровнее.',
    icon: override?.icon ?? baseIcon,
  };
}
