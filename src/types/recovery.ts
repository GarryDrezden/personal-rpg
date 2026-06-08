export type RecoveryState =
  | 'normal'
  | 'after_bad_day'
  | 'after_absence'
  | 'minimal_day_available'
  | 'recovered';

export type RecoveryQuest = {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
};

export const RECOVERY_STATE_TITLES: Record<RecoveryState, string> = {
  normal: '',
  after_bad_day: 'День восстановления',
  after_absence: 'Снова в игре',
  minimal_day_available: 'Мягкий возврат',
  recovered: 'День удержан',
};

export const RECOVERY_STATE_MESSAGES: Record<RecoveryState, string> = {
  normal: '',
  after_bad_day:
    'Вчера было не идеально — это не откат. Сегодня задача простая: удержать режим минимальным набором.',
  after_absence:
    'С возвращением. Не нужно закрывать прошлые дни. Просто отметь сегодняшний день.',
  minimal_day_available:
    'Можно сделать минимальный день: калории, 5000 шагов, без алкоголя и одна строка дневника.',
  recovered: 'Режим удержан. Отличный возврат.',
};
