import type {
  BodyAbilityProgressionRing,
  BodyAbilityV1Category,
  BodyAbilityV1Def,
} from '../../types/bodyAbilityV1';
import { BODY_ABILITY_FUTURE_CATALOG } from './bodyAbilityFutureCatalog';

export const BODY_ABILITY_V1_CATEGORIES: Record<
  BodyAbilityV1Category,
  { label: string; description: string }
> = {
  mobility: { label: 'Мобильность', description: 'Движение в быту и пространстве' },
  endurance: { label: 'Выносливость', description: 'Запас хода и дыхание' },
  dailyLife: { label: 'Быт', description: 'Повседневные дела без лишней нагрузки' },
  confidence: { label: 'Уверенность', description: 'Спокойствие в теле и в движении' },
  clothing: { label: 'Одежда', description: 'Свобода в выборе и посадке' },
  recovery: { label: 'Восстановление', description: 'Мягкие дни и возвращение ресурса' },
  strength: { label: 'Сила', description: 'Сила в повседневных действиях' },
};

export const BODY_ABILITY_V1_TIER_LABELS = {
  early: 'Ранний этап',
  middle: 'Средний этап',
  late: 'Поздний этап',
} as const;

export const BODY_ABILITY_PROGRESSION_RING_LABELS: Record<
  BodyAbilityProgressionRing,
  { title: string; subtitle: string }
> = {
  early_signals: {
    title: 'Ранние сигналы тела',
    subtitle: 'Первые изменения, которые помогают заметить: персонаж уже движется.',
  },
  stable_form: {
    title: 'Устойчивая форма',
    subtitle: 'Следующий слой телесной свободы. Пока это дальний ориентир, а не обязанность.',
  },
  new_mobility: {
    title: 'Новая мобильность',
    subtitle: 'Поздние способности кампании — когда движение становится частью новой жизни.',
  },
};

