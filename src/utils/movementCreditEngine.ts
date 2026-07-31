import type { AppSettings, DailyEntry } from '../types';
import type {
  PhysicalActivityDuration,
  PhysicalActivityLevel,
} from '../types/physicalActivity';
import type { SleepQuality } from '../types';
import {
  getPhysicalActivityDurationLabel,
  getPhysicalActivityLevelLabel,
} from '../constants/physicalActivity';
import { getDayMode, getStepsStatus, getStepsThresholds } from './stepsEngine';

function normalizeSleepQualityLocal(
  value: DailyEntry['sleepQuality'],
): SleepQuality | null {
  if (value === null || value === undefined) return null;
  if (value === 'poor' || value === 'ok' || value === 'good') return value;
  if (typeof value === 'number') {
    if (value <= 2) return 'poor';
    if (value === 3) return 'ok';
    return 'good';
  }
  return null;
}

export type MovementCreditSource =
  | 'steps'
  | 'physical_activity'
  | 'gym'
  | 'mobility';

export type MovementCreditStatus =
  | 'missing'
  | 'partial'
  | 'minimum_held'
  | 'normal'
  | 'strong';

export type MovementCreditResult = {
  status: MovementCreditStatus;
  sources: MovementCreditSource[];
  label: string;
  reasons: string[];
  suggestion?: string;
  /** Steps quest remains separate; this is overall body-load credit */
  holdsMinimumMovement: boolean;
  physicalActivityLevel: PhysicalActivityLevel | null;
  physicalActivityDuration: PhysicalActivityDuration | null;
};

export function getPhysicalActivityLevel(
  entry: DailyEntry | null | undefined,
): PhysicalActivityLevel | null {
  const level = entry?.physicalActivityLevel;
  if (level === 'none' || level === 'light' || level === 'medium' || level === 'heavy') {
    return level;
  }
  return null;
}

export function hasMarkedPhysicalActivity(entry: DailyEntry | null | undefined): boolean {
  const level = getPhysicalActivityLevel(entry);
  return level === 'light' || level === 'medium' || level === 'heavy';
}

export function isHeavyPhysicalActivity(entry: DailyEntry | null | undefined): boolean {
  return getPhysicalActivityLevel(entry) === 'heavy';
}

export function formatPhysicalActivitySummary(
  entry: DailyEntry | null | undefined,
): string | null {
  const level = getPhysicalActivityLevel(entry);
  if (!level || level === 'none') return null;
  const levelLabel = getPhysicalActivityLevelLabel(level).toLowerCase();
  const duration = entry?.physicalActivityDuration
    ? getPhysicalActivityDurationLabel(entry.physicalActivityDuration)
    : '';
  return duration
    ? `Физическая активность: ${levelLabel}, ${duration}`
    : `Физическая активность: ${levelLabel}`;
}

function needsRecoveryAfterLoad(entry: DailyEntry): boolean {
  const level = getPhysicalActivityLevel(entry);
  if (level !== 'heavy' && level !== 'medium') return false;
  const sleep = normalizeSleepQualityLocal(entry.sleepQuality);
  const lowEnergy = entry.energyLevel != null && entry.energyLevel <= 2;
  const longDay = entry.physicalActivityDuration === '6h_plus';
  return level === 'heavy' || lowEnergy || sleep === 'poor' || longDay;
}

/**
 * Steps measure movement. Physical activity measures body load.
 * Combined credit decides whether the day held a movement route.
 */
