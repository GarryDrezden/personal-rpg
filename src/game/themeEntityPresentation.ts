import type { AppThemeId } from '../types/theme';
import type { BossId, CompanionId, MobId } from '../types/gameAssets';
import {
  getThemeAsset,
  getThemeAssetCandidates,
  type ThemeAssetRef,
} from './themeAssetRegistry';

export type ThemedEntityTone = 'battle' | 'cozy_challenge';

export type ThemedEntityPresentation = {
  entityId: string;
  themeId: AppThemeId;
  title: string;
  subtitle?: string;
  description?: string;
  imagePath: string;
  imageCandidates: string[];
  placeholder: boolean;
  tone: ThemedEntityTone;
  asset: ThemeAssetRef;
};

const COZY_MOB: Record<
  MobId,
  { title: string; subtitle: string; description: string }
> = {
  sofa_magnet: {
    title: 'Сонный плед',
    subtitle: 'Тянет остаться на диване',
    description: 'Мягкая тяжесть вечера. Уходит после короткой прогулки или зарядки.',
  },
  snack_chaos: {
    title: 'Вечерняя кладовая',
    subtitle: 'Хаос перекусов уходит в порядок',
    description: 'Когда на кухне нет опоры, тянет к лишнему. Честная отметка питания помогает.',
  },
  fog_of_fatigue: {
    title: 'Туман над двором',
    subtitle: 'Усталость смягчает день',
    description: 'Сон и короткая пауза разгоняют туман. Дом не требует идеальности.',
  },
  empty_day: {
    title: 'Тихая комната',
    subtitle: 'День без отметок',
    description: 'Даже минимальный ход возвращает тепло в комнату.',
  },
  impulse_of_rollback: {
    title: 'Скрипучая дверь',
    subtitle: 'Импульс отката',
    description: 'Один срыв не ломает дом. Вернись к простому шагу.',
  },
  night_call: {
    title: 'Ночной свет на кухне',
    subtitle: 'Поздний зов',
    description: 'Тёплый свет и короткий ритуал помогают не сорваться ночью.',
  },
  gray_heaviness: {
    title: 'Серая тяжесть',
    subtitle: 'Низкий ресурс',
    description: 'Восстановление и мягкий день возвращают ясность.',
  },
  sweet_whisper: {
    title: 'Сладкий шёпот',
    subtitle: 'Сладость зовёт',
    description: 'Порядок на кухне и честная отметка ослабляют шёпот.',
  },
};

const COZY_BOSS: Record<
  BossId,
  { title: string; subtitle: string; description: string }
> = {
  misty_baron: {
    title: 'Туманный двор',
    subtitle: 'Главная помеха главы',
    description: 'Заросшие дорожки и туман усталости. Расчистка и движение возвращают свет.',
  },
  resource_devourer: {
    title: 'Сквозняк усталости',
    subtitle: 'Главная помеха главы',
    description: 'Вытягивает силы. Сон, паузы и мягкий режим закрывают сквозняк.',
  },
  divan_king: {
    title: 'Плед без движения',
    subtitle: 'Главная помеха главы',
    description: 'Дом ждёт шага во двор. Даже короткая прогулка ослабляет плед.',
  },
  lord_of_empty_day: {
    title: 'Заброшенная комната',
    subtitle: 'Главная помеха главы',
    description: 'Пустые дни остужают дом. Любая честная отметка зажигает окно.',
  },
  chain_of_rollback: {
    title: 'Цепь старых привычек',
    subtitle: 'Главная помеха главы',
    description: 'Скрипит, но не держит навечно. Серия возвратов ослабляет звено.',
  },
  night_feast_baron: {
    title: 'Ночной стол без меры',
    subtitle: 'Главная помеха главы',
    description: 'Вечерний хаос на кухне. Порядок и честность возвращают тепло.',
  },
  promise_collector: {
    title: 'Стопка неначатого',
    subtitle: 'Главная помеха главы',
    description: 'Обещания без хода. Один маленький шаг важнее идеального плана.',
  },
  old_form_guardian: {
    title: 'Старый сарай привычек',
    subtitle: 'Главная помеха главы',
    description: 'Хранит старую форму. Двор, сад и регулярность открывают новую дверь.',
  },
};

