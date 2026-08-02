/**
 * Cozy Content Pack v1 — presentation-only copy for themeId === 'cozy'.
 * Core entity IDs stay shared with Dark Fantasy; titles/descriptions diverge.
 */
import type { BossId, MobId } from '../types/gameAssets';

export type CozyEntityCopy = {
  title: string;
  subtitle: string;
  description: string;
};

export type CozyJourneyChapterCopy = {
  title: string;
  description: string;
  completedText: string;
};

export type CozyReactionCopy = {
  headline: string;
  detail: string;
};

/** Journey stage IDs → Cozy chapter titles (home / yard / garden). */
export const COZY_JOURNEY_CHAPTERS: Record<string, CozyJourneyChapterCopy> = {
  stage_01_system_awakening: {
    title: 'Первый свет в доме',
    description:
      'Дом ещё тихий, но первый день уже открывает окно. Появляется ощущение, что сюда можно вернуться.',
    completedText: 'Первый свет зажжён. Дом снова замечает, что в нём кто-то живёт.',
  },
  stage_02_first_load_removed: {
    title: 'Расчищенное крыльцо',
    description:
      'Первые действия убирают завалы у входа. Путь внутрь становится проще, а день — понятнее.',
    completedText: 'Крыльцо свободно. В дом снова легко зайти.',
  },
  stage_03_movement_base: {
    title: 'Тропинка во дворе',
    description:
      'Движение возвращает форму маршрутам. Двор перестаёт быть заросшим местом и снова становится частью жизни.',
    completedText: 'Тропинка протоптана. Двор снова связан с домом.',
  },
  stage_04_regime_control: {
    title: 'Порядок на кухне',
    description:
      'Ритм питания и учёта приносит дому опору. На столе появляется место для спокойного выбора.',
    completedText: 'На кухне появился порядок. День опирается на простой ритм.',
  },
  stage_05_endurance_return: {
    title: 'Дыхание сада',
    description:
      'Шаги, сон и восстановление дают саду первые ростки. Тело начинает отвечать не рывком, а устойчивостью.',
    completedText: 'Сад дышит ровнее. Тело держит мягкий ритм.',
  },
  stage_06_constraints_weakened: {
    title: 'Тёплая комната',
    description:
      'Груз становится легче. В доме появляется место, где можно выдохнуть и заметить изменения.',
    completedText: 'В комнате стало теплее. Груз больше не занимает всё пространство.',
  },
  stage_07_stable_system: {
    title: 'Дом держит тепло',
    description:
      'Система уже не держится на одном усилии. Дом, тело и день начинают поддерживать друг друга.',
    completedText: 'Дом держит тепло сам. Возвращение стало привычкой, а не подвигом.',
  },
  stage_08_new_mobility: {
    title: 'Открытые окна',
    description:
      'Движение становится свободнее, маршруты длиннее, а пространство вокруг — шире.',
    completedText: 'Окна открыты. Дом и двор дышат шире.',
  },
  stage_09_big_rebirth: {
    title: 'Живой дом',
    description:
      'Дом больше не ждёт восстановления — он живёт вместе с героем. Это новая форма, новый ритм и новая глава.',
    completedText: 'Дом живой. Новая глава начинается из тёплого пространства.',
  },
};

export const COZY_BOSS_COPY: Record<BossId, CozyEntityCopy> = {
  misty_baron: {
    title: 'Туманное утро',
    subtitle: 'Главная помеха',
    description:
      'День начинается мутно и тяжело. Небольшие действия помогают проветрить дом и голову.',
  },
  resource_devourer: {
    title: 'Сквозняк усталости',
    subtitle: 'Главная помеха',
    description:
      'Ресурс уходит через щели: плохой сон, перегруз и отсутствие пауз. Дом просит тепла и восстановления.',
  },
  divan_king: {
    title: 'Застоявшийся угол',
    subtitle: 'Главная помеха',
    description:
      'В доме есть место, где всё замирает. Движение и маленький маршрут возвращают туда жизнь.',
  },
  lord_of_empty_day: {
    title: 'Заброшенная комната',
    subtitle: 'Главная помеха',
    description:
      'Комната кажется пустой, пока в ней не появляется хотя бы один след дня. Любые данные возвращают свет.',
  },
  chain_of_rollback: {
    title: 'Старый узел привычек',
    subtitle: 'Главная помеха',
    description:
      'Старые сценарии стягивают день назад. Возврат к простому действию помогает развязать узел.',
  },
  night_feast_baron: {
    title: 'Ночная кладовая',
    subtitle: 'Главная помеха',
    description:
      'Вечером дом зовёт к быстрым запасам и усталым решениям. Спокойный ритуал закрывает дверь мягче.',
  },
  promise_collector: {
    title: 'Полка отложенных дел',
    subtitle: 'Главная помеха',
    description:
      'На полке копятся обещания «с понедельника». Маленький шаг сегодня лучше новой большой клятвы.',
  },
  old_form_guardian: {
    title: 'Старое зеркало',
    subtitle: 'Главная помеха',
    description:
      'Старое отражение не всегда замечает изменения. Данные, замеры и способности тела показывают путь честнее.',
  },
};

