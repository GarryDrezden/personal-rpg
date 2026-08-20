import type {
  CozyHomeUpgradeLevel,
  CozyHomeZoneConfig,
  CozyHomeZoneId,
  CozyResourceId,
} from '../types/cozyHome';

export type { CozyHomeUpgradeLevel, CozyHomeZoneConfig };

/**
 * Economy v2 (2026-08-20): late upgrades cost more; early L1 stays cheap.
 * Already purchased zone levels are never recalculated. Only the next
 * unpaid upgrade uses these costs.
 */
export const COZY_HOME_ECONOMY_VERSION = 2;

export const COZY_RESOURCE_LABELS: Record<CozyResourceId, string> = {
  comfort: 'Уют',
  materials: 'Материалы',
  garden: 'Сад',
  clarity: 'Ясность',
};

export const COZY_HOME_ZONE_IDS: CozyHomeZoneId[] = [
  'porch',
  'hallway',
  'kitchen',
  'bedroom',
  'yard',
  'garden',
  'workshop',
  'pet_corner',
];

export const COZY_HOME_MAX_LEVEL = 3;
export const COZY_HOME_MAX_UPGRADES =
  COZY_HOME_ZONE_IDS.length * COZY_HOME_MAX_LEVEL;

/** Sum of resource units in a cost. Used for “долгий проект” copy, not rarity. */
export function sumCozyCost(
  cost: Partial<Record<CozyResourceId, number>> | undefined,
): number {
  if (!cost) return 0;
  return (Object.values(cost) as (number | undefined)[]).reduce<number>(
    (sum, n) => sum + (n ?? 0),
    0,
  );
}

export function isCozyLongProject(
  cost: Partial<Record<CozyResourceId, number>> | undefined,
): boolean {
  return sumCozyCost(cost) >= 40;
}

