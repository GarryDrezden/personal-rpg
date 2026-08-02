/**
 * Theme-aware presentation/content layer over shared entity IDs.
 * Dark Fantasy keeps existing meta; Cozy uses Cozy Content Pack v1.
 */
import type { AppThemeId } from '../types/theme';
import type { BossId, MobId } from '../types/gameAssets';
import type { JourneyStage } from '../types/journeyMap';
import { resolveJourneyStageText } from '../types/journeyMap';
import { JOURNEY_STAGE_MAP } from './journeyMap';
import {
  COZY_BOSS_COPY,
  COZY_DASHBOARD_COPY,
  COZY_EMPTY_STATES,
  COZY_FALLBACK_CHAPTER,
  COZY_FALLBACK_ENTITY,
  COZY_JOURNEY_CHAPTERS,
  COZY_MOB_COPY,
  COZY_QUEST_COPY,
  COZY_SEASON_COPY,
  COZY_TODAY_REACTIONS,
  type CozyEntityCopy,
  type CozyJourneyChapterCopy,
  type CozyReactionCopy,
  type CozyTodayReactionKey,
} from './cozyContentPack';
import { getThemeTerm } from './themeTerms';

export type ThemedTextPresentation = {
  title: string;
  subtitle?: string;
  description?: string;
  label?: string;
};

export function getThemedBossPresentation(
  themeId: AppThemeId,
  bossId: string,
  darkMeta?: { title: string; subtitle?: string; description?: string },
): ThemedTextPresentation {
  if (themeId === 'cozy') {
    const cozy = COZY_BOSS_COPY[bossId as BossId] ?? COZY_FALLBACK_ENTITY;
    return {
      title: cozy.title,
      subtitle: cozy.subtitle,
      description: cozy.description,
      label: getThemeTerm('cozy', 'bossActive'),
    };
  }

  return {
    title: darkMeta?.title ?? bossId,
    subtitle: darkMeta?.subtitle ?? getThemeTerm('darkFantasy', 'boss'),
    description: darkMeta?.description,
    label: getThemeTerm(themeId, 'bossActive'),
  };
}

export function getThemedMobPresentation(
  themeId: AppThemeId,
  mobId: string,
  darkMeta?: { title: string; subtitle?: string; description?: string },
): ThemedTextPresentation {
  if (themeId === 'cozy') {
    const cozy = COZY_MOB_COPY[mobId as MobId] ?? COZY_FALLBACK_ENTITY;
    return {
      title: cozy.title,
      subtitle: cozy.subtitle,
      description: cozy.description,
      label: getThemeTerm('cozy', 'mob'),
    };
  }

  return {
    title: darkMeta?.title ?? mobId,
    subtitle: darkMeta?.subtitle ?? getThemeTerm('darkFantasy', 'mob'),
    description: darkMeta?.description,
    label: getThemeTerm(themeId, 'mob'),
  };
}

export function getThemedJourneyChapterPresentation(
  themeId: AppThemeId,
  chapterId: string,
  stage?: JourneyStage,
): CozyJourneyChapterCopy & { subtitle?: string } {
  const resolvedStage = stage ?? JOURNEY_STAGE_MAP[chapterId];

  if (themeId === 'cozy') {
    const pack = COZY_JOURNEY_CHAPTERS[chapterId];
    if (pack) {
      return {
        ...pack,
        subtitle: resolvedStage?.subtitle,
      };
    }
    if (resolvedStage?.cozyText) {
      return {
        title: resolvedStage.cozyText.title,
        description: resolvedStage.cozyText.description,
        completedText: resolvedStage.cozyText.completedText,
        subtitle: resolvedStage.subtitle,
      };
    }
    return {
      ...COZY_FALLBACK_CHAPTER,
      subtitle: resolvedStage?.subtitle,
    };
  }

  if (resolvedStage) {
    const text = resolveJourneyStageText(resolvedStage, themeId);
    return {
      title: text.title,
      description: text.description,
      completedText: text.completedText,
      subtitle: text.subtitle,
    };
  }

  return {
    title: chapterId,
    description: '',
    completedText: '',
  };
}

