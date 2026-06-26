import type { MomentumLevel } from '../types/momentum';

export const MOMENTUM_LEVELS: MomentumLevel[] = [
  {
    id: 'lost_speed',
    min: -100,
    max: -40,
    title: 'Потеря хода',
    description:
      'Система потеряла скорость. Сейчас важнее не разгоняться, а снова сдвинуться.',
    icon: '🧊',
    helpDescription:
      'Доступен режим возврата: минимальный день, облегченные шаги и простая база.',
  },
  {
    id: 'dip',
    min: -39,
    max: -10,
    title: 'Просадка',
    description:
      'Инерция просела, но путь не оборван. Один базовый день уже начнет возвращать ход.',
    icon: '🌫️',
    helpDescription: 'Лучше не давить максимум, а собрать базовый день.',
  },
  {
    id: 'neutral',
    min: -9,
    max: 9,
    title: 'Нейтрально',
    description: 'Система в нейтральной зоне. Сегодня можно задать направление.',
    icon: '⚪',
  },
  {
    id: 'stable',
    min: 10,
    max: 39,
    title: 'Стабильный ход',
    description: 'Режим начал держаться. Повторяемость уже работает на тебя.',
    icon: '🟢',
    bonusDescription: '+5% XP за дневные квесты.',
  },
  {
    id: 'boost',
    min: 40,
    max: 69,
    title: 'Хороший разгон',
    description:
      'Система набрала ход. Следующие дни становятся проще за счет накопленной базы.',
    icon: '🔥',
    bonusDescription: '+10% XP и возможность бонусной монеты за сильный день.',
  },
  {
    id: 'flow',
    min: 70,
    max: 100,
    title: 'Поток',
    description: 'Ты в потоке. Не нужно давить сильнее — достаточно не ломать ритм.',
    icon: '🌊',
    bonusDescription: '+15% XP и дополнительная монета за день с базой.',
  },
];

export const MOMENTUM_STORAGE_KEY = 'personal-rpg-momentum-history';

export const MOMENTUM_DECAY = 0.92;

export const MOMENTUM_LIMITS = {
  min: -100,
  max: 100,
};

export const MOMENTUM_XP_MULTIPLIERS: Record<MomentumLevel['id'], number> = {
  lost_speed: 1,
  dip: 1,
  neutral: 1,
  stable: 1.05,
  boost: 1.1,
  flow: 1.15,
};
