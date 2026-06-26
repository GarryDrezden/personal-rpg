export type BossTemplateId =
  | 'monday_laziness'
  | 'weekend_slip'
  | 'brain_fog'
  | 'couch_magnet'
  | 'chaos_unplanned';

export type WeeklyBossTemplate = {
  id: BossTemplateId;
  title: string;
  subtitle: string;
  avatarEmoji: string;
  description: string;
  /** PNG/WebP в public/bosses/ — при отсутствии показывается SVG или emoji */
  imagePath: string;
  /** CSS-цвет акцента карточки */
  accent: string;
  defeatHint: string;
};

export const WEEKLY_BOSS_TEMPLATES: WeeklyBossTemplate[] = [
  {
    id: 'monday_laziness',
    title: 'Лень Понедельничная',
    subtitle: 'Тянет отложить всё на потом',
    avatarEmoji: '😴',
    description: 'Победи прокрастинацию — закрой недельную цель и держи режим.',
    imagePath: '/bosses/monday-laziness.svg',
    accent: '#6366f1',
    defeatHint: 'Закрой недельную цель XP и не пропускай учёт дней.',
  },
  {
    id: 'weekend_slip',
    title: 'Срыв Выходного Дня',
    subtitle: 'Любит нападать в пятницу вечером',
    avatarEmoji: '🍕',
    description: 'Не дай сорваться на выходных — калории и трезвость под контролем.',
    imagePath: '/bosses/weekend-slip.svg',
    accent: '#f97316',
    defeatHint: 'Держи калории в лимите и избегай тяжёлых срывов в конце недели.',
  },
  {
    id: 'brain_fog',
    title: 'Туман в Голове',
    subtitle: 'Питается алкоголем и хаосом',
    avatarEmoji: '🌫️',
    description: 'Прогоняй туман трезвостью и чётким планом дня.',
    imagePath: '/bosses/brain-fog.svg',
    accent: '#94a3b8',
    defeatHint: 'Собери серию трезвых дней и веди дневник.',
  },
  {
    id: 'couch_magnet',
    title: 'Диванный Магнит',
    subtitle: 'Держит на месте сильнее гравитации',
    avatarEmoji: '🛋️',
    description: 'Сорви с дивана — шаги, зал и активность спасут неделю.',
    imagePath: '/bosses/couch-magnet.svg',
    accent: '#22c55e',
    defeatHint: 'Выполни цели по шагам и норму зала за неделю.',
  },
  {
    id: 'chaos_unplanned',
    title: 'Хаос Без Плана',
    subtitle: 'Побеждается дневником и учётом',
    avatarEmoji: '🌀',
    description: 'Упорядочь хаос — вноси данные и бей недельные цели.',
    imagePath: '/bosses/chaos-unplanned.svg',
    accent: '#a855f7',
    defeatHint: 'Заполняй дни подряд и закрывай все условия победы.',
  },
];

export const BOSS_BY_ID = Object.fromEntries(
  WEEKLY_BOSS_TEMPLATES.map((b) => [b.id, b]),
) as Record<BossTemplateId, WeeklyBossTemplate>;

export function pickBossTemplate(weekStart: string): WeeklyBossTemplate {
  let hash = 0;
  for (let i = 0; i < weekStart.length; i++) {
    hash = (hash + weekStart.charCodeAt(i) * (i + 1)) % 10000;
  }
  return WEEKLY_BOSS_TEMPLATES[hash % WEEKLY_BOSS_TEMPLATES.length]!;
}

export function getBossTemplateById(id: BossTemplateId): WeeklyBossTemplate {
  return BOSS_BY_ID[id];
}
