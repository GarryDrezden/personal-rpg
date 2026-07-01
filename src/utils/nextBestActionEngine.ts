import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { BodyAbilityProgress } from '../types/bodyAbilities';
import type { JourneyMapSummary } from '../types/journeyMap';
import type { MomentumSummary } from '../types/momentum';
import type { NextBestAction } from '../types/nextBestAction';
import type { RecoveryState } from '../types/recovery';
import type { AppThemeId } from '../types/theme';
import { hasAnyDailyData } from './achievementHelpers';
import { isCaloriesInLimit } from './achievementEngine';
import { getIncompleteConditions } from './journeyMapEngine';
import {
  getMomentumSummary,
  isBaseMomentumDay,
  getMomentumActionThemeText,
} from './momentumEngine';
import { getStepsThresholds, getDayMode } from './stepsEngine';
import { DEFAULT_STEPS_THRESHOLDS } from '../constants/steps';
import { MINIMAL_DAY_STEPS } from './recoveryEngine';
import { shouldSuggestRecoveryFromResource } from './resourceEngine';

function themedAction(
  actionId: string,
  themeId: AppThemeId | undefined,
  fallback: { title: string; description: string },
): { title: string; description: string } {
  return getMomentumActionThemeText({ actionId, themeId, fallback });
}

function isTodayAlmostClosed(entry: DailyEntry, settings: AppSettings): boolean {
  return (
    entry.calories !== null &&
    entry.calories !== undefined &&
    isCaloriesInLimit(entry, settings) &&
    isBaseMomentumDay(entry, settings)
  );
}

function hasLittleTodayData(entry: DailyEntry | null): boolean {
  if (!entry) return true;
  const signals = [
    entry.calories !== null && entry.calories !== undefined,
    entry.steps !== null && entry.steps !== undefined,
    entry.alcohol !== null && entry.alcohol !== undefined,
  ].filter(Boolean).length;
  return signals <= 1;
}

