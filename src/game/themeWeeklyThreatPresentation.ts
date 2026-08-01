import type { BossTemplateId } from '../constants/bosses';
import type { AppThemeId } from '../types/theme';
import type { WeeklyBossStatus } from '../types/boss';
import type { BossCatalogStatus } from '../utils/bossCatalog';

type WeeklyThreatCopy = {
  title: string;
  subtitle: string;
  description: string;
  accent: string;
};

const COZY_WEEKLY: Record<BossTemplateId, WeeklyThreatCopy> = {
  monday_laziness: {
    title: 'Утро без разгона',
    subtitle: 'Тянет отложить всё на потом',
    description:
      'Смягчи откладывание — закрой недельную цель и держи простой режим. Дом отвечает маленьким шагам.',
    accent: '#c4a050',
  },
  weekend_slip: {
    title: 'Вечер пятницы',
    subtitle: 'Зовёт сорваться к концу недели',
    description:
      'Удержи тепло дома на выходных — калории и трезвость в мягком контроле, без войны с собой.',
    accent: '#b8895a',
  },
  brain_fog: {
    title: 'Туман над двором',
    subtitle: 'Питается хаосом и усталостью',
    description:
      'Развей туман трезвостью, сном и короткими отметками дня — двор снова становится яснее.',
    accent: '#7a9bb5',
  },
  couch_magnet: {
    title: 'Сонный плед',
    subtitle: 'Держит на месте сильнее привычки',
    description:
      'Встань с дивана мягко — шаги, двор и любое движение возвращают дому жизнь.',
    accent: '#6d8464',
  },
  chaos_unplanned: {
    title: 'Хаос без плана',
    subtitle: 'Уходит после дневника и учёта',
    description:
      'Верни порядок: вноси данные и закрывай недельные цели — комната снова наполняется теплом.',
    accent: '#8a7052',
  },
};

const COZY_STATUS: Record<WeeklyBossStatus, string> = {
  not_started: 'Помеха недели ждёт',
  in_progress: 'Неделя в работе',
  wounded: 'Помеха слабеет',
  defeated: 'Помеха отступила',
  perfect: 'Неделя удержана идеально',
};

const DARK_STATUS: Record<WeeklyBossStatus, string> = {
  not_started: 'Угроза ждёт',
  in_progress: 'Испытание активно',
  wounded: 'Угроза ослаблена',
  defeated: 'Угроза отступила!',
  perfect: 'Маршрут удержан идеально!',
};

const COZY_CATALOG_STATUS: Record<BossCatalogStatus, string> = {
  pending: 'Ещё впереди',
  active: 'Неделя в работе',
  failed: 'Помеха не отступила',
  defeated: 'Помеха отступила',
  perfect: 'Неделя удержана идеально',
};

const DARK_CATALOG_STATUS: Record<BossCatalogStatus, string> = {
  pending: 'Ещё впереди',
  active: 'Испытание активно',
  failed: 'Угроза не отступила',
  defeated: 'Угроза отступила',
  perfect: 'Маршрут удержан идеально',
};

export function getThemedWeeklyThreatCopy(
  themeId: AppThemeId,
  templateId: BossTemplateId,
  fallback: WeeklyThreatCopy,
): WeeklyThreatCopy {
  if (themeId !== 'cozy') return fallback;
  return COZY_WEEKLY[templateId] ?? fallback;
}

export function getThemedWeeklyThreatStatusLabel(
  themeId: AppThemeId,
  status: WeeklyBossStatus,
): string {
  return themeId === 'cozy' ? COZY_STATUS[status] : DARK_STATUS[status];
}

export function getThemedWeeklyCatalogStatusLabel(
  themeId: AppThemeId,
  status: BossCatalogStatus,
): string {
  return themeId === 'cozy' ? COZY_CATALOG_STATUS[status] : DARK_CATALOG_STATUS[status];
}

export function getThemedWeeklyThreatChrome(themeId: AppThemeId): {
  powerLabel: string;
  conditionsLabel: string;
  powerStats: (hpPercent: number, completed: number, total: number) => string;
  rewardPending: string;
  rewardWon: string;
  perfectBonus: string;
  wonBadge: (perfect: boolean) => string;
  weekLink: string;
  allTrialsLink: string;
  featuredEyebrow: string;
  featuredCta: string;
  featuredProgress: (damage: number, completed: number, total: number) => string;
  archiveHelper: string;
  defeatHint: string;
  fogPending: string;
} {
  if (themeId === 'cozy') {
    return {
      powerLabel: 'Сила помехи',
      conditionsLabel: 'Что помогает на этой неделе',
      powerStats: (hp, done, total) => `${hp}% силы · ${done}/${total} условий`,
      rewardPending: 'Награда за удержание ритма',
      rewardWon: 'Награда',
      perfectBonus: 'Ритм удержан идеально — бонусная награда',
      wonBadge: (perfect) => (perfect ? 'Идеально!' : 'Ритм удержан!'),
      weekLink: 'Неделя →',
      allTrialsLink: 'Все помехи недели',
      featuredEyebrow: 'Помеха недели',
      featuredCta: 'Перейти к помехе недели',
      featuredProgress: (damage, done, total) =>
        `Ритм ослабил помеху на ${damage}% · условий закрыто ${done}/${total}`,
      archiveHelper: 'Прошлые помехи и те, что ещё впереди.',
      defeatHint: 'Как удержать ритм',
      fogPending: 'Появится в одну из недель. Можно готовиться мягко.',
    };
  }

  return {
    powerLabel: 'Сила угрозы',
    conditionsLabel: 'Условия испытания',
    powerStats: (hp, done, total) => `${hp}% силы · ${done}/${total} условий`,
    rewardPending: 'Награда за удержание маршрута',
    rewardWon: 'Награда',
    perfectBonus: 'Маршрут удержан идеально — бонусная награда',
    wonBadge: (perfect) => (perfect ? 'Идеально!' : 'Маршрут удержан!'),
    weekLink: 'Неделя →',
    allTrialsLink: 'Все испытания',
    featuredEyebrow: 'Угроза недели',
    featuredCta: 'Перейти к испытанию недели',
    featuredProgress: (damage, done, total) =>
      `Маршрут ослабил угрозу на ${damage}% · условий закрыто ${done}/${total}`,
    archiveHelper: 'Прошлые угрозы и те, что ещё скрыты в тумане.',
    defeatHint: 'Как удержать маршрут',
    fogPending: 'В тумане — проявится в одну из недель. Готовься заранее.',
  };
}
