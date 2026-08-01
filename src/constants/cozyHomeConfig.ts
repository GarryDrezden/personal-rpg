import type {
  CozyHomeUpgradeLevel,
  CozyHomeZoneConfig,
  CozyHomeZoneId,
  CozyResourceId,
} from '../types/cozyHome';

export type { CozyHomeUpgradeLevel, CozyHomeZoneConfig };

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
        cost: { materials: 4, comfort: 1 },
      },
      {
        level: 3,
        title: 'Фонарь',
        description: 'Тёплый фонарь у двери.',
        cost: { materials: 5, comfort: 3 },
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
        cost: { materials: 3, comfort: 2 },
      },
      {
        level: 3,
        title: 'Мягкий свет',
        description: 'У двери горит мягкий свет.',
        cost: { comfort: 4, clarity: 2 },
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
        cost: { comfort: 2, clarity: 1 },
      },
      {
        level: 2,
        title: 'Готовка',
        description: 'Появилась рабочая зона для готовки.',
        cost: { materials: 4, comfort: 3 },
      },
      {
        level: 3,
        title: 'Очаг дома',
        description: 'Кухня стала тёплым центром дома.',
        cost: { comfort: 5, clarity: 3 },
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
        cost: { comfort: 4, clarity: 1 },
      },
      {
        level: 3,
        title: 'Восстановление',
        description: 'Комната стала местом восстановления.',
        cost: { comfort: 6, clarity: 3 },
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
        cost: { materials: 2, garden: 1 },
      },
      {
        level: 2,
        title: 'Дорожки',
        description: 'Появились дорожки и порядок.',
        cost: { materials: 4, garden: 3 },
      },
      {
        level: 3,
        title: 'Уютный двор',
        description: 'Двор стал уютным местом для движения.',
        cost: { materials: 5, garden: 5 },
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
        cost: { garden: 2 },
      },
      {
        level: 2,
        title: 'Цветы',
        description: 'Появились цветы и травы.',
        cost: { garden: 4, comfort: 2 },
      },
      {
        level: 3,
        title: 'Ожил',
        description: 'Сад ожил и стал частью дома.',
        cost: { garden: 6, comfort: 3 },
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
        cost: { materials: 3 },
      },
      {
        level: 2,
        title: 'Верстак',
        description: 'Появился рабочий стол.',
        cost: { materials: 5, clarity: 1 },
      },
      {
        level: 3,
        title: 'Готово',
        description: 'Мастерская готова к большим улучшениям.',
        cost: { materials: 7, clarity: 3 },
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
        cost: { comfort: 2 },
      },
      {
        level: 2,
        title: 'Лежанка',
        description: 'Появилась лежанка.',
        cost: { comfort: 4, materials: 2 },
      },
      {
        level: 3,
        title: 'Уголок',
        description: 'У спутника есть своё уютное место.',
        cost: { comfort: 5, garden: 2 },
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
