import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { WeeklyStoryReport, WeeklyStoryType } from '../types/weeklyStory';
import { weekDays, todayISO } from './dates';
import { hasAnyDailyData } from './achievementHelpers';
import { isCaloriesInLimit } from './achievementEngine';
import {
  isStepsMinimumDone,
  isStepsNormalDone,
  isStepsExcellentDone,
  getDayMode,
} from './stepsEngine';
import { sortMeasurementsByDate } from './measurements';
import {
  buildMomentumWeekSummaryText,
  calculateMomentumHistory,
  getMomentumSummary,
} from './momentumEngine';

type WeekMetrics = {
  daysWithData: number;
  calorieTrackingDays: number;
  calorieLimitDays: number;
  stepsMinimumDays: number;
  stepsNormalDays: number;
  stepsExcellentDays: number;
  noAlcoholDays: number;
  gymDays: number;
  recoveryDays: number;
  minimalDays: number;
  totalSteps: number;
  averageSteps: number;
  weightLossKg: number;
};

function collectWeekMetrics(
  weekStart: string,
  dailyEntries: DailyEntry[],
  measurements: MeasurementEntry[],
  settings: AppSettings,
): WeekMetrics {
  const days = weekDays(weekStart);
  const entries = days.map((d) => dailyEntries.find((e) => e.date === d));

  const daysWithData = entries.filter((e) => hasAnyDailyData(e)).length;
  const calorieTrackingDays = entries.filter(
    (e) => e && e.calories !== null && e.calories !== undefined,
  ).length;
  const calorieLimitDays = entries.filter((e) => e && isCaloriesInLimit(e, settings)).length;
  const stepsMinimumDays = entries.filter(
    (e) => e && isStepsMinimumDone(e.steps, settings, e.date),
  ).length;
  const stepsNormalDays = entries.filter(
    (e) => e && isStepsNormalDone(e.steps, settings, e.date),
  ).length;
  const stepsExcellentDays = entries.filter(
    (e) => e && isStepsExcellentDone(e.steps, settings, e.date),
  ).length;
  const noAlcoholDays = entries.filter((e) => e && e.alcohol === 'none').length;
  const gymDays = entries.filter((e) => e && e.gym).length;
  const recoveryDays = entries.filter(
    (e) => e && getDayMode(e.dayMode) === 'recovery',
  ).length;
  const minimalDays = entries.filter(
    (e) => e && getDayMode(e.dayMode) === 'minimal',
  ).length;
  const totalSteps = entries.reduce((s, e) => s + (e?.steps ?? 0), 0);
  const averageSteps = Math.round(totalSteps / 7);

  const weekMeasurements = sortMeasurementsByDate(measurements).filter((m) =>
    days.includes(m.date),
  );
  const withWeight = weekMeasurements.filter((m) => m.weight !== null && m.weight > 0);
  let weightLossKg = 0;
  if (withWeight.length >= 2) {
    weightLossKg = Math.max(0, withWeight[0]!.weight! - withWeight[withWeight.length - 1]!.weight!);
  }

  return {
    daysWithData,
    calorieTrackingDays,
    calorieLimitDays,
    stepsMinimumDays,
    stepsNormalDays,
    stepsExcellentDays,
    noAlcoholDays,
    gymDays,
    recoveryDays,
    minimalDays,
    totalSteps,
    averageSteps,
    weightLossKg,
  };
}

function detectWeekType(m: WeekMetrics): WeeklyStoryType {
  if (m.daysWithData === 0) return 'empty_week';

  const isChaos =
    m.daysWithData > 0 &&
    m.calorieTrackingDays <= 2 &&
    m.stepsMinimumDays <= 2 &&
    m.noAlcoholDays <= 2;

  const isRecovery = m.recoveryDays + m.minimalDays >= 2 && m.daysWithData >= 4;
  const isClarity = m.noAlcoholDays >= 6;
  const isMovement = m.stepsNormalDays >= 5 || m.totalSteps >= 80_000;
  const isBreakthrough =
    (m.calorieLimitDays >= 5 && m.stepsNormalDays >= 4 && m.noAlcoholDays >= 5) ||
    m.weightLossKg >= 0.5;
  const isHolding = m.daysWithData >= 4;

  if (isChaos && m.daysWithData <= 4) return 'chaos_week';
  if (isRecovery) return 'recovery_week';
  if (isClarity) return 'clarity_week';
  if (isMovement) return 'movement_week';
  if (isBreakthrough) return 'breakthrough_week';
  if (isChaos) return 'chaos_week';
  if (isHolding) return 'holding_week';
  return 'chaos_week';
}

const STORY_CONTENT: Record<
  WeeklyStoryType,
  Omit<WeeklyStoryReport, 'weekStart' | 'type' | 'highlights' | 'gains' | 'nextFocus'>
> = {
  empty_week: {
    title: 'Тихая неделя',
    subtitle: 'Данных пока нет',
    summary: 'Эта неделя пока не записана. Начни с одного дня — карта снова оживёт.',
  },
  breakthrough_week: {
    title: 'Неделя рывка',
    subtitle: 'Персонаж заметно продвинулся вперёд',
    summary:
      'На этой неделе система работала сильно: учёт, движение и ясность дали хороший общий прогресс.',
  },
  holding_week: {
    title: 'Неделя удержания',
    subtitle: 'Не идеально, но система осталась в игре',
    summary:
      'Главное — путь не оборвался. Неделя дала опору, даже если не все цели закрыты.',
  },
  recovery_week: {
    title: 'Неделя восстановления',
    subtitle: 'Система работала без героизма',
    summary:
      'На этой неделе важнее было не давить максимум, а сохранить управление. Recovery-дни помогли удержать путь.',
  },
  clarity_week: {
    title: 'Неделя ясности',
    subtitle: 'Меньше тумана — больше контроля',
    summary: 'Сильная неделя по ясности. Такие периоды дают режиму больше пространства.',
  },
  movement_week: {
    title: 'Неделя движения',
    subtitle: 'Шаги стали главным двигателем недели',
    summary: 'На этой неделе персонаж много двигался. Выносливость получила хороший вклад.',
  },
  chaos_week: {
    title: 'Неделя хаоса',
    subtitle: 'Система просела, но путь не закончен',
    summary:
      'Неделя была неровной. Не нужно закрывать прошлые дни идеально — лучше собрать следующий минимальный день.',
  },
};

