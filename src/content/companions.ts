import type { CompanionId } from '../types/gameAssets';
import type { AppThemeId } from '../types/theme';
import type { ContentVariant } from './types';
import { selectForDate } from './selectVariant';

export type CompanionReactionContext =
  | 'good_day'
  | 'recovery'
  | 'return'
  | 'home_upgrade'
  | 'ability'
  | 'season'
  | 'long_route'
  | 'presence';

export const COMPANION_PERSONALITY: Record<CompanionId, string> = {
  golden_chinchilla_cat: 'Спокойный, наблюдательный, немного независимый.',
  alabai: 'Надёжный, спокойный, защитный.',
  raven: 'Умный, суховатый, внимательный.',
  fox_cub: 'Любопытный, живой, лёгкий.',
};

function line(id: string, theme: AppThemeId, text: string): ContentVariant {
  return { id, theme, text };
}

type Pack = Record<CompanionReactionContext, ContentVariant[]>;

const CAT_COZY: Pack = {
  good_day: [
    line('cat_c_good_1', 'cozy', 'С подоконника: день отмечен, можно не шуметь.'),
    line('cat_c_good_2', 'cozy', 'Короткое мурлыканье — и снова сад.'),
  ],
  recovery: [
    line('cat_c_rec_1', 'cozy', 'Лежит в квадрате света. Сегодня без беготни.'),
    line('cat_c_rec_2', 'cozy', 'Занимает тёплый угол и не двигается.'),
  ],
  return: [
    line('cat_c_ret_1', 'cozy', 'Место у окна свободно. Будто и ждал.'),
    line('cat_c_ret_2', 'cozy', 'Моргнёт и отворачивается. Дверь открыта.'),
  ],
  home_upgrade: [
    line('cat_c_home_1', 'cozy', 'Обходит новый угол и садится, будто так и было.'),
    line('cat_c_home_2', 'cozy', 'Проверяет тёплую точку после ремонта.'),
  ],
  ability: [
    line('cat_c_ab_1', 'cozy', 'С полки видно: движение сегодня спокойнее.'),
    line('cat_c_ab_2', 'cozy', 'Не комментирует. Просто рядом.'),
  ],
  season: [
    line('cat_c_sea_1', 'cozy', 'Журнал закрыт. Уже спит на обложке.'),
    line('cat_c_sea_2', 'cozy', 'Сезон собран. Ему хватает подоконника.'),
  ],
  long_route: [
    line('cat_c_lr_1', 'cozy', 'Встретил у двери и ушёл на своё место.'),
    line('cat_c_lr_2', 'cozy', 'Длинная дорожка его не зовёт. Дом — да.'),
  ],
  presence: [
    line('cat_c_pr_1', 'cozy', 'Наблюдает из полумрака комнаты.'),
    line('cat_c_pr_2', 'cozy', 'Рядом, без лишних слов.'),
    line('cat_c_pr_3', 'cozy', 'Спит так, будто дом уже в порядке.'),
  ],
};