export const COZY_MOB_COPY: Record<MobId, CozyEntityCopy> = {
  sofa_magnet: {
    title: 'Сонный плед',
    subtitle: 'Помеха дня',
    description:
      'Плед тянет остаться на месте. Достаточно короткого маршрута, чтобы день не застыл.',
  },
  snack_chaos: {
    title: 'Открытая кладовая',
    subtitle: 'Помеха дня',
    description:
      'Кладовая шепчет быстрые решения. Запись питания возвращает выбор на стол.',
  },
  fog_of_fatigue: {
    title: 'Туман над двором',
    subtitle: 'Помеха дня',
    description:
      'Двор будто в дымке после нагрузки или плохого сна. Восстановление сегодня важнее рывка.',
  },
  empty_day: {
    title: 'Тихая комната',
    subtitle: 'Помеха дня',
    description:
      'В комнате пока тихо. Даже минимальный след дня возвращает туда тепло.',
  },
  impulse_of_rollback: {
    title: 'Скользкая ступенька',
    subtitle: 'Помеха дня',
    description:
      'Старый шаг легко уводит вниз. Один спокойный возврат удерживает маршрут.',
  },
  night_call: {
    title: 'Свет из кухни',
    subtitle: 'Помеха дня',
    description:
      'Поздний свет зовёт к автоматическим решениям. Мягкое закрытие дня помогает погасить его.',
  },
  gray_heaviness: {
    title: 'Тяжёлое одеяло',
    subtitle: 'Помеха дня',
    description:
      'Тело просит тишины. Сегодня можно удержать путь через минимальный день или восстановление.',
  },
  sweet_whisper: {
    title: 'Банка варенья',
    subtitle: 'Помеха дня',
    description:
      'Не враг, а сладкий голос усталости. Запись и спокойная порция помогают не терять ритм.',
  },
};

export type CozyTodayReactionKey =
  | 'minimal'
  | 'recovery'
  | 'heavy_physical'
  | 'physical'
  | 'steps'
  | 'low_resource'
  | 'nutrition'
  | 'quests_progress'
  | 'points_saved'
  | 'empty_saved'
  | 'default'
  | 'alcohol_free'
  | 'good_day';

export const COZY_TODAY_REACTIONS: Record<CozyTodayReactionKey, CozyReactionCopy> = {
  minimal: {
    headline: 'Минимальный день тоже удержал дом живым.',
    detail: 'Один маленький след лучше тишины.',
  },
  recovery: {
    headline: 'Дом не требует рывка.',
    detail: 'Сегодня тепло возвращается через сон, паузы и восстановление.',
  },
  heavy_physical: {
    headline: 'Тело сегодня работало.',
    detail:
      'Материалы для ремонта появились не из шагов, а из настоящей нагрузки.',
  },
  physical: {
    headline: 'Движение тела вернуло жизнь во двор.',
    detail: 'Шагов могло быть мало, но дом уже получил тепло от нагрузки.',
  },
  steps: {
    headline: 'Маршрут дня отмечен.',
    detail: 'Тропинка снова помнит шаги. Завтра можно вернуться мягче.',
  },
  low_resource: {
    headline: 'Ресурс просел.',
    detail: 'Сегодня дом просит мягкого режима, а не подвига.',
  },
  nutrition: {
    headline: 'На столе появился порядок.',
    detail: 'День уже не потерян — питание оставило след.',
  },
  alcohol_free: {
    headline: 'Вечер остался ясным.',
    detail: 'В доме стало тише и светлее.',
  },
  good_day: {
    headline: 'День оставил тёплый след.',
    detail: 'В доме стало чуть больше порядка, а маршрут удержан.',
  },
  quests_progress: {
    headline: 'Дом получил след заботы.',
    detail: 'Задачи дня сделали пространство чуть теплее и понятнее.',
  },
  points_saved: {
    headline: 'День оставил след.',
    detail: 'Дом стал теплее — можно возвращаться завтра без давления.',
  },
  empty_saved: {
    headline: 'День сохранён.',
    detail: 'Дом пока тихий, но уже ждёт следующую отметку.',
  },
  default: {
    headline: 'Маршрут удержан.',
    detail: 'День сохранён. Достаточно, что дом снова заметил заботу.',
  },
};

