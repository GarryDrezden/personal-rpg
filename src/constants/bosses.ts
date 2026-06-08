export type WeeklyBossTemplate = {
  title: string;
  subtitle: string;
  avatarEmoji: string;
  description: string;
};

export const WEEKLY_BOSS_TEMPLATES: WeeklyBossTemplate[] = [
  {
    title: 'Лень Понедельничная',
    subtitle: 'Тянет отложить всё на потом',
    avatarEmoji: '😴',
    description: 'Победи прокрастинацию — закрой недельную цель и держи режим.',
  },
  {
    title: 'Срыв Выходного Дня',
    subtitle: 'Любит нападать в пятницу вечером',
    avatarEmoji: '🍕',
    description: 'Не дай сорваться на выходных — калории и трезвость под контролем.',
  },
  {
    title: 'Туман в Голове',
    subtitle: 'Питается алкоголем и хаосом',
    avatarEmoji: '🌫️',
    description: 'Прогоняй туман трезвостью и чётким планом дня.',
  },
  {
    title: 'Диванный Магнит',
    subtitle: 'Держит на месте сильнее гравитации',
    avatarEmoji: '🛋️',
    description: 'Сорви с дивана — шаги, зал и активность спасут неделю.',
  },
  {
    title: 'Хаос Без Плана',
    subtitle: 'Побеждается дневником и учётом',
    avatarEmoji: '🌀',
    description: 'Упорядочь хаос — вноси данные и бей недельные цели.',
  },
];

export function pickBossTemplate(weekStart: string): WeeklyBossTemplate {
  let hash = 0;
  for (let i = 0; i < weekStart.length; i++) {
    hash = (hash + weekStart.charCodeAt(i) * (i + 1)) % 10000;
  }
  return WEEKLY_BOSS_TEMPLATES[hash % WEEKLY_BOSS_TEMPLATES.length]!;
}