function buildHighlights(m: WeekMetrics): string[] {
  const highlights: string[] = [];
  if (m.calorieTrackingDays >= 5) highlights.push(`Учёт калорий: ${m.calorieTrackingDays}/7 дней`);
  if (m.stepsNormalDays >= 3) highlights.push(`Норма шагов: ${m.stepsNormalDays} дней`);
  if (m.stepsExcellentDays >= 1) highlights.push(`Отличные дни: ${m.stepsExcellentDays}`);
  if (m.noAlcoholDays >= 5) highlights.push(`Ясность: ${m.noAlcoholDays} дней без алкоголя`);
  if (m.recoveryDays + m.minimalDays >= 2)
    highlights.push(`Recovery/minimal: ${m.recoveryDays + m.minimalDays} дней`);
  if (m.gymDays >= 1) highlights.push(`Тренировки: ${m.gymDays}`);
  if (m.weightLossKg >= 0.3) highlights.push(`Вес: −${m.weightLossKg.toFixed(1)} кг за неделю`);
  if (highlights.length === 0 && m.daysWithData > 0) {
    highlights.push(`Дней с данными: ${m.daysWithData}`);
    highlights.push(`Средние шаги: ${m.averageSteps.toLocaleString('ru')}`);
  }
  return highlights.slice(0, 5);
}

function buildGains(m: WeekMetrics): WeeklyStoryReport['gains'] {
  const gains: WeeklyStoryReport['gains'] = [];
  if (m.totalSteps > 0)
    gains.push({ label: 'Шагов', value: m.totalSteps, icon: '👟' });
  if (m.calorieTrackingDays > 0)
    gains.push({ label: 'Дней учёта', value: m.calorieTrackingDays, icon: '🧾' });
  if (m.noAlcoholDays > 0)
    gains.push({ label: 'Дней ясности', value: m.noAlcoholDays, icon: '💧' });
  if (m.gymDays > 0) gains.push({ label: 'Тренировок', value: m.gymDays, icon: '🏋️' });
  return gains.slice(0, 4);
}

function buildNextFocus(type: WeeklyStoryType, m: WeekMetrics): string {
  switch (type) {
    case 'empty_week':
      return 'Внеси вес или калории за сегодня — первая глава пути откроется.';
    case 'breakthrough_week':
      return 'Удержи темп без героизма — повторяемость важнее рывка.';
    case 'recovery_week':
      return 'Продолжай слушать тело: recovery — часть системы, не слабость.';
    case 'clarity_week':
      return 'Закрепи ясность: ещё один день без тумана укрепит режим.';
    case 'movement_week':
      return 'Держи базу шагов — выносливость растёт через обычные дни.';
    case 'chaos_week':
      return 'Собери один минимальный день: калории, 7000 шагов, ясность.';
    default:
      return m.calorieTrackingDays < 5
        ? 'Верни регулярный учёт — это главная опора системы.'
        : 'Продолжай удерживать базу: учёт, шаги, ясность.';
  }
}

export function generateWeeklyStoryReport(params: {
  weekStart: string;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
}): WeeklyStoryReport {
  const { weekStart, dailyEntries, measurements, settings } = params;
  const today = params.today ?? todayISO();
  const metrics = collectWeekMetrics(weekStart, dailyEntries, measurements, settings);
  const type = detectWeekType(metrics);
  const content = STORY_CONTENT[type];

  const momentumSummary = getMomentumSummary({ today, dailyEntries, settings });
  const history = calculateMomentumHistory({ dailyEntries, settings });
  const weekDates = weekDays(weekStart);
  const weekResults = history.filter((r) => weekDates.includes(r.date));
  const weekStartMomentum =
    weekResults.length > 0
      ? weekResults[0]!.decayValue
      : momentumSummary.currentValue;
  const weekEndMomentum =
    weekResults.length > 0
      ? weekResults[weekResults.length - 1]!.endValue
      : momentumSummary.currentValue;
  const momentumDelta = Math.round(weekEndMomentum - weekStartMomentum);
  const averageMomentum =
    weekResults.length > 0
      ? Math.round(weekResults.reduce((s, r) => s + r.endValue, 0) / weekResults.length)
      : momentumSummary.weekAverage;

  const highlights = buildHighlights(metrics);
  if (weekResults.length > 0) {
    highlights.unshift(`Инерция недели: ${momentumDelta >= 0 ? '+' : ''}${momentumDelta}`);
  }

  return {
    weekStart,
    type,
    title: content.title,
    subtitle: content.subtitle,
    summary: content.summary,
    highlights: highlights.slice(0, 5),
    gains: buildGains(metrics),
    nextFocus: buildNextFocus(type, metrics),
    momentumDelta,
    averageMomentum,
    momentumSummaryText: buildMomentumWeekSummaryText(momentumDelta),
  };
}
