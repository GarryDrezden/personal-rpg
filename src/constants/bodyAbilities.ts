import type { BodyAbility, BodyAbilityBranch } from '../types/bodyAbilities';

export type BodyAbilityBranchMeta = {
  branch: BodyAbilityBranch;
  title: string;
  description: string;
  icon: string;
};

export const BODY_ABILITY_BRANCHES: BodyAbilityBranchMeta[] = [
  {
    branch: 'lightness',
    title: 'Легкость',
    description: 'Снижение веса возвращает свободу движения.',
    icon: '🪶',
  },
  {
    branch: 'endurance',
    title: 'Выносливость',
    description: 'Шаги и движение укрепляют запас хода.',
    icon: '👟',
  },
  {
    branch: 'control',
    title: 'Контроль',
    description: 'Учёт калорий и устойчивость режима.',
    icon: '🎯',
  },
  {
    branch: 'clarity',
    title: 'Ясность',
    description: 'Дни без алкоголя возвращают фокус.',
    icon: '💧',
  },
  {
    branch: 'recovery',
    title: 'Восстановление',
    description: 'Мягкие дни без выхода из системы.',
    icon: '🔋',
  },
  {
    branch: 'strength',
    title: 'Сила',
    description: 'Тренировки возвращают силовую ветку.',
    icon: '🏋️',
  },
];

export const BODY_ABILITY_BRANCH_MAP = Object.fromEntries(
  BODY_ABILITY_BRANCHES.map((b) => [b.branch, b]),
) as Record<BodyAbilityBranch, BodyAbilityBranchMeta>;

export const BODY_ABILITY_TIERS = {
  common: {
    label: 'Обычная',
    borderClass: 'border-[var(--app-border)]',
    badgeClass: 'bg-[var(--app-bg-soft)] text-[var(--app-text-muted)]',
  },
  rare: {
    label: 'Редкая',
    borderClass: 'border-blue-400/40',
    badgeClass: 'bg-blue-500/15 text-blue-400',
  },
  epic: {
    label: 'Эпическая',
    borderClass: 'border-violet-400/50',
    badgeClass: 'bg-violet-500/15 text-violet-400',
  },
  legendary: {
    label: 'Легендарная',
    borderClass: 'border-amber-400/60',
    badgeClass: 'bg-amber-500/20 text-amber-400',
  },
} as const;

