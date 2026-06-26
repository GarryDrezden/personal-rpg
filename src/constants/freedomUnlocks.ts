import type { FreedomScoreLevelId } from '../types/freedomScore';
import type { FreedomLevelUnlock } from '../types/freedomUnlock';

export type FreedomLevelUnlockDef = Omit<FreedomLevelUnlock, 'score'>;

export const FREEDOM_LEVEL_UNLOCKS: Partial<
  Record<FreedomScoreLevelId, FreedomLevelUnlockDef>
> = {
  first_relief: {
    levelId: 'first_relief',
    title: 'Новая стадия свободы',
    description: 'Первое облегчение',
    unlockText:
      'Система уже не просто проснулась — появились первые признаки возвращения движения и контроля.',
    icon: '🎒',
    xpReward: 50,
    coinReward: 1,
  },
  movement_return: {
    levelId: 'movement_return',
    title: 'Новая стадия свободы',
    description: 'Возвращение движения',
    unlockText:
      'Тело постепенно возвращает себе ритм. Прогресс уже строится не только на весе, но и на устойчивых действиях.',
    icon: '👟',
    xpReward: 100,
    coinReward: 2,
  },
  stable_base: {
    levelId: 'stable_base',
    title: 'Новая стадия свободы',
    description: 'Сильная база',
    unlockText:
      'Режим стал устойчивее. Он держится не на героизме, а на повторяемости и возврате в систему.',
    icon: '🛡️',
    xpReward: 150,
    coinReward: 3,
  },
  new_form: {
    levelId: 'new_form',
    title: 'Новая стадия свободы',
    description: 'Новая форма',
    unlockText:
      'Персонаж прошел большой путь. Свобода тела уже ощущается как новая глава, а не как временная попытка.',
    icon: '🪽',
    xpReward: 250,
    coinReward: 5,
  },
  rebirth: {
    levelId: 'rebirth',
    title: 'Новая стадия свободы',
    description: 'Перерождение',
    unlockText:
      'Это уже не просто прогресс. Это большое возвращение возможностей тела, контроля и движения.',
    icon: '🔥',
    xpReward: 500,
    coinReward: 10,
  },
};

export const FREEDOM_UNLOCK_MODAL_THEME = {
  cozy: {
    heading: 'Новая стадия свободы',
    continueLabel: 'Продолжить путь',
  },
  darkFantasy: {
    heading: 'Новая стадия пробуждена',
    continueLabel: 'Продолжить путь',
  },
} as const;