const ALABAI_COZY: Pack = {
  good_day: [
    line('ala_c_good_1', 'cozy', 'Ложится у порога: день удержан.'),
    line('ala_c_good_2', 'cozy', 'Короткий вздох. Крыльцо под присмотром.'),
  ],
  recovery: [
    line('ala_c_rec_1', 'cozy', 'Охраняет тишину, не маршрут.'),
    line('ala_c_rec_2', 'cozy', 'Не торопит. Держит дом рядом.'),
  ],
  return: [
    line('ala_c_ret_1', 'cozy', 'Встречает у двери без упрёка.'),
    line('ala_c_ret_2', 'cozy', 'Хвост один раз. Можно войти.'),
  ],
  home_upgrade: [
    line('ala_c_home_1', 'cozy', 'Обходит зону и снова ложится.'),
    line('ala_c_home_2', 'cozy', 'Периметр в порядке. Можно жить.'),
  ],
  ability: [
    line('ala_c_ab_1', 'cozy', 'Идёт рядом чуть ровнее. Без парада.'),
    line('ala_c_ab_2', 'cozy', 'Заметил сдвиг тела первым.'),
  ],
  season: [
    line('ala_c_sea_1', 'cozy', 'Сезон закрыт. Стража спокойнее.'),
    line('ala_c_sea_2', 'cozy', 'Дневник собран. Он всё у двери.'),
  ],
  long_route: [
    line('ala_c_lr_1', 'cozy', 'Дошёл и лёг. Маршрут под охраной.'),
    line('ala_c_lr_2', 'cozy', 'Рядом на дорожке, без спешки.'),
  ],
  presence: [
    line('ala_c_pr_1', 'cozy', 'Тихо держит крыльцо.'),
    line('ala_c_pr_2', 'cozy', 'Надёжная тень у входа.'),
    line('ala_c_pr_3', 'cozy', 'Спит — дом не без охраны.'),
  ],
};

const RAVEN_COZY: Pack = {
  good_day: [
    line('rav_c_good_1', 'cozy', 'С карниза: день записан. Хватит.'),
    line('rav_c_good_2', 'cozy', 'Короткий взгляд — строка легла.'),
  ],
  recovery: [
    line('rav_c_rec_1', 'cozy', 'Считает паузы, не подвиги.'),
    line('rav_c_rec_2', 'cozy', 'Молчит. Восстановление — факт.'),
  ],
  return: [
    line('rav_c_ret_1', 'cozy', 'Заметил вход. Прошлое не спрашивает.'),
    line('rav_c_ret_2', 'cozy', 'Каркнул раз. Двери довольно.'),
  ],
  home_upgrade: [
    line('rav_c_home_1', 'cozy', 'Осмотрел новый свет. Кивнул.'),
    line('rav_c_home_2', 'cozy', 'Ремонт замечен. Без комментария.'),
  ],
  ability: [
    line('rav_c_ab_1', 'cozy', 'Зафиксировал: движение свободнее.'),
    line('rav_c_ab_2', 'cozy', 'Сухой взгляд: способность отмечена.'),
  ],
  season: [
    line('rav_c_sea_1', 'cozy', 'Страница закрыта. Смотрит дальше.'),
    line('rav_c_sea_2', 'cozy', 'Любит законченные строки.'),
  ],
  long_route: [
    line('rav_c_lr_1', 'cozy', 'Проводил дорожку взглядом.'),
    line('rav_c_lr_2', 'cozy', 'Длинный маршрут им учтён.'),
  ],
  presence: [
    line('rav_c_pr_1', 'cozy', 'С карниза, почти не моргая.'),
    line('rav_c_pr_2', 'cozy', 'Внимательный. Без болтовни.'),
    line('rav_c_pr_3', 'cozy', 'Держит дом в поле зрения.'),
  ],
};

const FOX_COZY: Pack = {
  good_day: [
    line('fox_c_good_1', 'cozy', 'Крутится у порога: день живой.'),
    line('fox_c_good_2', 'cozy', 'Рывок к саду и обратно.'),
  ],
  recovery: [
    line('fox_c_rec_1', 'cozy', 'Притих у пледа. Играет тише.'),
    line('fox_c_rec_2', 'cozy', 'Любопытство подождёт. Греется.'),
  ],
  return: [
    line('fox_c_ret_1', 'cozy', 'Выскочил встречать, будто паузы не было.'),
    line('fox_c_ret_2', 'cozy', 'Нос к двери. Можно начать.'),
  ],
  home_upgrade: [
    line('fox_c_home_1', 'cozy', 'Обнюхал угол и ищет следующий.'),
    line('fox_c_home_2', 'cozy', 'Новая нора для любопытства.'),
  ],
  ability: [
    line('fox_c_ab_1', 'cozy', 'Скачет: шагу сегодня интереснее.'),
    line('fox_c_ab_2', 'cozy', 'Заметил лёгкость раньше всех.'),
  ],
  season: [
    line('fox_c_sea_1', 'cozy', 'Сезон закрыт. Роет новую тропинку.'),
    line('fox_c_sea_2', 'cozy', 'Хочет ещё следов в саду.'),
  ],
  long_route: [
    line('fox_c_lr_1', 'cozy', 'Пробежал часть и ждёт у поворота.'),
    line('fox_c_lr_2', 'cozy', 'Длинная дорожка — любимая игра.'),
  ],
  presence: [
    line('fox_c_pr_1', 'cozy', 'Вертится, потом замирает.'),
    line('fox_c_pr_2', 'cozy', 'Живой акцент дома.'),
    line('fox_c_pr_3', 'cozy', 'Ищет, что ещё заметить.'),
  ],
};