export const COZY_QUEST_COPY: Record<
  string,
  { title: string; actionLabel?: string }
> = {
  nutrition_precise: { title: 'Питание отмечено', actionLabel: 'Отметить питание' },
  nutrition_simple: { title: 'Питание отмечено', actionLabel: 'Отметить питание' },
  steps: { title: 'Маршрут дня', actionLabel: 'Отметить маршрут' },
  alcohol: { title: 'Ясный вечер', actionLabel: 'Отметить' },
  morningExercise: { title: 'Движение тела' },
  journal: { title: 'Строка в дневнике дома' },
  gym: { title: 'Движение тела' },
  cooking: { title: 'Порядок на кухне' },
  repair: { title: 'Ремонт дома' },
  plants: { title: 'Забота о саде' },
  hobby: { title: 'Тёплое время для себя' },
  resource: { title: 'Ресурс дома' },
};

export const COZY_DASHBOARD_COPY = {
  headerIdle: 'Сегодня дом ждёт маленького шага.',
  headerWarm: 'Дом стал теплее — порядок возвращается.',
  headerHeld: 'Маршрут удержан. День оставил след.',
  openDayLabel: 'Открыть день',
  openDaySubtitle:
    'Отметь питание, движение или ресурс — и день уже оставит след.',
  challengeHint: 'Задачи дня помогают вернуть туда свет.',
  obstacleHint: 'Даже минимальный день возвращает тепло.',
  questsTitle: 'Задачи дня',
  openQuests: 'Все задачи →',
  mood: {
    idle: 'Дом ждёт шага',
    warming: 'Порядок возвращается',
    held: 'Маршрут удержан',
    good: 'День оставил след',
    great: 'Дом стал теплее',
  },
  rank: {
    20: 'Хранитель живого дома',
    15: 'Мастер тёплого ритма',
    10: 'Хозяин двора',
    7: 'Садовник пути',
    4: 'Уверенный ремонт',
    2: 'Жилец с метлой',
    0: 'Новый жилец',
  },
} as const;

export const COZY_SEASON_COPY = {
  eyebrow: 'Садовый журнал',
  title: 'Сезонный дневник',
  careTraces: 'Следы заботы',
  notes: 'Сезонные заметки',
  reward: 'Награда сезона — тёплый след дома',
  intro:
    'Сезон — арка дневника, а не календарный месяц. Дом собирает следы заботы, пока текущая страница не собрана. Пропущенные дни не закрывают сезон сами — новая страница откроется после этой.',
  empty:
    'Сезон ещё не оставил следов. Первый день уже начнёт дневник.',
} as const;

export const COZY_EMPTY_STATES = {
  noDayData: {
    title: 'Дом пока тихий',
    description:
      'Отметь хотя бы один след дня — питание, маршрут или ресурс.',
  },
  noResources: {
    title: 'Ресурсы пока спят',
    description:
      'Сохрани день, и дом получит первые материалы.',
  },
  noUpgrades: {
    title: 'Зона ждёт своего часа',
    description:
      'Сегодняшние действия могут приблизить восстановление.',
  },
  noSeason: {
    title: 'Сезон ещё тих',
    description:
      'Сезон ещё не оставил следов. Первый день уже начнёт дневник.',
  },
  noWeight: {
    title: 'Дом ещё не знает форму',
    description:
      'Внеси первый вес — откроются главы пути, вехи и восстановление дома.',
    ctaLabel: 'Добавить вес',
  },
  noTarget: {
    title: 'Задай цель веса',
    description:
      'Без цели дому сложно показать, куда ведёт ремонт. Укажи целевой вес в настройках.',
    ctaLabel: 'Указать цель',
  },
} as const;

export const COZY_FALLBACK_ENTITY: CozyEntityCopy = {
  title: 'Тихая помеха',
  subtitle: 'Помеха',
  description: 'Маленькое домашнее препятствие. Один спокойный шаг уже помогает.',
};

export const COZY_FALLBACK_CHAPTER: CozyJourneyChapterCopy = {
  title: 'Глава дома',
  description: 'Дом ждёт следующего следа заботы.',
  completedText: 'Ещё один шаг к живому дому.',
};
