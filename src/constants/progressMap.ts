import type { ProgressMilestone, ProgressPathId } from '../types/progressMap';

export type PathMeta = {
  id: ProgressPathId;
  title: string;
  description: string;
  icon: string;
};

export const PROGRESS_PATH_META: Record<ProgressPathId, PathMeta> = {
  weight: {
    id: 'weight',
    title: 'Путь веса',
    description: 'Сколько килограммов уже позади от стартовой точки',
    icon: '⚖️',
  },
  alcohol: {
    id: 'alcohol',
    title: 'Путь ясности',
    description: 'Самая длинная серия трезвых дней',
    icon: '💧',
  },
  steps: {
    id: 'steps',
    title: 'Путь шагов',
    description: 'Все шаги, которые ты уже прошёл',
    icon: '👟',
  },
  gym: {
    id: 'gym',
    title: 'Путь тренировок',
    description: 'Каждый заход в зал — точка на маршруте',
    icon: '🏋️',
  },
  measurements: {
    id: 'measurements',
    title: 'Путь замеров',
    description: 'Регулярные замеры веса и талии',
    icon: '📏',
  },
};

function ms(id: string, title: string, description: string, value: number, icon: string): ProgressMilestone {
  return { id, title, description, value, icon };
}

export const WEIGHT_MILESTONES: ProgressMilestone[] = [
  ms('weight-1', '−1 кг', 'Первый килограмм позади', 1, '🪶'),
  ms('weight-5', '−5 кг', 'Пять кило — уже заметно', 5, '🔥'),
  ms('weight-10', '−10 кг', 'Десятка снята', 10, '📉'),
  ms('weight-15', '−15 кг', 'Пятнадцать позади', 15, '⛰️'),
  ms('weight-20', '−20 кг', 'Двадцатка пройдена', 20, '🏔️'),
  ms('weight-30', '−30 кг', 'Тридцатый рубеж', 30, '💎'),
  ms('weight-50', '−50 кг', 'Новая глава', 50, '🌅'),
];

export const ALCOHOL_MILESTONES: ProgressMilestone[] = [
  ms('alcohol-1', '1 день', 'Чистый день', 1, '💧'),
  ms('alcohol-7', '7 дней', 'Неделя ясности', 7, '🧠'),
  ms('alcohol-10', '10 дней', 'Десять дней контроля', 10, '🌿'),
  ms('alcohol-15', '15 дней', 'Ясная голова', 15, '☀️'),
  ms('alcohol-20', '20 дней', 'Без отката', 20, '🛡️'),
  ms('alcohol-30', '30 дней', 'Месяц трезвости', 30, '🌕'),
  ms('alcohol-60', '60 дней', 'Два месяца чисто', 60, '💫'),
  ms('alcohol-90', '90 дней', 'Квартал ясности', 90, '👑'),
];

export const STEPS_MILESTONES: ProgressMilestone[] = [
  ms('steps-100k', '100 000', 'Сто тысяч шагов', 100_000, '💯'),
  ms('steps-500k', '500 000', 'Полмиллиона', 500_000, '🛣️'),
  ms('steps-1m', '1 000 000', 'Миллион шагов', 1_000_000, '🌍'),
  ms('steps-2_5m', '2 500 000', 'Два с половиной миллиона', 2_500_000, '🗺️'),
  ms('steps-5m', '5 000 000', 'Пять миллионов', 5_000_000, '🚀'),
];

export const GYM_MILESTONES: ProgressMilestone[] = [
  ms('gym-1', '1 тренировка', 'Первый заход в зал', 1, '🏋️'),
  ms('gym-10', '10 тренировок', 'Десять тренировок', 10, '💪'),
  ms('gym-25', '25 тренировок', 'Четверть сотни', 25, '🔆'),
  ms('gym-50', '50 тренировок', 'Полсотни', 50, '🏆'),
  ms('gym-100', '100 тренировок', 'Сотня тренировок', 100, '⚡'),
];

export const MEASUREMENTS_MILESTONES: ProgressMilestone[] = [
  ms('meas-1', '1 замер', 'Точка отсчёта', 1, '📏'),
  ms('meas-4', '4 замера', 'Месяц наблюдений', 4, '📊'),
  ms('meas-8', '8 замеров', 'Стабильный контроль', 8, '📈'),
  ms('meas-12', '12 замеров', 'Квартал замеров', 12, '🎯'),
  ms('meas-24', '24 замера', 'Полгода данных', 24, '🗓️'),
  ms('meas-52', '52 замера', 'Год наблюдений', 52, '👑'),
];

export const PATH_MILESTONES: Record<ProgressPathId, ProgressMilestone[]> = {
  weight: WEIGHT_MILESTONES,
  alcohol: ALCOHOL_MILESTONES,
  steps: STEPS_MILESTONES,
  gym: GYM_MILESTONES,
  measurements: MEASUREMENTS_MILESTONES,
};
