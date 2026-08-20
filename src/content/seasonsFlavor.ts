import type { AppThemeId } from '../types/theme';
import type { SeasonPartialStatus } from '../game/seasons/seasonTypes';
import type { ContentVariant } from './types';
import { selectForDate } from './selectVariant';

export type SeasonCopyPhase =
  | 'start'
  | 'early'
  | 'midpoint'
  | 'near'
  | 'completed'
  | 'extended';

export function seasonCopyPhase(params: {
  partialStatus: SeasonPartialStatus;
  dayNumber: number;
  seasonLength: number;
  isArcCompleted: boolean;
}): SeasonCopyPhase {
  if (params.isArcCompleted) return 'completed';
  if (params.dayNumber > params.seasonLength) return 'extended';
  if (params.partialStatus === 'held' || params.dayNumber >= Math.ceil(params.seasonLength * 0.75)) {
    return 'near';
  }
  if (params.partialStatus === 'marked' || params.dayNumber >= Math.ceil(params.seasonLength * 0.4)) {
    return 'midpoint';
  }
  if (params.dayNumber <= 3 && params.partialStatus === 'started') return 'start';
  return 'early';
}

function line(id: string, theme: AppThemeId, text: string): ContentVariant {
  return { id, theme, text };
}

const COZY: Record<SeasonCopyPhase, ContentVariant[]> = {
  start: [
    line('sea_c_st1', 'cozy', 'Сезон начат. Журнал дома открыт — можно возвращаться к нему без спешки.'),
    line('sea_c_st2', 'cozy', 'Сезон начат. Первая страница ещё пустая, и это нормально.'),
    line('sea_c_st3', 'cozy', 'Сезон начат. Сад только замечает новый круг заботы.'),
  ],
  early: [
    line('sea_c_e1', 'cozy', 'Сезон только набирает следы. Неровная неделя уже считается.'),
    line('sea_c_e2', 'cozy', 'Ранние дни журнала. Дом собирает отметки, не идеал.'),
    line('sea_c_e3', 'cozy', 'Страница сезона ещё тонкая. Можно писать спокойно.'),
  ],
  midpoint: [
    line('sea_c_m1', 'cozy', 'Середина сезона. Журнал уже не пустой — и ещё не закрыт.'),
    line('sea_c_m2', 'cozy', 'Половина круга. Следы смешанные: этого достаточно, чтобы продолжать.'),
    line('sea_c_m3', 'cozy', 'Сезон держится повтором, не финалом.'),
  ],
  near: [
    line('sea_c_n1', 'cozy', 'Сезон почти собран. Можно закрыть его без рывка.'),
    line('sea_c_n2', 'cozy', 'Страница близка к концу. Бережный повтор важнее дожима.'),
    line('sea_c_n3', 'cozy', 'Журнал почти полон. Осталось несколько спокойных следов.'),
  ],
  completed: [
    line('sea_c_c1', 'cozy', 'Сезон собран. Дом получил ещё один тёплый круг.'),
    line('sea_c_c2', 'cozy', 'Страница закрыта. Можно жить дальше, не объявляя финал.'),
    line('sea_c_c3', 'cozy', 'Сезонный дневник завершён. След заботы остался в доме.'),
    line('sea_c_c4', 'cozy', 'Круг закрыт. Сад помнит этот ритм.'),
  ],
  extended: [
    line('sea_c_x1', 'cozy', 'Сезон длится дольше круга. Это не опоздание — журнал ещё открыт.'),
    line('sea_c_x2', 'cozy', 'Календарь ушёл вперёд. Страница не закрыта, и это нормально.'),
    line('sea_c_x3', 'cozy', 'Дневник продолжается. Новая страница откроется после этой, без долга за календарь.'),
    line('sea_c_x4', 'cozy', 'Сезон растянулся. Дом не считает это ошибкой календаря.'),
  ],
};

const DF: Record<SeasonCopyPhase, ContentVariant[]> = {
  start: [
    line('sea_d_st1', 'darkFantasy', 'Сезон начат. Костёр уже виден — теперь важно возвращаться к нему.'),
    line('sea_d_st2', 'darkFantasy', 'Сезон начат. Контур арки только нанесён на карту.'),
    line('sea_d_st3', 'darkFantasy', 'Сезон начат. Первый след у костра уже считается.'),
  ],
  early: [
    line('sea_d_e1', 'darkFantasy', 'Ранняя арка. Неровная неделя всё равно оставляет след.'),
    line('sea_d_e2', 'darkFantasy', 'Костёр ещё слабый. Возвраты важнее идеала.'),
    line('sea_d_e3', 'darkFantasy', 'Сезон только собирает метки маршрута.'),
  ],
  midpoint: [
    line('sea_d_m1', 'darkFantasy', 'Середина арки. След смешанный — и уже держит кампанию.'),
    line('sea_d_m2', 'darkFantasy', 'Половина сезона. Контур устойчивее, чем в первый день.'),
    line('sea_d_m3', 'darkFantasy', 'Перевал сезона. Можно идти без речи о победе.'),
  ],
  near: [
    line('sea_d_n1', 'darkFantasy', 'Сезон почти закрыт. Бережный ход важнее рывка.'),
    line('sea_d_n2', 'darkFantasy', 'Арка близка. Ещё несколько возвратов к костру.'),
    line('sea_d_n3', 'darkFantasy', 'Печать сезона почти собрана.'),
  ],
  completed: [
    line('sea_d_c1', 'darkFantasy', 'Сезон пройден. Путь стал заметнее.'),
    line('sea_d_c2', 'darkFantasy', 'Арка закрыта. Искра у костра держится.'),
    line('sea_d_c3', 'darkFantasy', 'Сезон усилен. Контур кампании крепче.'),
    line('sea_d_c4', 'darkFantasy', 'Летопись получила законченную страницу.'),
  ],
  extended: [
    line('sea_d_x1', 'darkFantasy', 'Арка длится дольше круга. Это не опоздание — сезон ещё открыт.'),
    line('sea_d_x2', 'darkFantasy', 'Календарь ушёл вперёд. Печать не ставится за дату.'),
    line('sea_d_x3', 'darkFantasy', 'Сезон продолжается. Новая арка откроется после этой.'),
    line('sea_d_x4', 'darkFantasy', 'Растянутый сезон не закрывает кампанию сам по себе.'),
  ],
};