const CAT_DF: Pack = {
  good_day: [
    line('cat_d_good_1', 'darkFantasy', 'С камня у костра: день записан. Ему довольно тишины.'),
    line('cat_d_good_2', 'darkFantasy', 'Наблюдает. Маршрут его не касается — и всё же замечен.'),
  ],
  recovery: [
    line('cat_d_rec_1', 'darkFantasy', 'Свернулся у жара. Сегодня без выхода.'),
    line('cat_d_rec_2', 'darkFantasy', 'Не встаёт. Пауза принята.'),
  ],
  return: [
    line('cat_d_ret_1', 'darkFantasy', 'Место у костра не заняли. Можно сесть.'),
    line('cat_d_ret_2', 'darkFantasy', 'Взгляд — и снова сон. Вход открыт.'),
  ],
  home_upgrade: [
    line('cat_d_home_1', 'darkFantasy', 'Проверил новый камень лагеря. Сел обратно.'),
    line('cat_d_home_2', 'darkFantasy', 'Укрепление принято, как мебель.'),
  ],
  ability: [
    line('cat_d_ab_1', 'darkFantasy', 'Следит: броня на теле сидит свободнее.'),
    line('cat_d_ab_2', 'darkFantasy', 'Молчит. Сдвиг движения ему ясен.'),
  ],
  season: [
    line('cat_d_sea_1', 'darkFantasy', 'Летопись закрыта. Спит на переплёте.'),
    line('cat_d_sea_2', 'darkFantasy', 'Арка собрана. Ему нужен только жар.'),
  ],
  long_route: [
    line('cat_d_lr_1', 'darkFantasy', 'Встретил у ворот и вернулся к камню.'),
    line('cat_d_lr_2', 'darkFantasy', 'Длинный переход — не его дело. Лагерь — да.'),
  ],
  presence: [
    line('cat_d_pr_1', 'darkFantasy', 'Наблюдает из сумрака у костра.'),
    line('cat_d_pr_2', 'darkFantasy', 'Независимый пост. Рядом.'),
    line('cat_d_pr_3', 'darkFantasy', 'Спит. Лагерь всё равно под взглядом.'),
  ],
};

