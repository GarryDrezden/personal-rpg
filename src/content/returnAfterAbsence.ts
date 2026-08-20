import type { AppThemeId } from '../types/theme';
import type { ContentVariant } from './types';
import { selectForDate } from './selectVariant';

export type ReturnAbsenceBand = 'short' | 'week' | 'fortnight' | 'month';

export function returnAbsenceBand(daysAway: number): ReturnAbsenceBand | null {
  if (!Number.isFinite(daysAway) || daysAway < 3) return null;
  if (daysAway <= 6) return 'short';
  if (daysAway <= 13) return 'week';
  if (daysAway <= 29) return 'fortnight';
  return 'month';
}

function line(id: string, theme: AppThemeId, text: string): ContentVariant {
  return { id, theme, text };
}

const COZY: Record<ReturnAbsenceBand, ContentVariant[]> = {
  short: [
    line('ret_c_s1', 'cozy', 'Несколько тихих дней. Не нужно закрывать прошлое — достаточно сегодняшнего следа.'),
    line('ret_c_s2', 'cozy', 'Пауза была короткой. Не нужно закрывать прошлые дни. Можно войти с маленькой отметкой.'),
    line('ret_c_s3', 'cozy', 'Дом не успел остыть. Не нужно закрывать прошлые дни — путь продолжается с сегодняшнего шага.'),
    line('ret_c_s4', 'cozy', 'Не нужно закрывать прошлые дни. Отметь сегодня, без догона.'),
  ],
  week: [
    line('ret_c_w1', 'cozy', 'Не нужно закрывать прошлые дни. Отметь сегодняшний маленький шаг — дом снова заметит тебя.'),
    line('ret_c_w2', 'cozy', 'Не нужно закрывать прошлые дни. Неделя могла быть пустой — сегодняшний след открывает дверь.'),
    line('ret_c_w3', 'cozy', 'Не нужно закрывать прошлые дни. Возврат начинается с этого дня, не с идеальной недели.'),
    line('ret_c_w4', 'cozy', 'Не нужно закрывать прошлые дни. Путь продолжается с сегодняшнего шага.'),
  ],
  fortnight: [
    line('ret_c_f1', 'cozy', 'Пауза была длиннее. Не нужно закрывать прошлые дни. Достаточно сегодняшней отметки.'),
    line('ret_c_f2', 'cozy', 'Не нужно закрывать прошлые дни. Можно войти тихо — маршрут продолжается с этого шага.'),
    line('ret_c_f3', 'cozy', 'Не нужно закрывать прошлые дни. Две недели тишины не стирают крыльцо.'),
    line('ret_c_f4', 'cozy', 'Не нужно закрывать прошлые дни. Один спокойный день держит дом лучше клятвы.'),
  ],
  month: [
    line('ret_c_m1', 'cozy', 'Долгая пауза. Не нужно закрывать прошлые дни. Путь продолжается с сегодняшнего шага.'),
    line('ret_c_m2', 'cozy', 'Не нужно закрывать прошлые дни. Месяц тишины не закрыл дом — хватит минимальной отметки.'),
    line('ret_c_m3', 'cozy', 'Не нужно закрывать прошлые дни. Свет в прихожей зажигается заново, без суда.'),
    line('ret_c_m4', 'cozy', 'Не нужно закрывать прошлые дни. Возврат не требует наверстать месяц.'),
  ],
};

const DF: Record<ReturnAbsenceBand, ContentVariant[]> = {
  short: [
    line('ret_d_s1', 'darkFantasy', 'Короткая пауза. Не нужно закрывать прошлые дни — отметь сегодняшний ход.'),
    line('ret_d_s2', 'darkFantasy', 'Не нужно закрывать прошлые дни. След не исчез — можно продолжить с этой точки.'),
    line('ret_d_s3', 'darkFantasy', 'Не нужно закрывать прошлые дни. Ворота не заперты — путь продолжается с сегодняшнего шага.'),
    line('ret_d_s4', 'darkFantasy', 'Не нужно закрывать прошлые дни. Контур держится одной отметкой.'),
  ],
  week: [
    line('ret_d_w1', 'darkFantasy', 'Не нужно закрывать прошлые дни. Просто отметь сегодняшний день — система снова в ходу.'),
    line('ret_d_w2', 'darkFantasy', 'Не нужно закрывать прошлые дни. Неделя без сигнала — сегодняшний ход открывает карту.'),
    line('ret_d_w3', 'darkFantasy', 'Не нужно закрывать прошлые дни. Возврат начинается с этой даты, не с закрытия дыр.'),
    line('ret_d_w4', 'darkFantasy', 'Не нужно закрывать прошлые дни. Путь продолжается с сегодняшнего шага.'),
  ],
  fortnight: [
    line('ret_d_f1', 'darkFantasy', 'Длинная пауза. Не нужно закрывать прошлые дни. Достаточно сегодняшней отметки.'),
    line('ret_d_f2', 'darkFantasy', 'Не нужно закрывать прошлые дни. Камень на тропе всё ещё твой.'),
    line('ret_d_f3', 'darkFantasy', 'Не нужно закрывать прошлые дни. Один ход уже держит позицию.'),
    line('ret_d_f4', 'darkFantasy', 'Не нужно закрывать прошлые дни. Спокойный день крепит маршрут, без боя с календарём.'),
  ],
  month: [
    line('ret_d_m1', 'darkFantasy', 'Долгое отсутствие. Не нужно закрывать прошлые дни. Путь продолжается с сегодняшнего шага.'),
    line('ret_d_m2', 'darkFantasy', 'Не нужно закрывать прошлые дни. Месяц тишины не конец кампании.'),
    line('ret_d_m3', 'darkFantasy', 'Не нужно закрывать прошлые дни. Ворота открываются без суда.'),
    line('ret_d_m4', 'darkFantasy', 'Не нужно закрывать прошлые дни. Возврат — это сегодняшняя отметка, не погашение долга.'),
  ],
};

export function pickReturnAfterAbsenceCopy(params: {
  themeId: AppThemeId;
  daysAway: number;
  date: string;
}): ContentVariant | null {
  const band = returnAbsenceBand(params.daysAway);
  if (!band) return null;
  const pack = params.themeId === 'cozy' ? COZY : DF;
  return selectForDate({
    candidates: pack[band],
    date: params.date,
    family: `return:${band}`,
    theme: params.themeId,
  });
}

export const RETURN_AFTER_ABSENCE_POOLS = { cozy: COZY, darkFantasy: DF } as const;
export const RETURN_ABSENCE_BANDS: ReturnAbsenceBand[] = [
  'short',
  'week',
  'fortnight',
  'month',
];