export function getThemedSeasonPresentation(themeId: AppThemeId): {
  eyebrow: string;
  title: string;
  careTraces: string;
  notes: string;
  reward: string;
  intro: string;
  empty: string;
} {
  if (themeId === 'cozy') {
    return { ...COZY_SEASON_COPY };
  }

  return {
    eyebrow: getThemeTerm('darkFantasy', 'campaign'),
    title: getThemeTerm('darkFantasy', 'chronicle'),
    careTraces: 'Сезонные боссы',
    notes: 'Испытания',
    reward: 'Награда сезона',
    intro:
      'Сезон — арка кампании, а не календарный месяц. Он остаётся текущим, пока не пройден по квестам. Новая арка открывается только после завершения предыдущей.',
    empty: 'Сезон ещё не начат. Первый сохранённый день откроет летопись.',
  };
}

export function getThemedTodayCopy(
  themeId: AppThemeId,
  context: CozyTodayReactionKey,
  darkFallback: CozyReactionCopy,
): CozyReactionCopy {
  if (themeId === 'cozy') {
    return COZY_TODAY_REACTIONS[context] ?? COZY_TODAY_REACTIONS.default;
  }
  return darkFallback;
}

export function getThemedQuestCopy(
  themeId: AppThemeId,
  questId: string,
  darkFallback: { title: string; actionLabel?: string },
  opts?: { nutritionMode?: 'precise' | 'simple' },
): { title: string; actionLabel?: string } {
  if (themeId !== 'cozy') return darkFallback;

  if (questId === 'nutrition') {
    const key =
      opts?.nutritionMode === 'precise' ? 'nutrition_precise' : 'nutrition_simple';
    const cozy = COZY_QUEST_COPY[key];
    return {
      title: cozy?.title ?? darkFallback.title,
      actionLabel: cozy?.actionLabel ?? darkFallback.actionLabel,
    };
  }

  const cozy = COZY_QUEST_COPY[questId];
  if (!cozy) return darkFallback;
  return {
    title: cozy.title,
    actionLabel: cozy.actionLabel ?? darkFallback.actionLabel,
  };
}

export function getThemedDashboardCopy(themeId: AppThemeId) {
  if (themeId === 'cozy') return COZY_DASHBOARD_COPY;
  return {
    headerIdle: 'День только начинается',
    headerWarm: 'Хороший день',
    headerHeld: 'Маршрут удержан',
    openDayLabel: 'Открыть день',
    openDaySubtitle: 'Отметь питание, шаги или ресурс — и день уже в игре.',
    challengeHint: 'Квесты дня приближают победу над боссом главы →',
    obstacleHint: 'Моб дня слабеет от удержанного маршрута.',
    questsTitle: 'Квесты дня',
    openQuests: 'Все →',
    mood: {
      idle: 'День только начинается',
      warming: 'Разгоняемся',
      held: 'Режим держится',
      good: 'Хороший день',
      great: 'Отличный день',
    },
    rank: {
      20: 'Легенда привычек',
      15: 'Мастер режима',
      10: 'Ветеран пути',
      7: 'Опытный боец',
      4: 'Уверенный старт',
      2: 'Ученик системы',
      0: 'Новичок',
    },
  } as const;
}

export function getThemedEmptyStateCopy(
  themeId: AppThemeId,
  key: keyof typeof COZY_EMPTY_STATES,
): { title: string; description: string; ctaLabel?: string } {
  if (themeId === 'cozy') {
    const state = COZY_EMPTY_STATES[key];
    return { ...state };
  }

  const dark: Record<
    keyof typeof COZY_EMPTY_STATES,
    { title: string; description: string; ctaLabel?: string }
  > = {
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

  return dark[key];
}

export function getCozyBossCopy(bossId: BossId): CozyEntityCopy {
  return COZY_BOSS_COPY[bossId] ?? COZY_FALLBACK_ENTITY;
}

export function getCozyMobCopy(mobId: MobId): CozyEntityCopy {
  return COZY_MOB_COPY[mobId] ?? COZY_FALLBACK_ENTITY;
}