export function getNextBestAction(params: {
  today: string;
  todayEntry: DailyEntry | null;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  recoveryState?: RecoveryState;
  nextBodyAbilities?: BodyAbilityProgress[];
  journeySummary?: JourneyMapSummary;
  momentumSummary?: MomentumSummary;
  themeId?: AppThemeId;
}): NextBestAction {
  const {
    today,
    todayEntry,
    dailyEntries,
    measurements,
    settings,
    recoveryState,
    nextBodyAbilities = [],
    journeySummary,
    themeId,
  } = params;

  const momentumSummary =
    params.momentumSummary ??
    getMomentumSummary({ today, dailyEntries, settings });

  const hasAnyData =
    measurements.some((m) => m.weight !== null) ||
    dailyEntries.some((e) => hasAnyDailyData(e));

  if (!hasAnyData) {
    return {
      id: 'start_system',
      priority: 'base',
      title: 'Первый сигнал системе',
      description: 'Начни с первого сигнала системы: внеси вес или калории.',
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '🌱',
    };
  }

  if (recoveryState === 'after_bad_day') {
    return {
      id: 'return_after_bad',
      priority: 'recovery',
      title: 'Вернуться в систему',
      description:
        'Сегодня не нужен подвиг. Достаточно удержать базу: калории, минимум шагов, без алкоголя и одна строка дневника.',
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '🛡️',
    };
  }

  const entry = todayEntry ?? dailyEntries.find((e) => e.date === today) ?? null;
  const dayMode = entry ? getDayMode(entry.dayMode) : 'normal';
  const momentum = momentumSummary.currentValue;

  if (
    entry &&
    dayMode === 'normal' &&
    shouldSuggestRecoveryFromResource(entry) &&
    momentum > -40
  ) {
    return {
      id: 'low_resource_minimal',
      priority: 'recovery',
      title: 'Удержать маршрут',
      description:
        'Сегодня ресурс низкий. Лучший ход — минимальный день: питание, 5000 шагов, без алкоголя, одна строка дневника.',
      actionLabel: 'Открыть восстановление',
      targetRoute: '/today',
      icon: '🔋',
    };
  }

  if (dayMode === 'recovery' || dayMode === 'minimal') {
    return {
      id: 'hold_base',
      priority: 'recovery',
      title: 'Удержать базу',
      description: 'Главный ход дня — не максимум, а сохранение режима без отката.',
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '🔋',
    };
  }

  if (momentum <= -40) {
    const fb = {
      title: 'Вернуть ход системы',
      description:
        'Инерция сильно просела. Сегодня не нужен максимум — нужен один день без отката: калории, 5000 шагов, без алкоголя и одна строка.',
    };
    const text = themedAction('momentum_lost_speed_return', themeId, fb);
    return {
      id: 'momentum_lost_speed_return',
      priority: 'momentum_recovery',
      title: text.title,
      description: text.description,
      actionLabel: 'Включить минимальный день',
      targetRoute: '/today',
      icon: '🛡️',
    };
  }

  if (momentum >= -39 && momentum <= -10) {
    const fb = {
      title: 'Собрать базовый день для инерции',
      description:
        'Один базовый день уже начнет возвращать ход: внеси калории, добери минимум шагов и удержи ясность.',
    };
    const text = themedAction('momentum_base_day', themeId, fb);
    return {
      id: 'momentum_base_day',
      priority: 'momentum_base',
      title: text.title,
      description: text.description,
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '⚙️',
    };
  }

  if (!entry || entry.calories === null || entry.calories === undefined) {
    return {
      id: 'log_calories',
      priority: 'calories',
      title: 'Внести калории',
      description: 'Система начинается с видимости. Внеси калории — и день уже не потерян.',
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '🧾',
    };
  }

  if (!entry || entry.alcohol === null || entry.alcohol === undefined) {
    return {
      id: 'log_alcohol',
      priority: 'clarity',
      title: 'Не уходить в туман',
      description: 'Отметь алкоголь и постарайся удержать ясность дня.',
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '💧',
    };
  }

  const thresholds = getStepsThresholds(settings, today);
  const minimum =
    thresholds.minimum ?? settings.defaultStepsMinimum ?? DEFAULT_STEPS_THRESHOLDS.minimum;
  const steps = entry?.steps ?? 0;

  if (steps < minimum) {
    const remaining = minimum - steps;
    return {
      id: 'reach_steps_minimum',
      priority: 'steps',
      title: 'Добрать минимум шагов',
      description: `Минимум движения удерживает базу дня. Осталось до ${minimum.toLocaleString('ru')} шагов: ${remaining.toLocaleString('ru')}.`,
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '👟',
    };
  }

  const closeAbility = nextBodyAbilities.find((p) => p.progressPercent >= 70);
  if (closeAbility) {
    return {
      id: `ability_${closeAbility.ability.id}`,
      priority: 'ability',
      title: 'Дожать ближайшую способность',
      description: `Ты близко к «${closeAbility.ability.title}». Осталось совсем немного.`,
      actionLabel: 'Способности',
      targetRoute: '/growth/abilities',
      icon: closeAbility.ability.icon,
    };
  }

  if (journeySummary?.currentStage && journeySummary.currentStage.status !== 'completed') {
    const incomplete = getIncompleteConditions(journeySummary.currentStage, 1);
    if (incomplete.length > 0) {
      const cond = incomplete[0]!;
      return {
        id: `journey_${cond.condition.id}`,
        priority: 'journey',
        title: 'Продвинуть главу пути',
        description: `Один шаг сегодня приблизит главу «${journeySummary.currentStage.stage.title}»: ${cond.condition.title}.`,
        actionLabel: 'Открыть карту',
        targetRoute: '/journey',
        icon: journeySummary.currentStage.stage.icon,
      };
    }
  }

  if (momentum >= -9 && momentum <= 9 && hasLittleTodayData(entry)) {
    const fb = {
      title: 'Задать направление дню',
      description: 'Инерция нейтральна. Начни с одного сигнала системы: калории, шаги или ясность.',
    };
    const text = themedAction('momentum_set_direction', themeId, fb);
    return {
      id: 'momentum_set_direction',
      priority: 'momentum_base',
      title: text.title,
      description: text.description,
      actionLabel: 'Заполнить день',
      targetRoute: '/today',
      icon: '🧭',
    };
  }

  if (momentum >= 40 && entry && isTodayAlmostClosed(entry, settings)) {
    const fb = {
      title: 'Не ломать хороший разгон',
      description:
        'Система набрала ход. Сегодня достаточно удержать базу, чтобы сохранить бонус инерции.',
    };
    const text = themedAction('momentum_keep_boost', themeId, fb);
    return {
      id: 'momentum_keep_boost',
      priority: 'momentum_base',
      title: text.title,
      description: text.description,
      actionLabel: 'Проверить день',
      targetRoute: '/today',
      icon: momentum >= 70 ? '🌊' : '🔥',
    };
  }

  if (momentum <= -10 && steps < MINIMAL_DAY_STEPS) {
    return {
      id: 'momentum_steps_minimum',
      priority: 'momentum_steps',
      title: 'Добрать шаги для возврата хода',
      description: `Минимум ${MINIMAL_DAY_STEPS.toLocaleString('ru')} шагов поможет системе снова сдвинуться.`,
      actionLabel: 'Открыть день',
      targetRoute: '/today',
      icon: '👟',
    };
  }

  return {
    id: 'hold_good_day',
    priority: 'base',
    title: 'Удержать хороший день',
    description: 'Сегодня цель простая: калории, шаги и ясность. Не героизм, а повторяемость.',
    actionLabel: 'Открыть день',
    targetRoute: '/today',
    icon: '✨',
  };
}
