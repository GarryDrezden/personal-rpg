import type { AppThemeId } from '../types/theme';
import type { ContentVariant } from './types';
import { selectForDate } from './selectVariant';

function line(id: string, theme: AppThemeId, text: string): ContentVariant {
  return { id, theme, text };
}

export type NbaCopyFamily =
  | 'today_not_started'
  | 'partial_day'
  | 'recovery'
  | 'home_affordable'
  | 'ability'
  | 'measurement'
  | 'season_close';

const COZY: Record<NbaCopyFamily, ContentVariant[]> = {
  today_not_started: [
    line('nba_c_ns1', 'cozy', 'Отметь питание, движение или ресурс — и день уже оставит след.'),
    line('nba_c_ns2', 'cozy', 'Дом ещё тих. Одна отметка уже зажигает дату.'),
    line('nba_c_ns3', 'cozy', 'Начни с малого на кухне, во дворе или в журнале ресурса.'),
  ],
  partial_day: [
    line('nba_c_p1', 'cozy', 'День начат. Закрой оставшийся простой кусок — без дожима.'),
    line('nba_c_p2', 'cozy', 'Часть следа уже есть. Можно добавить ещё одну спокойную отметку.'),
    line('nba_c_p3', 'cozy', 'Неполный день всё равно живой. Допиши то, что ещё пусто.'),
  ],
  recovery: [
    line('nba_c_r1', 'cozy', 'Сегодня дом просит мягкого режима: питание, маленький маршрут и пауза.'),
    line('nba_c_r2', 'cozy', 'Главный ход — удержать день без рывка.'),
    line('nba_c_r3', 'cozy', 'Восстановление считается. Не нужно наверстывать нагрузку.'),
  ],
  home_affordable: [
    line('nba_c_h1', 'cozy', 'Запасов хватает на следующий кусок дома.'),
    line('nba_c_h2', 'cozy', 'Можно улучшить зону, когда будешь готов — без гонки.'),
  ],
  ability: [
    line('nba_c_a1', 'cozy', 'Можно проверить способность тела, если изменение уже заметно в быту.'),
    line('nba_c_a2', 'cozy', 'Подсказка способности ждёт короткого «да, так и есть».'),
  ],
  measurement: [
    line('nba_c_m1', 'cozy', 'Пора внести замер — дом и путь опираются на факты, не на ощущение.'),
    line('nba_c_m2', 'cozy', 'Короткий замер держит карту честной.'),
  ],
  season_close: [
    line('nba_c_s1', 'cozy', 'Сезонный дневник почти собран. Можно закрыть страницу спокойно.'),
    line('nba_c_s2', 'cozy', 'До конца сезона осталось немного следов заботы.'),
  ],
};

const DF: Record<NbaCopyFamily, ContentVariant[]> = {
  today_not_started: [
    line('nba_d_ns1', 'darkFantasy', 'Начни с первого сигнала системы: внеси вес или калории.'),
    line('nba_d_ns2', 'darkFantasy', 'Контур дня пуст. Один сигнал уже ставит точку на карте.'),
    line('nba_d_ns3', 'darkFantasy', 'Открой день и оставь первую отметку маршрута.'),
  ],
  partial_day: [
    line('nba_d_p1', 'darkFantasy', 'День начат. Допиши недостающий контур без штурма.'),
    line('nba_d_p2', 'darkFantasy', 'Часть сигнала есть. Можно закрыть простой остаток.'),
    line('nba_d_p3', 'darkFantasy', 'Неполный день держит кампанию. Добавь одну отметку.'),
  ],
  recovery: [
    line('nba_d_r1', 'darkFantasy', 'Сегодня не нужен подвиг. Достаточно удержать базу.'),
    line('nba_d_r2', 'darkFantasy', 'Главный ход — сохранение режима без отката.'),
    line('nba_d_r3', 'darkFantasy', 'Пауза крепит позицию лучше рывка.'),
  ],
  home_affordable: [
    line('nba_d_h1', 'darkFantasy', 'Запасов хватает на следующее укрепление лагеря.'),
    line('nba_d_h2', 'darkFantasy', 'Можно сдвинуть зону, когда будет ход.'),
  ],
  ability: [
    line('nba_d_a1', 'darkFantasy', 'Можно проверить способность, если сдвиг тела уже факт.'),
    line('nba_d_a2', 'darkFantasy', 'Подсказка способности ждёт короткого подтверждения.'),
  ],
  measurement: [
    line('nba_d_m1', 'darkFantasy', 'Пора внести замер. Карта держится на фактах.'),
    line('nba_d_m2', 'darkFantasy', 'Короткий замер честнее ощущения формы.'),
  ],
  season_close: [
    line('nba_d_s1', 'darkFantasy', 'Сезон почти закрыт. Можно додержать арку без рывка.'),
    line('nba_d_s2', 'darkFantasy', 'До печати сезона осталось несколько ходов.'),
  ],
};

export function pickNbaCopy(params: {
  family: NbaCopyFamily;
  themeId: AppThemeId;
  date: string;
}): string {
  const pack = params.themeId === 'cozy' ? COZY : DF;
  return selectForDate({
    candidates: pack[params.family],
    date: params.date,
    family: `nba:${params.family}`,
    theme: params.themeId,
  }).text;
}

export const NBA_COPY_FAMILIES: NbaCopyFamily[] = [
  'today_not_started',
  'partial_day',
  'recovery',
  'home_affordable',
  'ability',
  'measurement',
  'season_close',
];
export const NBA_COPY_POOLS = { cozy: COZY, darkFantasy: DF } as const;