const CURRENT_OPEN = {
  cozy: [
    line('open_c_1', 'cozy', 'Арка ещё не завершена. Журнал сезона продолжается — новая страница откроется после этой.'),
    line('open_c_2', 'cozy', 'Сезонный дневник ещё открыт. Можно собирать следы без спешки.'),
  ],
  darkFantasy: [
    line('open_d_1', 'darkFantasy', 'Арка ещё не завершена. Путь сезона продолжается — новая арка откроется после этой.'),
    line('open_d_2', 'darkFantasy', 'Печать сезона ещё не поставлена. Контур жив.'),
  ],
};

const HISTORY_INCOMPLETE = {
  cozy: [
    line('hist_c_1', 'cozy', 'Прогресс сезона не завершён. Журнал продолжается — страницу не считаем закрытой.'),
    line('hist_c_2', 'cozy', 'Круг остался открытым. Новая страница подождёт эту.'),
    line('hist_c_3', 'cozy', 'Сезон оставил незакрытую тетрадь. Можно продолжить без стыда за календарь.'),
  ],
  darkFantasy: [
    line('hist_d_1', 'darkFantasy', 'Прогресс сезона не завершён. Арка продолжается — не считаем её пройденной.'),
    line('hist_d_2', 'darkFantasy', 'Печать не поставлена. Кампания продолжается.'),
    line('hist_d_3', 'darkFantasy', 'След арки смешанный. Новая не откроется, пока эта жива.'),
  ],
};

const HISTORY_MIXED = {
  cozy: [
    line('histmix_c_1', 'cozy', 'Сезон оставил смешанные следы. Не идеально — и этого достаточно.'),
    line('histmix_c_2', 'cozy', 'Были тихие дни и живые. Журнал всё равно велся.'),
  ],
  darkFantasy: [
    line('histmix_d_1', 'darkFantasy', 'Сезон оставил метки маршрута. Не идеально — и этого достаточно.'),
    line('histmix_d_2', 'darkFantasy', 'Смешанная арка. Контур всё равно виден.'),
  ],
};

export function pickSeasonFlavorLine(params: {
  themeId: AppThemeId;
  phase: SeasonCopyPhase;
  date: string;
  extra?: string;
}): string {
  const pack = params.themeId === 'cozy' ? COZY : DF;
  return selectForDate({
    candidates: pack[params.phase],
    date: params.date,
    family: `season:${params.phase}`,
    theme: params.themeId,
    extra: params.extra,
  }).text;
}

export function pickSeasonCurrentOpenLine(params: {
  themeId: AppThemeId;
  date: string;
}): string {
  const pack = params.themeId === 'cozy' ? CURRENT_OPEN.cozy : CURRENT_OPEN.darkFantasy;
  return selectForDate({
    candidates: pack,
    date: params.date,
    family: 'season:currentOpen',
    theme: params.themeId,
  }).text;
}

export function pickSeasonHistoryRecap(params: {
  themeId: AppThemeId;
  date: string;
  isPast: boolean;
  isArcCompleted: boolean;
  partialStatus: SeasonPartialStatus;
}): string | null {
  if (!params.isPast) return null;
  if (!params.isArcCompleted) {
    const pack = params.themeId === 'cozy' ? HISTORY_INCOMPLETE.cozy : HISTORY_INCOMPLETE.darkFantasy;
    return selectForDate({
      candidates: pack,
      date: params.date,
      family: 'season:historyIncomplete',
      theme: params.themeId,
    }).text;
  }
  if (params.partialStatus === 'started' || params.partialStatus === 'marked') {
    const pack = params.themeId === 'cozy' ? HISTORY_MIXED.cozy : HISTORY_MIXED.darkFantasy;
    return selectForDate({
      candidates: pack,
      date: params.date,
      family: 'season:historyMixed',
      theme: params.themeId,
    }).text;
  }
  return null;
}

export const SEASON_FLAVOR_POOLS = { cozy: COZY, darkFantasy: DF } as const;
export const SEASON_COPY_PHASES: SeasonCopyPhase[] = [
  'start',
  'early',
  'midpoint',
  'near',
  'completed',
  'extended',
];