const ACTIVE_V1: BodyAbilityV1Def[] = [
  {
    id: 'tie_shoes_easier',
    title: 'Легче завязать обувь',
    description: 'Наблюдение в жизни: наклон и мелкая моторика стали проще.',
    category: 'mobility',
    tier: 'early',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если в быту наклоны стали чуть легче — можно отметить способность.',
    hintSignals: ['weight_down', 'steps_stable'],
    icon: '👟',
  },
  {
    id: 'stand_from_floor',
    title: 'Легче встать с пола',
    description: 'Наблюдение в жизни: подъём с низкой опоры без лишнего напряжения.',
    category: 'mobility',
    tier: 'early',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если заметил, что встать с пола стало проще — отметь способность.',
    hintSignals: ['movement_habits', 'steps_stable'],
    icon: '🧎',
  },
  {
    id: 'stairs_breath',
    title: 'Меньше одышки после лестницы',
    description: 'Наблюдение в жизни: подъём по лестнице ощущается спокойнее.',
    category: 'endurance',
    tier: 'middle',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Возможно, тело уже отвечает на регулярные шаги. Если заметил — открой способность.',
    hintSignals: ['steps_5000_days', 'steps_stable'],
    icon: '🪜',
  },
  {
    id: 'long_route',
    title: 'Проще пройти длинный маршрут',
    description: 'Наблюдение в жизни: длинная прогулка или маршрут без обязательного отдыха.',
    category: 'endurance',
    tier: 'middle',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если длинные маршруты стали переноситься мягче — это наблюдение, не диагноз.',
    hintSignals: ['steps_8000_days', 'steps_5000_days'],
    icon: '🗺️',
  },
  {
    id: 'stand_easier',
    title: 'Проще стоять',
    description: 'Наблюдение в жизни: длительное стояние без постоянного дискомфорта.',
    category: 'mobility',
    tier: 'middle',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если стояние в быту стало легче — можешь отметить способность.',
    hintSignals: ['recovery_rhythm', 'steps_stable'],
    icon: '🧍',
  },
  {
    id: 'car_easier',
    title: 'Проще ездить в машине',
    description: 'Наблюдение в жизни: посадка и поездка ощущаются свободнее.',
    category: 'dailyLife',
    tier: 'middle',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если в поездках стало комфортнее — отметь, если это правда для тебя.',
    hintSignals: ['waist_down', 'weight_down'],
    icon: '🚗',
  },
  {
    id: 'clothing_freer',
    title: 'Одежда сидит свободнее',
    description: 'Наблюдение в жизни: выбор одежды и посадка без лишнего давления.',
    category: 'clothing',
    tier: 'middle',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если одежда стала сидеть свободнее — это наблюдение, а не обещание результата.',
    hintSignals: ['waist_down', 'weight_down'],
    icon: '👕',
  },
  {
    id: 'household_easier',
    title: 'Проще заниматься бытом',
    description: 'Наблюдение в жизни: домашние дела без постоянного «не дотягиваю».',
    category: 'dailyLife',
    tier: 'middle',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если быт стал переноситься легче — можешь отметить способность.',
    hintSignals: ['movement_habits', 'recovery_rhythm'],
    icon: '🏠',
  },
  {
    id: 'movement_confidence',
    title: 'Больше уверенности в движении',
    description: 'Наблюдение в жизни: спокойнее идти, выбирать маршрут, двигаться без стыда.',
    category: 'confidence',
    tier: 'late',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Возможно, тело уже отвечает на путь. Если чувствуешь больше уверенности — открой способность.',
    hintSignals: ['steps_8000_days', 'journal_entries'],
    icon: '✨',
  },
  {
    id: 'recovery_awareness',
    title: 'Мягче возвращаться после усталости',
    description: 'Наблюдение в жизни: recovery и минимальные дни помогают не выпадать.',
    category: 'recovery',
    tier: 'early',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если мягкие дни помогают удержать маршрут — это валидное наблюдение.',
    hintSignals: ['recovery_rhythm'],
    icon: '🔋',
  },
  {
    id: 'journal_clarity',
    title: 'Яснее видеть свой день',
    description: 'Наблюдение в жизни: дневник помогает замечать, что уже меняется.',
    category: 'confidence',
    tier: 'middle',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если записи помогают замечать улучшения — отметь способность.',
    hintSignals: ['journal_entries'],
    icon: '📓',
  },
  {
    id: 'stairs_easier',
    title: 'Легче подниматься по лестнице',
    description: 'Наблюдение в жизни: лестница перестала быть главным врагом дня.',
    category: 'endurance',
    tier: 'early',
    progressionRing: 'early_signals',
    availability: 'active',
    artStatus: 'inApp',
    unlockMode: 'manual',
    hint: 'Если лестница стала переноситься легче — можешь отметить способность.',
    hintSignals: ['steps_stable', 'steps_5000_days'],
    icon: '⬆️',
  },
];

export const BODY_ABILITIES_ACTIVE_V1 = ACTIVE_V1;

export const BODY_ABILITIES_V1: BodyAbilityV1Def[] = [
  ...ACTIVE_V1,
  ...BODY_ABILITY_FUTURE_CATALOG,
];

export const BODY_ABILITIES_ACTIVE_COUNT = ACTIVE_V1.length;
export const BODY_ABILITIES_FUTURE_COUNT = BODY_ABILITY_FUTURE_CATALOG.length;
export const BODY_ABILITIES_ROADMAP_TOTAL = BODY_ABILITIES_V1.length;

export function isBodyAbilityActive(ability: BodyAbilityV1Def): boolean {
  return ability.availability === 'active';
}

export function getActiveBodyAbilities(): BodyAbilityV1Def[] {
  return BODY_ABILITIES_V1.filter(isBodyAbilityActive);
}

export function getFutureBodyAbilities(): BodyAbilityV1Def[] {
  return BODY_ABILITIES_V1.filter((a) => a.availability === 'future');
}

export function getBodyAbilitiesByRing(
  ring: BodyAbilityProgressionRing,
): BodyAbilityV1Def[] {
  return BODY_ABILITIES_V1.filter((a) => a.progressionRing === ring);
}

export function getBodyAbilityV1ById(id: string): BodyAbilityV1Def | undefined {
  return BODY_ABILITIES_V1.find((a) => a.id === id);
}