const ALABAI_DF: Pack = {
  good_day: [
    line('ala_d_good_1', 'darkFantasy', 'Ложится у ворот: позиция удержана.'),
    line('ala_d_good_2', 'darkFantasy', 'Стража спокойна. День закрыт.'),
  ],
  recovery: [
    line('ala_d_rec_1', 'darkFantasy', 'Держит периметр, пока идёт пауза.'),
    line('ala_d_rec_2', 'darkFantasy', 'Не торопит выход. Караул на месте.'),
  ],
  return: [
    line('ala_d_ret_1', 'darkFantasy', 'Ворота узнали шаг. Без допроса.'),
    line('ala_d_ret_2', 'darkFantasy', 'Встретил и встал рядом. Путь продолжается.'),
  ],
  home_upgrade: [
    line('ala_d_home_1', 'darkFantasy', 'Обошёл укрепление. Пост снова тихий.'),
    line('ala_d_home_2', 'darkFantasy', 'Крепость чуть целее. Он это знает.'),
  ],
  ability: [
    line('ala_d_ab_1', 'darkFantasy', 'Идёт плечом. Выдержка заметна.'),
    line('ala_d_ab_2', 'darkFantasy', 'Сдвиг тела принят как смена караула.'),
  ],
  season: [
    line('ala_d_sea_1', 'darkFantasy', 'Сезон закрыт. Стража не снимается.'),
    line('ala_d_sea_2', 'darkFantasy', 'Арка в летописи. Он у ворот.'),
  ],
  long_route: [
    line('ala_d_lr_1', 'darkFantasy', 'Прошёл перевал рядом. Лёг у камня.'),
    line('ala_d_lr_2', 'darkFantasy', 'Длинный след. Охрана не отстала.'),
  ],
  presence: [
    line('ala_d_pr_1', 'darkFantasy', 'Тихий пост у ворот.'),
    line('ala_d_pr_2', 'darkFantasy', 'Надёжная тень на тропе.'),
    line('ala_d_pr_3', 'darkFantasy', 'Спит — периметр не пуст.'),
  ],
};

const RAVEN_DF: Pack = {
  good_day: [
    line('rav_d_good_1', 'darkFantasy', 'С уступа: день в летописи. Хватит.'),
    line('rav_d_good_2', 'darkFantasy', 'Кивок. Контур закрыт.'),
  ],
  recovery: [
    line('rav_d_rec_1', 'darkFantasy', 'Считает паузы как ходы.'),
    line('rav_d_rec_2', 'darkFantasy', 'Молчит. Восстановление учтено.'),
  ],
  return: [
    line('rav_d_ret_1', 'darkFantasy', 'Заметил вход. Дней не пересчитывает.'),
    line('rav_d_ret_2', 'darkFantasy', 'Один крик. Ворота открыты.'),
  ],
  home_upgrade: [
    line('rav_d_home_1', 'darkFantasy', 'Осмотрел камень. Факт принят.'),
    line('rav_d_home_2', 'darkFantasy', 'Укрепление в поле зрения.'),
  ],
  ability: [
    line('rav_d_ab_1', 'darkFantasy', 'Печать ослабла. Зафиксировано.'),
    line('rav_d_ab_2', 'darkFantasy', 'Сухо: движение свободнее.'),
  ],
  season: [
    line('rav_d_sea_1', 'darkFantasy', 'Страница арки закрыта.'),
    line('rav_d_sea_2', 'darkFantasy', 'Любит законченный след.'),
  ],
  long_route: [
    line('rav_d_lr_1', 'darkFantasy', 'Проводил тропу до перевала.'),
    line('rav_d_lr_2', 'darkFantasy', 'Длинный переход внесён в учёт.'),
  ],
  presence: [
    line('rav_d_pr_1', 'darkFantasy', 'С уступа, почти не моргая.'),
    line('rav_d_pr_2', 'darkFantasy', 'Внимательный. Без лишних звуков.'),
    line('rav_d_pr_3', 'darkFantasy', 'Держит маршрут в поле зрения.'),
  ],
};