export const BODY_ABILITIES: BodyAbility[] = [
  // ── Легкость ──
  {
    id: 'lightness_first_load',
    branch: 'lightness',
    tier: 'common',
    conditionType: 'weight_loss_kg',
    target: 1,
    icon: '🎒',
    title: 'Первый сброс груза',
    description: 'Первый килограмм позади. Путь начался не на словах, а в данных.',
    unlockText:
      'Ты снял первый килограмм груза. Это маленький шаг на весах, но большой сигнал системе: движение началось.',
    effectLabel: '+1 к Легкости',
    cozyText: {
      title: 'Первый сброс груза',
      description: 'Рюкзак стал чуть легче. Путь начался.',
      unlockText: 'Первый килограмм снят. Маленький шаг — большой сигнал, что движение началось.',
    },
    darkFantasyText: {
      title: 'Первая трещина в грузе',
      description: 'Проклятый груз ослаб на один узел.',
      unlockText: 'Печать тяжести дала первую трещину. Персонаж почувствовал: путь открыт.',
    },
  },
  {
    id: 'lightness_5kg',
    branch: 'lightness',
    tier: 'rare',
    conditionType: 'weight_loss_kg',
    target: 5,
    icon: '🪶',
    title: 'Легче двигаться',
    description: 'Первые 5 кг сняты. Тело получает немного больше свободы.',
    unlockText:
      'Минус 5 кг — это уже не случайность. Это часть груза, которую больше не нужно нести каждый день.',
    effectLabel: '+1 к Свободе движения',
    cozyText: {
      title: 'Легче двигаться',
      description: 'Рюкзак заметно легче. Двигаться становится проще.',
      unlockText: 'Пять килограммов груза сняты. Каждый шаг несёт меньше лишнего веса.',
    },
    darkFantasyText: {
      title: 'Груз ослаб',
      description: 'Проклятый груз потерял часть силы.',
      unlockText: 'Пять узлов печати разрушены. Персонаж движется свободнее.',
    },
  },
  {
    id: 'lightness_10kg',
    branch: 'lightness',
    tier: 'rare',
    conditionType: 'weight_loss_kg',
    target: 10,
    icon: '👣',
    title: 'Шаг стал свободнее',
    description: '10 кг позади. Каждый шаг несет меньше лишней нагрузки.',
    unlockText:
      'Ты снял с себя заметный груз. Движение становится не наказанием, а частью возвращения тела.',
    effectLabel: '+2 к Легкости',
    cozyText: {
      title: 'Шаг стал свободнее',
      description: 'Рюкзак стал легче. Двигаться становится проще.',
      unlockText: 'Ты снял заметную часть груза. Каждый шаг теперь несет меньше лишнего веса.',
    },
    darkFantasyText: {
      title: 'Печать тяжести ослабла',
      description: 'Проклятый груз стал слабее. Шаг персонажа свободнее.',
      unlockText:
        'Печать тяжести дала трещину. Ты снял часть груза, который держал персонажа у земли.',
    },
  },
  {
    id: 'lightness_20kg',
    branch: 'lightness',
    tier: 'epic',
    conditionType: 'weight_loss_kg',
    target: 20,
    icon: '⛓️',
    title: 'Скованность ослабла',
    description: '20 кг позади. Ограничения постепенно отступают.',
    unlockText:
      'Это уже большой этап. Не просто цифра: это груз, который больше не участвует в каждом подъеме, шаге и движении.',
    effectLabel: '+3 к Свободе тела',
    cozyText: {
      title: 'Скованность ослабла',
      description: 'Цепи груза ослабли. Тело получает больше свободы.',
      unlockText: 'Двадцать килограммов сняты. Ограничения постепенно отступают.',
    },
    darkFantasyText: {
      title: 'Цепи рвутся',
      description: 'Оковы тяжести теряют хватку.',
      unlockText: 'Двадцать узлов печати разрушены. Персонаж поднимается выше, чем когда-либо.',
    },
  },
  {
    id: 'lightness_30kg',
    branch: 'lightness',
    tier: 'epic',
    conditionType: 'weight_loss_kg',
    target: 30,
    icon: '🪽',
    title: 'Новая мобильность',
    description: '30 кг позади. Тело получает новый запас движения.',
    unlockText:
      'Ты прошел дистанцию, которую невозможно назвать случайной. Тело постепенно возвращает себе мобильность.',
    effectLabel: '+4 к Легкости',
    cozyText: {
      title: 'Новая мобильность',
      description: 'Тело получает новый запас движения.',
      unlockText: 'Тридцать килограммов позади. Это уже новая глава свободы.',
    },
    darkFantasyText: {
      title: 'Крылья пробудились',
      description: 'Груз отступил. Персонаж обретает новую мобильность.',
      unlockText: 'Тридцать узлов печати сняты. Путь персонажа открывается шире.',
    },
  },
  {
    id: 'lightness_50kg',
    branch: 'lightness',
    tier: 'legendary',
    conditionType: 'weight_loss_kg',
    target: 50,
    icon: '🔥',
    title: 'Большое перерождение',
    description: '50 кг позади. Это уже новая глава персонажа.',
    unlockText:
      'Ты снял огромный груз. Это не просто похудение — это большое возвращение возможностей тела.',
    effectLabel: '+10 к Свободе тела',
    cozyText: {
      title: 'Большое перерождение',
      description: 'Пятьдесят килограммов позади. Новая глава персонажа.',
      unlockText: 'Огромный груз снят. Это большое возвращение возможностей тела.',
    },
    darkFantasyText: {
      title: 'Великое освобождение',
      description: 'Печать тяжести разрушена. Персонаж перерождается.',
      unlockText: 'Пятьдесят узлов печати сняты. Это не похудение — это великое возвращение силы.',
    },
  },

  // ── Выносливость ──
  {
    id: 'endurance_minimum_week',
    branch: 'endurance',
    tier: 'common',
    conditionType: 'steps_days_minimum',
    target: 7,
    icon: '👟',
    title: 'База движения',
    description: '7 дней с минимумом шагов. Движение стало частью системы.',
    unlockText:
      'Ты удержал базу движения целую неделю. Это не рекорд, но именно такие недели строят фундамент.',
    effectLabel: '+1 к Выносливости',
  },
  {
    id: 'endurance_normal_week',
    branch: 'endurance',
    tier: 'rare',
    conditionType: 'steps_days_normal',
    target: 7,
    icon: '🥾',
    title: 'Неделя нормы',
    description: '7 дней с нормой шагов. Тело привыкает к регулярному движению.',
    unlockText:
      'Неделя нормы закрыта. Ты не просто ходил — ты создал устойчивый ритм движения.',
    effectLabel: '+2 к Выносливости',
  },
  {
    id: 'endurance_first_excellent',
    branch: 'endurance',
    tier: 'rare',
    conditionType: 'steps_days_excellent',
    target: 1,
    icon: '🏅',
    title: 'Отличный ход',
    description: 'Первый день на 14000+ шагов.',
    unlockText:
      'Ты вышел за норму и забрал максимум по движению. Отличный день для персонажа.',
    effectLabel: '+1 к Запасу хода',
  },
  {
    id: 'endurance_100k_steps',
    branch: 'endurance',
    tier: 'common',
    conditionType: 'steps_total',
    target: 100_000,
    icon: '🛤️',
    title: 'Сто тысяч шагов',
    description: '100 000 шагов суммарно.',
    unlockText: 'Сто тысяч шагов собраны. Большой путь складывается из обычных дней.',
    effectLabel: '+1 к Дистанции',
  },
  {
    id: 'endurance_500k_steps',
    branch: 'endurance',
    tier: 'epic',
    conditionType: 'steps_total',
    target: 500_000,
    icon: '🗺️',
    title: 'Большая дорога',
    description: '500 000 шагов суммарно.',
    unlockText:
      'Полмиллиона шагов. Персонаж уже не стоит на месте — он идет по карте всерьез.',
    effectLabel: '+3 к Выносливости',
  },
  {
    id: 'endurance_1m_steps',
    branch: 'endurance',
    tier: 'legendary',
    conditionType: 'steps_total',
    target: 1_000_000,
    icon: '🌍',
    title: 'Миллион шагов',
    description: '1 000 000 шагов суммарно.',
    unlockText:
      'Миллион шагов. Это не один героический день, а система, которая сработала снова и снова.',
    effectLabel: '+5 к Дистанции',
  },

  // ── Контроль ──
  {
    id: 'control_first_tracking',
    branch: 'control',
    tier: 'common',
    conditionType: 'calorie_tracking_days',
    target: 1,
    icon: '🧾',
    title: 'Система включена',
    description: 'Первый день учета калорий.',
    unlockText: 'Ты включил систему наблюдения. То, что измеряется, становится управляемым.',
    effectLabel: '+1 к Контролю',
  },
  {
    id: 'control_week_tracking',
    branch: 'control',
    tier: 'rare',
    conditionType: 'calorie_tracking_days',
    target: 7,
    icon: '📘',
    title: 'Неделя учета',
    description: '7 дней с внесенными калориями.',
    unlockText:
      'Неделя учета закрыта. Это уже не разовая попытка, а рабочий контур управления.',
    effectLabel: '+2 к Контролю',
  },
  {
    id: 'control_week_limit',
    branch: 'control',
    tier: 'rare',
    conditionType: 'calorie_limit_days',
    target: 7,
    icon: '🎯',
    title: 'Неделя в рамках',
    description: '7 дней в лимите калорий.',
    unlockText:
      'Ты удержал лимит целую неделю. Не идеальность, а повторяемость делает систему сильной.',
    effectLabel: '+2 к Управлению режимом',
  },
  {
    id: 'control_month_tracking',
    branch: 'control',
    tier: 'epic',
    conditionType: 'calorie_tracking_days',
    target: 30,
    icon: '📚',
    title: 'Месяц системы',
    description: '30 дней с учетом калорий.',
    unlockText: 'Месяц учета — это уже инженерная система, а не вспышка мотивации.',
    effectLabel: '+4 к Контролю',
  },
  {
    id: 'control_return_after_bad_day',
    branch: 'control',
    tier: 'epic',
    conditionType: 'return_after_bad_day',
    target: 1,
    icon: '🔁',
    title: 'Возврат без отката',
    description: 'Вернуться к учету после тяжелого дня.',
    unlockText:
      'Ты не обязан быть идеальным. Главное — не выпадать из системы. Возврат засчитан.',
    effectLabel: '+3 к Устойчивости',
  },

  // ── Ясность ──
  {
    id: 'clarity_first_day',
    branch: 'clarity',
    tier: 'common',
    conditionType: 'no_alcohol_days',
    target: 1,
    icon: '💧',
    title: 'День без тумана',
    description: 'Первый день без алкоголя.',
    unlockText: 'Один день ясности. Небольшой, но важный участок пути без лишнего тумана.',
    effectLabel: '+1 к Ясности',
  },
  {
    id: 'clarity_week',
    branch: 'clarity',
    tier: 'rare',
    conditionType: 'no_alcohol_days',
    target: 7,
    icon: '🌤️',
    title: 'Неделя ясности',
    description: '7 дней без алкоголя.',
    unlockText:
      'Неделя ясности закрыта. Режим получил пространство, в котором ему проще работать.',
    effectLabel: '+2 к Ясности',
  },
  {
    id: 'clarity_10_days',
    branch: 'clarity',
    tier: 'rare',
    conditionType: 'no_alcohol_days',
    target: 10,
    icon: '🧠',
    title: 'Голова в игре',
    description: '10 дней без алкоголя.',
    unlockText: 'Десять дней без тумана. Персонаж дольше остается в управляемом состоянии.',
    effectLabel: '+2 к Фокусу',
  },
  {
    id: 'clarity_30_days',
    branch: 'clarity',
    tier: 'epic',
    conditionType: 'no_alcohol_days',
    target: 30,
    icon: '🌕',
    title: 'Месяц ясности',
    description: '30 дней без алкоголя.',
    unlockText: 'Месяц ясности — большой участок пути, где система работала без лишнего хаоса.',
    effectLabel: '+5 к Ясности',
  },
  {
    id: 'clarity_90_days',
    branch: 'clarity',
    tier: 'legendary',
    conditionType: 'no_alcohol_days',
    target: 90,
    icon: '🔮',
    title: 'Чистый горизонт',
    description: '90 дней без алкоголя.',
    unlockText: 'Девяносто дней ясности. Это уже не просто серия — это новая архитектура режима.',
    effectLabel: '+10 к Фокусу',
  },

  // ── Восстановление ──
  {
    id: 'recovery_first_signal',
    branch: 'recovery',
    tier: 'common',
    conditionType: 'recovery_days',
    target: 1,
    icon: '🔋',
    title: 'Услышал тело',
    description: 'Первый день восстановления.',
    unlockText:
      'Ты не стал ломать систему через силу. Ты выбрал восстановление и сохранил управление.',
    effectLabel: '+1 к Восстановлению',
  },
  {
    id: 'recovery_minimal_day',
    branch: 'recovery',
    tier: 'common',
    conditionType: 'minimal_days',
    target: 1,
    icon: '🛡️',
    title: 'День удержан',
    description: 'Первый минимальный день без отката.',
    unlockText:
      'Сегодня не нужен был подвиг. Ты удержал базу — и этого достаточно, чтобы система продолжила работать.',
    effectLabel: '+1 к Устойчивости',
  },
  {
    id: 'recovery_5_days',
    branch: 'recovery',
    tier: 'rare',
    conditionType: 'recovery_days',
    target: 5,
    icon: '🤖',
    title: 'Не робот, но в игре',
    description: '5 дней восстановления с сохранением учета.',
    unlockText:
      'Ты не робот. Но ты остался в игре даже в дни, когда ресурс был ниже обычного.',
    effectLabel: '+2 к Устойчивости',
  },
  {
    id: 'recovery_10_days',
    branch: 'recovery',
    tier: 'epic',
    conditionType: 'recovery_days',
    target: 10,
    icon: '🌿',
    title: 'Система без героизма',
    description: '10 дней восстановления без выхода из режима.',
    unlockText:
      'Система стала устойчивее: она умеет работать не только в идеальные дни, но и в обычную жизнь.',
    effectLabel: '+4 к Восстановлению',
  },

  // ── Сила ──
  {
    id: 'strength_first_gym',
    branch: 'strength',
    tier: 'common',
    conditionType: 'gym_total',
    target: 1,
    icon: '🏋️',
    title: 'Первый вход в зал',
    description: 'Первая тренировка отмечена.',
    unlockText:
      'Ты вернул силовую ветку в игру. Не идеально, не навсегда — но первый вход сделан.',
    effectLabel: '+1 к Силе',
  },
  {
    id: 'strength_10_gym',
    branch: 'strength',
    tier: 'rare',
    conditionType: 'gym_total',
    target: 10,
    icon: '💪',
    title: 'Сила возвращается',
    description: '10 тренировок отмечено.',
    unlockText: 'Десять тренировок — это уже не случайность. Силовая ветка начинает оживать.',
    effectLabel: '+2 к Силе',
  },
  {
    id: 'strength_50_gym',
    branch: 'strength',
    tier: 'epic',
    conditionType: 'gym_total',
    target: 50,
    icon: '🗿',
    title: 'Крепкая база',
    description: '50 тренировок отмечено.',
    unlockText:
      'Пятьдесят тренировок. Это уже фундамент, на который можно ставить следующую форму.',
    effectLabel: '+5 к Силе',
  },
  {
    id: 'strength_100_gym',
    branch: 'strength',
    tier: 'legendary',
    conditionType: 'gym_total',
    target: 100,
    icon: '⚔️',
    title: 'Воин режима',
    description: '100 тренировок отмечено.',
    unlockText: 'Сто тренировок. Сила стала не событием, а частью персонажа.',
    effectLabel: '+10 к Силе',
  },
];

export const BODY_ABILITY_MAP = Object.fromEntries(
  BODY_ABILITIES.map((a) => [a.id, a]),
) as Record<string, BodyAbility>;