export const COZY_HOME_ZONES: CozyHomeZoneConfig[] = [
  {
    id: 'porch',
    title: 'Крыльцо',
    shortTitle: 'Крыльцо',
    description: 'Вход в дом — первый сигнал тепла.',
    icon: '🚪',
    category: 'house',
    levels: [
      { level: 0, title: 'Запущено', description: 'Старые доски, темно.' },
      {
        level: 1,
        title: 'Чисто',
        description: 'Убран мусор.',
        cost: { materials: 2 },
      },
      {
        level: 2,
        title: 'Ступени',
        description: 'Починены ступени.',
        cost: { materials: 20, comfort: 32 },
      },
      {
        level: 3,
        title: 'Фонарь',
        description: 'Тёплый фонарь у двери.',
        cost: { materials: 18, comfort: 80, clarity: 12 },
      },
    ],
  },
  {
    id: 'hallway',
    title: 'Прихожая',
    shortTitle: 'Прихожая',
    description: 'Порог, где начинается порядок.',
    icon: '🧥',
    category: 'house',
    levels: [
      {
        level: 0,
        title: 'Пыль',
        description: 'Пыльный вход и пустая вешалка.',
      },
      {
        level: 1,
        title: 'Подметено',
        description: 'Подметён пол.',
        cost: { comfort: 2 },
      },
      {
        level: 2,
        title: 'Скамья',
        description: 'Появилась скамья и крючки для вещей.',
        cost: { comfort: 40, clarity: 28 },
      },
      {
        level: 3,
        title: 'Мягкий свет',
        description: 'У двери горит мягкий свет.',
        cost: { comfort: 80, clarity: 48 },
      },
    ],
  },
  {
    id: 'kitchen',
    title: 'Кухня',
    shortTitle: 'Кухня',
    description: 'Место еды, тепла и заботы.',
    icon: '🍲',
    category: 'house',
    levels: [
      { level: 0, title: 'Пусто', description: 'Пустая кухня без тепла.' },
      {
        level: 1,
        title: 'Стол',
        description: 'Стол очищен.',
        cost: { comfort: 24, clarity: 8 },
      },
      {
        level: 2,
        title: 'Готовка',
        description: 'Появилась рабочая зона для готовки.',
        cost: { materials: 12, comfort: 48, clarity: 16 },
      },
      {
        level: 3,
        title: 'Очаг дома',
        description: 'Кухня стала тёплым центром дома.',
        cost: { comfort: 130, materials: 12, clarity: 24 },
      },
    ],
  },
  {
    id: 'bedroom',
    title: 'Спальня',
    shortTitle: 'Спальня',
    description: 'Место восстановления и сна.',
    icon: '🛏️',
    category: 'house',
    levels: [
      {
        level: 0,
        title: 'Холодно',
        description: 'Холодная комната без отдыха.',
      },
      {
        level: 1,
        title: 'Постель',
        description: 'Постель приведена в порядок.',
        cost: { comfort: 2 },
      },
      {
        level: 2,
        title: 'Занавески',
        description: 'Появились занавески и мягкий свет.',
        cost: { comfort: 56, clarity: 24 },
      },
      {
        level: 3,
        title: 'Восстановление',
        description: 'Комната стала местом восстановления.',
        cost: { comfort: 160, clarity: 28 },
      },
    ],
  },
  {
    id: 'yard',
    title: 'Двор',
    shortTitle: 'Двор',
    description: 'Пространство для движения у дома.',
    icon: '🪵',
    category: 'yard',
    levels: [
      { level: 0, title: 'Заросший', description: 'Заросший двор.' },
      {
        level: 1,
        title: 'Тропинка',
        description: 'Расчищена тропинка.',
        cost: { materials: 16, garden: 12 },
      },
      {
        level: 2,
        title: 'Дорожки',
        description: 'Появились дорожки и порядок.',
        cost: { materials: 14, garden: 20 },
      },
      {
        level: 3,
        title: 'Уютный двор',
        description: 'Двор стал уютным местом для движения.',
        cost: { materials: 16, garden: 42, comfort: 14 },
      },
    ],
  },
  {
    id: 'garden',
    title: 'Сад',
    shortTitle: 'Сад',
    description: 'Живая земля рядом с домом.',
    icon: '🌿',
    category: 'garden',
    levels: [
      { level: 0, title: 'Пусто', description: 'Пустая земля.' },
      {
        level: 1,
        title: 'Грядки',
        description: 'Первые грядки.',
        cost: { garden: 22 },
      },
      {
        level: 2,
        title: 'Цветы',
        description: 'Появились цветы и травы.',
        cost: { garden: 22, comfort: 28 },
      },
      {
        level: 3,
        title: 'Ожил',
        description: 'Сад ожил и стал частью дома.',
        cost: { garden: 48, comfort: 28 },
      },
    ],
  },
  {
    id: 'workshop',
    title: 'Мастерская',
    shortTitle: 'Мастерская',
    description: 'Угол для ремонта и больших улучшений.',
    icon: '🔧',
    category: 'house',
    levels: [
      {
        level: 0,
        title: 'Хаос',
        description: 'Пустой угол с инструментами.',
      },
      {
        level: 1,
        title: 'Порядок',
        description: 'Инструменты разобраны.',
        cost: { materials: 40, clarity: 20 },
      },
      {
        level: 2,
        title: 'Верстак',
        description: 'Появился рабочий стол.',
        cost: { materials: 22, clarity: 28 },
      },
      {
        level: 3,
        title: 'Готово',
        description: 'Мастерская готова к большим улучшениям.',
        cost: { materials: 28, clarity: 54 },
      },
    ],
  },
  {
    id: 'pet_corner',
    title: 'Уголок спутника',
    shortTitle: 'Спутник',
    description: 'Место отдыха для питомца.',
    icon: '🐾',
    category: 'companion',
    levels: [
      {
        level: 0,
        title: 'Пусто',
        description: 'Спутнику пока негде отдыхать.',
      },
      {
        level: 1,
        title: 'Миска',
        description: 'Появилась миска.',
        cost: { comfort: 24 },
      },
      {
        level: 2,
        title: 'Лежанка',
        description: 'Появилась лежанка.',
        cost: { comfort: 44, materials: 8 },
      },
      {
        level: 3,
        title: 'Уголок',
        description: 'У спутника есть своё уютное место.',
        cost: { comfort: 52, garden: 12, clarity: 12 },
      },
    ],
  },
];

export function getCozyZoneConfig(zoneId: CozyHomeZoneId): CozyHomeZoneConfig {
  return COZY_HOME_ZONES.find((z) => z.id === zoneId) ?? COZY_HOME_ZONES[0]!;
}

export function getCozyZoneLevelDef(
  zoneId: CozyHomeZoneId,
  level: number,
): CozyHomeUpgradeLevel {
  const zone = getCozyZoneConfig(zoneId);
  return (
    zone.levels.find((l) => l.level === level) ??
    zone.levels[0] ?? { level: 0, title: '—', description: '' }
  );
}

export function formatCozyCost(
  cost: Partial<Record<CozyResourceId, number>> | undefined,
): string {
  if (!cost) return '';
  return (Object.entries(cost) as [CozyResourceId, number][])
    .filter(([, n]) => n > 0)
    .map(([id, n]) => `${COZY_RESOURCE_LABELS[id]} ${n}`)
    .join(' · ');
}

export function getCozyEconomyTotals(): Record<CozyResourceId, number> {
  const totals: Record<CozyResourceId, number> = {
    comfort: 0,
    materials: 0,
    garden: 0,
    clarity: 0,
  };
  for (const zone of COZY_HOME_ZONES) {
    for (const level of zone.levels) {
      if (!level.cost) continue;
      for (const [id, n] of Object.entries(level.cost) as [CozyResourceId, number][]) {
        totals[id] += n ?? 0;
      }
    }
  }
  return totals;
}