const COZY_COMPANION: Record<
  CompanionId,
  { title: string; subtitle: string; description: string }
> = {
  golden_chinchilla_cat: {
    title: 'Кот у печки',
    subtitle: 'Домашний спутник',
    description: 'Греется там, где появляется уют. Ждёт спокойных вечеров.',
  },
  alabai: {
    title: 'Пёс во дворе',
    subtitle: 'Дворовой спутник',
    description: 'Рад движению и расчищенной тропинке.',
  },
  raven: {
    title: 'Птица на кормушке',
    subtitle: 'Садовый спутник',
    description: 'Прилетает, когда во дворе появляется порядок.',
  },
  fox_cub: {
    title: 'Лисёнок в саду',
    subtitle: 'Садовый спутник',
    description: 'Любопытный гость грядок и тёплых тропинок.',
  },
};

export function getMobPresentation(
  themeId: AppThemeId,
  mobId: MobId,
  darkMeta: { title: string; subtitle: string; description: string; image: string },
): ThemedEntityPresentation {
  if (themeId !== 'cozy') {
    return {
      entityId: mobId,
      themeId,
      title: darkMeta.title,
      subtitle: darkMeta.subtitle,
      description: darkMeta.description,
      imagePath: darkMeta.image,
      imageCandidates: [darkMeta.image],
      placeholder: false,
      tone: 'battle',
      asset: getThemeAsset({ themeId, kind: 'mob', entityId: mobId }),
    };
  }

  const cozy = COZY_MOB[mobId];
  const asset = getThemeAsset({ themeId: 'cozy', kind: 'mob', entityId: mobId });
  return {
    entityId: mobId,
    themeId: 'cozy',
    title: cozy.title,
    subtitle: cozy.subtitle,
    description: cozy.description,
    imagePath: asset.path,
    imageCandidates: getThemeAssetCandidates(asset),
    placeholder: true,
    tone: 'cozy_challenge',
    asset,
  };
}

export function getBossPresentation(
  themeId: AppThemeId,
  bossId: BossId,
  darkMeta: { title: string; subtitle?: string; description: string; image: string },
): ThemedEntityPresentation {
  if (themeId !== 'cozy') {
    return {
      entityId: bossId,
      themeId,
      title: darkMeta.title,
      subtitle: darkMeta.subtitle,
      description: darkMeta.description,
      imagePath: darkMeta.image,
      imageCandidates: [darkMeta.image],
      placeholder: false,
      tone: 'battle',
      asset: getThemeAsset({ themeId, kind: 'boss', entityId: bossId }),
    };
  }

  const cozy = COZY_BOSS[bossId];
  const asset = getThemeAsset({ themeId: 'cozy', kind: 'boss', entityId: bossId });
  return {
    entityId: bossId,
    themeId: 'cozy',
    title: cozy.title,
    subtitle: cozy.subtitle,
    description: cozy.description,
    imagePath: asset.path,
    imageCandidates: getThemeAssetCandidates(asset),
    placeholder: true,
    tone: 'cozy_challenge',
    asset,
  };
}

export function getCompanionPresentation(
  themeId: AppThemeId,
  companionId: CompanionId,
  darkMeta: { title: string; subtitle: string; description: string; image: string },
): ThemedEntityPresentation {
  if (themeId !== 'cozy') {
    return {
      entityId: companionId,
      themeId,
      title: darkMeta.title,
      subtitle: darkMeta.subtitle,
      description: darkMeta.description,
      imagePath: darkMeta.image,
      imageCandidates: [darkMeta.image],
      placeholder: false,
      tone: 'battle',
      asset: getThemeAsset({ themeId, kind: 'companion', entityId: companionId }),
    };
  }

  const cozy = COZY_COMPANION[companionId];
  const asset = getThemeAsset({
    themeId: 'cozy',
    kind: 'companion',
    entityId: companionId,
  });
  return {
    entityId: companionId,
    themeId: 'cozy',
    title: cozy.title,
    subtitle: cozy.subtitle,
    description: cozy.description,
    imagePath: asset.path,
    imageCandidates: getThemeAssetCandidates(asset),
    placeholder: true,
    tone: 'cozy_challenge',
    asset,
  };
}
