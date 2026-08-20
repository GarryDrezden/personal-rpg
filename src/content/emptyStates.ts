import type { AppThemeId } from '../types/theme';
import type { ContentVariant } from './types';
import { selectForDate } from './selectVariant';
import { COZY_EMPTY_STATES } from '../constants/cozyContentPack';

export type EmptyStateKey = keyof typeof COZY_EMPTY_STATES;

type EmptyCopy = { title: string; description: string; ctaLabel?: string };

const COZY_CANONICAL: Record<EmptyStateKey, EmptyCopy> = {
  noDayData: { ...COZY_EMPTY_STATES.noDayData },
  noResources: { ...COZY_EMPTY_STATES.noResources },
  noUpgrades: { ...COZY_EMPTY_STATES.noUpgrades },
  noSeason: { ...COZY_EMPTY_STATES.noSeason },
  noWeight: { ...COZY_EMPTY_STATES.noWeight },
  noTarget: { ...COZY_EMPTY_STATES.noTarget },
};

const DF_CANONICAL: Record<EmptyStateKey, EmptyCopy> = {
  noDayData: {
    title: 'День ещё пуст',
    description: 'Отметь хотя бы питание, шаги или ресурс.',
  },
  noResources: {
    title: 'Ресурсов пока нет',
    description: 'Сохрани день — появятся первые материалы прогресса.',
  },
  noUpgrades: {
    title: 'Улучшения ждут',
    description: 'Сегодняшние действия приближают прогресс.',
  },
  noSeason: {
    title: 'Сезон ещё не начат',
    description: 'Первый сохранённый день откроет летопись.',
  },
  noWeight: {
    title: 'Путь ещё не начался',
    description:
      'Внеси первый вес — откроется глава 1, вехи трансформации и прогресс героя.',
    ctaLabel: 'Добавить вес',
  },
  noTarget: {
    title: 'Задай цель веса',
    description:
      'Без цели система не покажет путь трансформации. Укажи целевой вес в настройках персонажа.',
    ctaLabel: 'Указать цель',
  },
};

const COZY_DESC: Record<EmptyStateKey, ContentVariant[]> = {
  noDayData: [
    { id: 'empty_c_day_1', theme: 'cozy', text: COZY_CANONICAL.noDayData.description },
    { id: 'empty_c_day_2', theme: 'cozy', text: 'Дом тих, пока нет отметки. Открой день и оставь один след.' },
    { id: 'empty_c_day_3', theme: 'cozy', text: 'Календарь дома пуст. Питание, маршрут или ресурс уже зажгут свет.' },
  ],
  noResources: [
    { id: 'empty_c_res_1', theme: 'cozy', text: COZY_CANONICAL.noResources.description },
    { id: 'empty_c_res_2', theme: 'cozy', text: 'Запасы спят. Сохранённый день принесёт первые материалы дома.' },
  ],
  noUpgrades: [
    { id: 'empty_c_up_1', theme: 'cozy', text: COZY_CANONICAL.noUpgrades.description },
    { id: 'empty_c_up_2', theme: 'cozy', text: 'Зона ждёт запасов. Сегодняшние следы приближают ремонт.' },
  ],
  noSeason: [
    { id: 'empty_c_sea_1', theme: 'cozy', text: COZY_CANONICAL.noSeason.description },
    { id: 'empty_c_sea_2', theme: 'cozy', text: 'Журнал сезона пуст. Первый день уже начнёт страницу.' },
  ],
  noWeight: [
    { id: 'empty_c_w_1', theme: 'cozy', text: COZY_CANONICAL.noWeight.description },
  ],
  noTarget: [
    { id: 'empty_c_t_1', theme: 'cozy', text: COZY_CANONICAL.noTarget.description },
  ],
};

const DF_DESC: Record<EmptyStateKey, ContentVariant[]> = {
  noDayData: [
    { id: 'empty_d_day_1', theme: 'darkFantasy', text: DF_CANONICAL.noDayData.description },
    { id: 'empty_d_day_2', theme: 'darkFantasy', text: 'Контур дня пуст. Отметь питание, шаги или ресурс.' },
    { id: 'empty_d_day_3', theme: 'darkFantasy', text: 'Карта сегодня без точки. Один сигнал уже ставит её.' },
  ],
  noResources: [
    { id: 'empty_d_res_1', theme: 'darkFantasy', text: DF_CANONICAL.noResources.description },
    { id: 'empty_d_res_2', theme: 'darkFantasy', text: 'Склад пуст. Сохранение дня даст первые материалы прогресса.' },
  ],
  noUpgrades: [
    { id: 'empty_d_up_1', theme: 'darkFantasy', text: DF_CANONICAL.noUpgrades.description },
    { id: 'empty_d_up_2', theme: 'darkFantasy', text: 'Укрепления ждут. Сегодняшние ходы приближают сдвиг.' },
  ],
  noSeason: [
    { id: 'empty_d_sea_1', theme: 'darkFantasy', text: DF_CANONICAL.noSeason.description },
    { id: 'empty_d_sea_2', theme: 'darkFantasy', text: 'Летопись пуста. Первый сохранённый день откроет арку.' },
  ],
  noWeight: [
    { id: 'empty_d_w_1', theme: 'darkFantasy', text: DF_CANONICAL.noWeight.description },
  ],
  noTarget: [
    { id: 'empty_d_t_1', theme: 'darkFantasy', text: DF_CANONICAL.noTarget.description },
  ],
};

export function pickEmptyStateCopy(params: {
  themeId: AppThemeId;
  key: EmptyStateKey;
  date?: string;
}): EmptyCopy {
  const canonical = params.themeId === 'cozy' ? COZY_CANONICAL[params.key] : DF_CANONICAL[params.key];
  if (!params.date) return { ...canonical };
  const pool = params.themeId === 'cozy' ? COZY_DESC[params.key] : DF_DESC[params.key];
  const description = selectForDate({
    candidates: pool,
    date: params.date,
    family: `empty:${params.key}`,
    theme: params.themeId,
  }).text;
  return { ...canonical, description };
}

export const EMPTY_STATE_KEYS: EmptyStateKey[] = [
  'noDayData',
  'noResources',
  'noUpgrades',
  'noSeason',
  'noWeight',
  'noTarget',
];