export function getMovementCredit(
  entry: DailyEntry | null | undefined,
  settings: AppSettings,
): MovementCreditResult {
  if (!entry) {
    return {
      status: 'missing',
      sources: [],
      label: 'Движение ещё не отмечено',
      reasons: [],
      holdsMinimumMovement: false,
      physicalActivityLevel: null,
      physicalActivityDuration: null,
    };
  }

  const date = entry.date;
  const dayMode = getDayMode(entry.dayMode);
  const stepsInfo = getStepsStatus({
    steps: entry.steps,
    settings,
    date,
    dayMode,
  });
  const thresholds = getStepsThresholds(settings, date);
  const steps = entry.steps ?? 0;
  const hasSteps = entry.steps !== null && entry.steps !== undefined;
  const paLevel = getPhysicalActivityLevel(entry);
  const paDuration = entry.physicalActivityDuration ?? null;
  const sources: MovementCreditSource[] = [];
  const reasons: string[] = [];

  if (entry.gym) sources.push('gym');
  if (entry.morningExercise) sources.push('mobility');

  let status: MovementCreditStatus = 'missing';
  let label = 'Движение ещё не отмечено';

  // Steps path first — do not replace step thresholds 1:1
  if (hasSteps && (stepsInfo.status === 'excellent' || stepsInfo.status === 'normal')) {
    sources.unshift('steps');
    status = stepsInfo.status === 'excellent' ? 'strong' : 'normal';
    label =
      status === 'strong'
        ? 'Сильное движение дня'
        : 'Норма движения удержана через шаги';
    reasons.push(
      `Шаги: ${steps.toLocaleString('ru')} / ${thresholds.normal.toLocaleString('ru')}`,
    );
  } else if (hasSteps && stepsInfo.status === 'minimum') {
    sources.unshift('steps');
    status = 'minimum_held';
    label = 'Минимум движения удержан через шаги';
    reasons.push(
      `Шаги: ${steps.toLocaleString('ru')} / ${thresholds.minimum.toLocaleString('ru')}`,
    );
  } else if (paLevel === 'heavy') {
    sources.unshift('physical_activity');
    status = 'minimum_held';
    label = 'Маршрут движения удержан через физическую активность';
    reasons.push('Шагов ниже нормы, но тело сегодня работало.');
    reasons.push(
      formatPhysicalActivitySummary(entry) ?? 'Физическая активность: тяжёлая',
    );
  } else if (paLevel === 'medium') {
    sources.unshift('physical_activity');
    status = 'minimum_held';
    label = 'Шагов ниже нормы, но физическая активность закрыла минимум движения';
    reasons.push(
      formatPhysicalActivitySummary(entry) ?? 'Физическая активность: средняя',
    );
    if (hasSteps) {
      reasons.push(
        `Шаги: ${steps.toLocaleString('ru')} / ${thresholds.minimum.toLocaleString('ru')}`,
      );
    }
  } else if (paLevel === 'light') {
    sources.unshift('physical_activity');
    status = 'partial';
    label = 'Частичный зачёт движения через лёгкую физическую активность';
    reasons.push('Лёгкая нагрузка учтена, но минимум движения ещё не закрыт.');
    if (hasSteps && steps > 0) {
      reasons.push(`Шаги: ${steps.toLocaleString('ru')}`);
    }
  } else if (entry.gym || entry.morningExercise) {
    if (!sources.includes('gym') && entry.gym) sources.push('gym');
    if (!sources.includes('mobility') && entry.morningExercise) sources.push('mobility');
    status = hasSteps && steps > 0 ? 'partial' : 'partial';
    label = entry.gym
      ? 'Частичный зачёт движения: зал'
      : 'Частичный зачёт движения: зарядка';
    reasons.push(
      entry.gym
        ? 'Зал учтён. Для полного минимума дня можно добавить шаги или физическую активность.'
        : 'Зарядка учтена. Для полного минимума дня можно добавить шаги или физическую активность.',
    );
  } else if (hasSteps && stepsInfo.status === 'low') {
    sources.push('steps');
    status = 'partial';
    label = 'Шагов мало — движение дня пока не закрыто';
    reasons.push(
      `Шаги: ${steps.toLocaleString('ru')} / ${thresholds.minimum.toLocaleString('ru')}`,
    );
  } else if (!hasSteps) {
    status = 'missing';
    label = 'Движение ещё не отмечено';
  }

  // Upgrade: heavy + long duration with already held minimum feels stronger
  if (
    status === 'minimum_held' &&
    paLevel === 'heavy' &&
    paDuration === '6h_plus' &&
    !sources.includes('steps')
  ) {
    status = 'strong';
    label = 'Тело сегодня работало. Маршрут движения удержан через физическую активность';
  }

  let suggestion: string | undefined;
  if (needsRecoveryAfterLoad(entry) && (status === 'minimum_held' || status === 'strong')) {
    suggestion =
      paLevel === 'heavy' && paDuration === '6h_plus'
        ? 'После тяжёлой физической активности лучший ход — сон, еда по плану и восстановление.'
        : 'Маршрут удержан через физическую активность. Завтра может понадобиться восстановление.';
  } else if (status === 'partial' && !hasMarkedPhysicalActivity(entry)) {
    suggestion =
      'Если шагов мало, но тело работало — отметь физическую активность на странице дня.';
  } else if (status === 'missing') {
    suggestion = 'Отметь шаги, зал или физическую активность — день не обязан быть пустым.';
  }

  const uniqueSources = [...new Set(sources)];

  return {
    status,
    sources: uniqueSources,
    label,
    reasons,
    suggestion,
    holdsMinimumMovement:
      status === 'minimum_held' || status === 'normal' || status === 'strong',
    physicalActivityLevel: paLevel,
    physicalActivityDuration: paDuration,
  };
}

/** Consecutive heavy body-load days with poor recovery — soft warning, not a fail */
export function getHeavyLoadRecoveryWarning(
  entries: DailyEntry[],
  today: string,
): string | null {
  const recent = [...entries]
    .filter((e) => e.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  let streak = 0;
  for (const e of recent) {
    const heavy = getPhysicalActivityLevel(e) === 'heavy';
    const drained =
      (e.energyLevel != null && e.energyLevel <= 2) ||
      normalizeSleepQualityLocal(e.sleepQuality) === 'poor';
    if (heavy && drained) streak += 1;
    else break;
  }

  if (streak >= 2) {
    return 'Несколько дней тяжёлой нагрузки и низкого ресурса. Пожиратель ресурса усиливается — лучший ход: recovery или минимальный день.';
  }
  return null;
}