const FOX_DF: Pack = {
  good_day: [
    line('fox_d_good_1', 'darkFantasy', 'Крутится у тропы: день живой.'),
    line('fox_d_good_2', 'darkFantasy', 'След ему нравится. Уже ищет следующий.'),
  ],
  recovery: [
    line('fox_d_rec_1', 'darkFantasy', 'Притих у костра. Любопытство тише.'),
    line('fox_d_rec_2', 'darkFantasy', 'Греется. Выход подождёт.'),
  ],
  return: [
    line('fox_d_ret_1', 'darkFantasy', 'Выскочил к воротам, будто паузы не было.'),
    line('fox_d_ret_2', 'darkFantasy', 'Нос к следу. Можно идти.'),
  ],
  home_upgrade: [
    line('fox_d_home_1', 'darkFantasy', 'Обнюхал новый камень лагеря.'),
    line('fox_d_home_2', 'darkFantasy', 'Укрепление — новая нора для носа.'),
  ],
  ability: [
    line('fox_d_ab_1', 'darkFantasy', 'Скачет: шагу сегодня интереснее.'),
    line('fox_d_ab_2', 'darkFantasy', 'Заметил свободу движения первым.'),
  ],
  season: [
    line('fox_d_sea_1', 'darkFantasy', 'Арка закрыта. Уже роет новую тропу.'),
    line('fox_d_sea_2', 'darkFantasy', 'Хочет ещё следов на камне.'),
  ],
  long_route: [
    line('fox_d_lr_1', 'darkFantasy', 'Пробежал часть перевала и ждёт.'),
    line('fox_d_lr_2', 'darkFantasy', 'Длинный след — его игра.'),
  ],
  presence: [
    line('fox_d_pr_1', 'darkFantasy', 'Вертится у ног, потом замирает.'),
    line('fox_d_pr_2', 'darkFantasy', 'Живой акцент лагеря.'),
    line('fox_d_pr_3', 'darkFantasy', 'Ищет, что ещё заметить на тропе.'),
  ],
};

const BY_COMPANION: Record<CompanionId, { cozy: Pack; darkFantasy: Pack }> = {
  golden_chinchilla_cat: { cozy: CAT_COZY, darkFantasy: CAT_DF },
  alabai: { cozy: ALABAI_COZY, darkFantasy: ALABAI_DF },
  raven: { cozy: RAVEN_COZY, darkFantasy: RAVEN_DF },
  fox_cub: { cozy: FOX_COZY, darkFantasy: FOX_DF },
};

export const COMPANION_REACTION_CONTEXTS: CompanionReactionContext[] = [
  'good_day',
  'recovery',
  'return',
  'home_upgrade',
  'ability',
  'season',
  'long_route',
  'presence',
];

export function getCompanionReactionPool(
  companionId: CompanionId,
  themeId: AppThemeId,
  context: CompanionReactionContext,
): ContentVariant[] {
  const pack = BY_COMPANION[companionId][themeId === 'cozy' ? 'cozy' : 'darkFantasy'];
  return pack[context] ?? pack.presence;
}

export function pickCompanionReaction(params: {
  companionId: CompanionId;
  themeId: AppThemeId;
  context: CompanionReactionContext;
  date: string;
}): ContentVariant {
  return selectForDate({
    candidates: getCompanionReactionPool(params.companionId, params.themeId, params.context),
    date: params.date,
    family: `companion:${params.companionId}:${params.context}`,
    theme: params.themeId,
  });
}

export function resolveCompanionContext(params: {
  todayEntry?: { dayMode?: string | null; steps?: number | null } | null;
  daysAway: number;
  lastUpgradeAt?: string | null;
  today: string;
  abilityJustUnlocked?: boolean;
  seasonJustCompleted?: boolean;
  longRoute?: boolean;
}): CompanionReactionContext {
  if (params.abilityJustUnlocked) return 'ability';
  if (params.seasonJustCompleted) return 'season';
  if (params.lastUpgradeAt && params.lastUpgradeAt.slice(0, 10) === params.today) {
    return 'home_upgrade';
  }
  if (Number.isFinite(params.daysAway) && params.daysAway >= 3) return 'return';
  if (params.todayEntry?.dayMode === 'recovery') return 'recovery';
  if (params.longRoute || (params.todayEntry?.steps ?? 0) >= 12000) return 'long_route';
  if (params.todayEntry && params.todayEntry.dayMode !== 'minimal') return 'good_day';
  return 'presence';
}

export const COMPANION_PACKS = BY_COMPANION;
