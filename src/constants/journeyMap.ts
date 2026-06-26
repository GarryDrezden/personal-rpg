import type { JourneyStage } from '../types/journeyMap';

export const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'stage_01_system_awakening',
    order: 1,
    icon: '🌱',
    title: 'Пробуждение системы',
    subtitle: 'Первые данные внесены',
    description: 'Путь начинается не с идеального дня, а с первого сигнала системе.',
    completedText: 'Система включена. Теперь путь можно не угадывать, а видеть.',
    conditions: [
      {
        id: 'first_weight_entry',
        type: 'weight_entry',
        target: 1,
        title: 'Внести первый вес',
      },
      {
        id: 'first_calorie_tracking',
        type: 'calorie_tracking_days',
        target: 1,
        title: 'Внести калории за первый день',
      },
    ],
    cozyText: {
      title: 'Пробуждение системы',
      description: 'Первые записи появились. Путь стал видимым.',
      completedText: 'Система проснулась. Теперь каждый день может стать шагом вперед.',
    },
    darkFantasyText: {
      title: 'Пробуждение ядра',
      description: 'Первые данные зажгли внутреннее ядро персонажа.',
      completedText: 'Ядро пробудилось. Карта пути открыта.',
    },
  },
  {
    id: 'stage_02_first_load_removed',
    order: 2,
    icon: '🎒',
    title: 'Первый сброс груза',
    subtitle: 'Начало реального движения',
    description: 'Первый вес ушел, и система получила доказательство: движение началось.',
    completedText: 'Первый груз снят. Это уже не план, а факт.',
    conditions: [
      {
        id: 'weight_loss_1kg',
        type: 'weight_loss_kg',
        target: 1,
        title: 'Снизить вес на 1 кг',
      },
      {
        id: 'tracking_3_days',
        type: 'calorie_tracking_days',
        target: 3,
        title: 'Вести учет 3 дня',
      },
      {
        id: 'steps_minimum_1_day',
        type: 'steps_days_minimum',
        target: 1,
        title: 'Сделать минимум шагов хотя бы 1 день',
      },
    ],
    cozyText: {
      title: 'Первый сброс груза',
      description: 'Рюкзак стал чуть легче. Движение началось по-настоящему.',
      completedText: 'Первый груз снят. Это уже не план — это факт на карте.',
    },
    darkFantasyText: {
      title: 'Первая трещина в грузе',
      description: 'Печать тяжести ослабла. Персонаж сделал первый реальный шаг.',
      completedText: 'Груз снят. Путь перестал быть догадкой — он стал картой.',
    },
  },
  {
    id: 'stage_03_movement_base',
    order: 3,
    icon: '👟',
    title: 'База движения',
    subtitle: 'Тело снова входит в ритм',
    description: 'Движение становится не случайностью, а частью системы.',
    completedText:
      'База движения собрана. Теперь путь держится не на мотивации, а на повторяемости.',
    conditions: [
      {
        id: 'steps_minimum_7_days',
        type: 'steps_days_minimum',
        target: 7,
        title: '7 дней с минимумом шагов',
      },
      {
        id: 'tracking_7_days',
        type: 'calorie_tracking_days',
        target: 7,
        title: '7 дней учета калорий',
      },
      {
        id: 'no_alcohol_3_days',
        type: 'no_alcohol_days',
        target: 3,
        title: '3 дня без алкоголя',
      },
    ],
  },
  {
    id: 'stage_04_regime_control',
    order: 4,
    icon: '🎯',
    title: 'Контроль режима',
    subtitle: 'Система становится управляемой',
    description: 'Режим начинает работать не только в хорошие дни, но и в обычную жизнь.',
    completedText: 'Контроль режима закреплен. У системы появился устойчивый контур.',
    conditions: [
      {
        id: 'calorie_limit_7_days',
        type: 'calorie_limit_days',
        target: 7,
        title: '7 дней в лимите калорий',
      },
      {
        id: 'no_alcohol_7_days',
        type: 'no_alcohol_days',
        target: 7,
        title: '7 дней без алкоголя',
      },
      {
        id: 'minimal_or_recovery_1_day',
        type: 'recovery_days',
        target: 1,
        title: '1 день восстановления без выхода из режима',
      },
    ],
  },
  {
    id: 'stage_05_endurance_return',
    order: 5,
    icon: '🥾',
    title: 'Возврат выносливости',
    subtitle: 'Шаг становится увереннее',
    description:
      'Тело получает больше регулярного движения и начинает выдерживать дистанцию.',
    completedText:
      'Выносливость возвращается. Персонаж уже не просто стартовал — он держит путь.',
    conditions: [
      {
        id: 'weight_loss_5kg',
        type: 'weight_loss_kg',
        target: 5,
        title: 'Снизить вес на 5 кг',
      },
      {
        id: 'steps_normal_7_days',
        type: 'steps_days_normal',
        target: 7,
        title: '7 дней с нормой шагов',
      },
      {
        id: 'steps_excellent_1_day',
        type: 'steps_days_excellent',
        target: 1,
        title: '1 день на 14000+ шагов',
      },
    ],
  },
  {
    id: 'stage_06_constraints_weakened',
    order: 6,
    icon: '⛓️',
    title: 'Скованность ослабла',
    subtitle: 'Груз становится меньше',
    description: 'Часть лишней нагрузки уже снята. Тело получает больше свободы.',
    completedText: 'Скованность ослабла. Каждый следующий шаг несет меньше лишнего груза.',
    conditions: [
      {
        id: 'weight_loss_10kg',
        type: 'weight_loss_kg',
        target: 10,
        title: 'Снизить вес на 10 кг',
      },
      {
        id: 'body_abilities_5_unlocked',
        type: 'body_abilities_unlocked',
        target: 5,
        title: 'Открыть 5 способностей тела',
      },
      {
        id: 'gym_5_total',
        type: 'gym_total',
        target: 5,
        title: 'Отметить 5 тренировок',
      },
    ],
    cozyText: {
      title: 'Груз стал легче',
      description: 'Рюкзак постепенно освобождается. Двигаться становится проще.',
      completedText: 'Большая часть груза уже снята. Путь стал легче.',
    },
    darkFantasyText: {
      title: 'Печать тяжести ослабла',
      description: 'Проклятый груз больше не держит персонажа так крепко.',
      completedText: 'Печать дала трещину. Шаг стал свободнее.',
    },
  },
  {
    id: 'stage_07_stable_system',
    order: 7,
    icon: '🛡️',
    title: 'Устойчивая система',
    subtitle: 'Режим переживает сложные дни',
    description:
      'Система уже умеет работать без героизма: с восстановлением, возвратами и минимальными днями.',
    completedText:
      'Система стала устойчивой. Она держится не на идеальности, а на возвращении в игру.',
    conditions: [
      {
        id: 'return_after_bad_day_1',
        type: 'return_after_bad_day',
        target: 1,
        title: 'Вернуться к учету после тяжелого дня',
      },
      {
        id: 'recovery_days_5',
        type: 'recovery_days',
        target: 5,
        title: '5 дней восстановления или минимального режима',
      },
      {
        id: 'no_alcohol_30_days',
        type: 'no_alcohol_days',
        target: 30,
        title: '30 дней без алкоголя',
      },
    ],
  },
  {
    id: 'stage_08_new_mobility',
    order: 8,
    icon: '🪽',
    title: 'Новая мобильность',
    subtitle: 'Тело получает больше свободы',
    description: 'Путь уже достаточно длинный, чтобы изменения ощущались не только в цифрах.',
    completedText:
      'Новая мобильность открыта. Персонаж прошел большой участок возвращения тела.',
    conditions: [
      {
        id: 'weight_loss_20kg',
        type: 'weight_loss_kg',
        target: 20,
        title: 'Снизить вес на 20 кг',
      },
      {
        id: 'steps_total_500k',
        type: 'steps_total',
        target: 500_000,
        title: 'Собрать 500 000 шагов',
      },
      {
        id: 'body_abilities_10_unlocked',
        type: 'body_abilities_unlocked',
        target: 10,
        title: 'Открыть 10 способностей тела',
      },
    ],
  },
  {
    id: 'stage_09_big_rebirth',
    order: 9,
    icon: '🔥',
    title: 'Большое перерождение',
    subtitle: 'Новая глава персонажа',
    description: 'Это уже не попытка начать. Это пройденный путь, который изменил персонажа.',
    completedText:
      'Большое перерождение завершено. Персонаж прошел путь от перегруза к новой свободе тела.',
    conditions: [
      {
        id: 'weight_loss_50kg',
        type: 'weight_loss_kg',
        target: 50,
        title: 'Снизить вес на 50 кг',
      },
      {
        id: 'steps_total_1m',
        type: 'steps_total',
        target: 1_000_000,
        title: 'Собрать 1 000 000 шагов',
      },
      {
        id: 'gym_50_total',
        type: 'gym_total',
        target: 50,
        title: 'Отметить 50 тренировок',
      },
      {
        id: 'body_abilities_20_unlocked',
        type: 'body_abilities_unlocked',
        target: 20,
        title: 'Открыть 20 способностей тела',
      },
    ],
    cozyText: {
      title: 'Большое перерождение',
      description: 'Путь пройден. Персонаж вернул себе новую свободу.',
      completedText: 'Новая глава открыта. Это уже не попытка — это пройденный маршрут.',
    },
    darkFantasyText: {
      title: 'Великое перерождение',
      description: 'Печать перегруза разрушена. Персонаж обрел новую форму.',
      completedText: 'Великий путь завершён. От перегруза — к новой свободе тела.',
    },
  },
];

export const JOURNEY_STAGE_MAP = Object.fromEntries(
  JOURNEY_STAGES.map((s) => [s.id, s]),
) as Record<string, JourneyStage>;
