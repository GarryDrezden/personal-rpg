import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import type {
  AvatarStageDriver,
  AvatarStageLayer,
  AvatarStageSignal,
  AvatarStageSignalId,
  AvatarStageSnapshot,
  HeroStateLevel,
} from '../../types/avatarStages';
import type { HeroStageNumber } from '../../types/gameAssets';
import { HERO_STAGE_COUNT } from '../../types/gameAssets';
import { getWaistLossCm } from '../../utils/bodyAbilityEngine';
import {
  getPersonalAbilityItems,
  getPersonalBodyAbilitySummary,
  isBodyAbilityProfileConfigured,
} from '../../utils/bodyAbilityPersonalEngine';
import { getAllBodyAbilityProgress } from '../../utils/bodyAbilityEngine';
import { todayISO } from '../../utils/dates';
import { format, parseISO, subDays } from 'date-fns';
import { sortMeasurementsByDate } from '../../utils/measurements';
import { getMomentumSummary } from '../../utils/momentumEngine';
import {
  getNutritionQuestCompleted,
  isNutritionTrackingEnabled,
} from '../../utils/nutritionEngine';
import { isStepsMinimumDone, isStepsNormalDone } from '../../utils/stepsEngine';
import { resolveGameProfile } from '../gameProfile';
import {
  clamp,
  getBestWeightForWeightLoss,
  getChapterFromStage,
  getHeroStageFromWeightLoss,
  getStartWeight,
  getWeightLossProgressPercent,
  getWeightLossProgressRatio,
} from '../heroProgressEngine';
import { SEASON_COUNT } from '../seasons/seasonConfig';
import {
  evaluateSeasonProgress,
  resolveActiveSeasonIndex,
  resolveCampaignStartDate,
} from '../seasons/seasonEngine';

/** Visual reflection — not a medical body score. */
export const AVATAR_STAGE_DISCLAIMER =
  'Стадия тела и состояние героя — визуальное отражение пути, а не медицинская оценка и не обещание конкретного внешнего результата.';

/**
 * Body Stage layer (silhouette / volume).
 * Weight + measurements = 100% of bodyProgress (≥75–85% requirement).
 * Habits never shrink body volume here.
 */
export const BODY_STAGE_WEIGHTS = {
  weight: 0.72,
  waist: 0.2,
  measurements: 0.08,
} as const;

/**
 * Hero State layer (posture / energy / confidence chrome).
 * Does not select body silhouette art.
 */
export const HERO_STATE_WEIGHTS = {
  abilities: 0.22,
  steps: 0.18,
  nutrition: 0.16,
  lifestyle: 0.18,
  momentum: 0.14,
  campaign: 0.12,
} as const;

/** @deprecated Use BODY_STAGE_WEIGHTS + HERO_STATE_WEIGHTS */
export const AVATAR_STAGE_WEIGHTS: Record<AvatarStageSignalId, number> = {
  weight: BODY_STAGE_WEIGHTS.weight,
  waist: BODY_STAGE_WEIGHTS.waist,
  measurements: BODY_STAGE_WEIGHTS.measurements,
  abilities: HERO_STATE_WEIGHTS.abilities,
  steps: HERO_STATE_WEIGHTS.steps,
  nutrition: HERO_STATE_WEIGHTS.nutrition,
  lifestyle: HERO_STATE_WEIGHTS.lifestyle,
  momentum: HERO_STATE_WEIGHTS.momentum,
  campaign: HERO_STATE_WEIGHTS.campaign,
};

/** Soft kg scale when target weight is missing (best confirmed loss). */
const WEIGHT_SOFT_TARGET_KG = 40;
const WAIST_SOFT_TARGET_CM = 20;
const MEASUREMENTS_SOFT_TARGET_CM = 24;
const CLASSIC_ABILITY_SOFT_MAX = 12;

export const HERO_STATE_LABELS: Record<HeroStateLevel, string> = {
  depleted: 'на исходе',
  steady: 'ровный',
  energized: 'собран',
  strong: 'уверен',
};

const SIGNAL_META: Record<
  AvatarStageSignalId,
  { layer: AvatarStageLayer; label: string }
> = {
  weight: { layer: 'body', label: 'Лучший вес' },
  waist: { layer: 'body', label: 'Талия' },
  measurements: { layer: 'body', label: 'Другие замеры' },
  abilities: { layer: 'hero', label: 'Способности тела' },
  steps: { layer: 'hero', label: 'Стабильность шагов' },
  nutrition: { layer: 'hero', label: 'Контроль питания' },
  lifestyle: { layer: 'hero', label: 'Алкоголь, сон и ресурс' },
  momentum: { layer: 'hero', label: 'Инерция' },
  campaign: { layer: 'hero', label: 'Главы и сезоны' },
};

function ratio01(value: number): number {
  return clamp(value, 0, 1);
}

function pointsFrom(ratio: number, weight: number): number {
  return Math.round(ratio01(ratio) * weight * 1000) / 10;
}

function stageFromProgress(progressPercent: number): HeroStageNumber {
  const ratio = clamp(progressPercent / 100, 0, 1);
  if (ratio <= 0) return 1;
  const stage = Math.min(
    HERO_STAGE_COUNT,
    Math.max(1, Math.floor(ratio * HERO_STAGE_COUNT) + 1),
  );
  return stage as HeroStageNumber;
}

export function getHeroStateFromProgress(heroStateProgress: number): HeroStateLevel {
  const p = clamp(heroStateProgress, 0, 100);
  if (p < 25) return 'depleted';
  if (p < 50) return 'steady';
  if (p < 75) return 'energized';
  return 'strong';
}

export function getHeroStateLabel(heroState: HeroStateLevel): string {
  return HERO_STATE_LABELS[heroState];
}

function countRecentDays(
  dailyEntries: DailyEntry[],
  today: string,
  windowDays: number,
  predicate: (entry: DailyEntry) => boolean,
): { hit: number; span: number } {
  const byDate = new Map(dailyEntries.map((e) => [e.date, e]));
  let hit = 0;
  let span = 0;
  const end = parseISO(today);
  for (let i = 0; i < windowDays; i += 1) {
    const iso = format(subDays(end, i), 'yyyy-MM-dd');
    const entry = byDate.get(iso);
    if (!entry) continue;
    span += 1;
    if (predicate(entry)) hit += 1;
  }
  return { hit, span };
}

/** Best confirmed weight progress — never latest spike / day noise. */
function calcWeightRatio(params: {
  measurements: MeasurementEntry[];
  targetWeight: number | null | undefined;
}): number {
  const startWeight = getStartWeight(params.measurements);
  const bestWeight = getBestWeightForWeightLoss(params.measurements);
  const pathRatio = getWeightLossProgressRatio({
    startWeight,
    currentWeight: bestWeight,
    targetWeight: params.targetWeight,
  });
  if (pathRatio > 0) return pathRatio;

  if (
    startWeight == null ||
    bestWeight == null ||
    bestWeight >= startWeight
  ) {
    return 0;
  }
  return ratio01((startWeight - bestWeight) / WEIGHT_SOFT_TARGET_KG);
}

function calcWaistRatio(measurements: MeasurementEntry[]): number {
  const lost = getWaistLossCm(measurements);
  if (lost <= 0) return 0;
  return ratio01(lost / WAIST_SOFT_TARGET_CM);
}

/** Soft best-loss across belly / hips / chest (not weight). */
function calcOtherMeasurementsRatio(measurements: MeasurementEntry[]): number {
  const fields: Array<'belly' | 'hips' | 'chest'> = ['belly', 'hips', 'chest'];
  let totalLoss = 0;
  let used = 0;
  for (const field of fields) {
    const series = sortMeasurementsByDate(measurements).filter(
      (m) => m[field] !== null && (m[field] as number) > 0,
    );
    if (series.length < 2) continue;
    const start = series[0]![field] as number;
    const best = Math.min(...series.map((m) => m[field] as number));
    const loss = Math.max(0, start - best);
    if (loss > 0) {
      totalLoss += loss;
      used += 1;
    }
  }
  if (used === 0) return 0;
  return ratio01(totalLoss / MEASUREMENTS_SOFT_TARGET_CM);
}

function calcAbilitiesRatio(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): number {
  if (isBodyAbilityProfileConfigured(params.settings)) {
    const summary = getPersonalBodyAbilitySummary(params.settings);
    const items = getPersonalAbilityItems(params.settings);
    const denom = Math.max(1, summary.selectedCount || items.length);
    return ratio01(summary.unlockedCount / denom);
  }

  const classic = getAllBodyAbilityProgress(params);
  const unlocked = classic.filter((p) => p.unlocked).length;
  return ratio01(unlocked / CLASSIC_ABILITY_SOFT_MAX);
}

function calcStepsRatio(
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  today: string,
): number {
  const windowDays = 28;
  const { hit: normal, span } = countRecentDays(dailyEntries, today, windowDays, (e) =>
    isStepsNormalDone(e.steps, settings, e.date),
  );
  const { hit: minimum } = countRecentDays(dailyEntries, today, windowDays, (e) =>
    isStepsMinimumDone(e.steps, settings, e.date),
  );
  if (span === 0) {
    const lifetimeNormal = dailyEntries.filter((e) =>
      isStepsNormalDone(e.steps, settings, e.date),
    ).length;
    if (lifetimeNormal === 0) return 0;
    return ratio01(lifetimeNormal / 40);
  }
  const denom = Math.min(windowDays, Math.max(span, 1));
  return ratio01((normal / denom) * 0.7 + (minimum / denom) * 0.3);
}

function calcNutritionRatio(
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  today: string,
): number {
  if (!isNutritionTrackingEnabled(settings)) return 0;
  const windowDays = 28;
  const { hit, span } = countRecentDays(dailyEntries, today, windowDays, (e) =>
    getNutritionQuestCompleted({ entry: e, settings }),
  );
  if (span === 0) {
    const lifetime = dailyEntries.filter((e) =>
      getNutritionQuestCompleted({ entry: e, settings }),
    ).length;
    return ratio01(lifetime / 40);
  }
  return ratio01(hit / Math.min(windowDays, Math.max(span, 1)));
}

function calcLifestyleRatio(dailyEntries: DailyEntry[], today: string): number {
  const windowDays = 28;
  const alcohol = countRecentDays(
    dailyEntries,
    today,
    windowDays,
    (e) => e.alcohol === 'none',
  );
  const sleepOrEnergy = countRecentDays(dailyEntries, today, windowDays, (e) => {
    const sleepOk =
      (e.sleepHours != null && e.sleepHours >= 6) ||
      (typeof e.sleepQuality === 'number' && e.sleepQuality >= 3) ||
      e.sleepQuality === 'good' ||
      e.sleepQuality === 'ok';
    const energyOk = typeof e.energyLevel === 'number' && e.energyLevel >= 3;
    return Boolean(sleepOk || energyOk);
  });

  const denom = Math.max(alcohol.span, sleepOrEnergy.span, 1);
  if (alcohol.span === 0 && sleepOrEnergy.span === 0) {
    const lifeAlcohol = dailyEntries.filter((e) => e.alcohol === 'none').length;
    const lifeRest = dailyEntries.filter(
      (e) => e.sleepHours != null || e.energyLevel != null || e.sleepQuality != null,
    ).length;
    if (lifeAlcohol === 0 && lifeRest === 0) return 0;
    return ratio01((lifeAlcohol / 40) * 0.55 + (lifeRest / 40) * 0.45);
  }

  return ratio01((alcohol.hit / denom) * 0.55 + (sleepOrEnergy.hit / denom) * 0.45);
}

function calcMomentumRatio(params: {
  dailyEntries: DailyEntry[];
  settings: AppSettings;
  today: string;
}): number {
  const summary = getMomentumSummary({
    today: params.today,
    dailyEntries: params.dailyEntries,
    settings: params.settings,
  });
  // Map −100…100 → 0…1. Low momentum can dip Hero State without touching bodyStage.
  return ratio01((summary.currentValue + 100) / 200);
}

function calcCampaignRatio(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  today: string;
}): number {
  const campaignStartDate = resolveCampaignStartDate(
    params.settings,
    params.dailyEntries,
    params.today,
  );
  const active = resolveActiveSeasonIndex({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today: params.today,
    campaignStartDate,
  });

  let completedBefore = 0;
  for (let index = 1; index < active; index += 1) {
    const progress = evaluateSeasonProgress({
      settings: params.settings,
      dailyEntries: params.dailyEntries,
      campaignStartDate,
      seasonIndex: index,
      today: params.today,
      extendOpenEnd: true,
    });
    if (progress.isCompleted) completedBefore += 1;
  }

  const current = evaluateSeasonProgress({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    campaignStartDate,
    seasonIndex: active,
    today: params.today,
    extendOpenEnd: true,
  });
  const questRatio =
    current.quests.length > 0
      ? current.quests.filter((q) => q.completed).length / current.quests.length
      : 0;

  return ratio01((completedBefore + questRatio) / SEASON_COUNT);
}

function layerWeight(id: AvatarStageSignalId): number {
  if (id in BODY_STAGE_WEIGHTS) {
    return BODY_STAGE_WEIGHTS[id as keyof typeof BODY_STAGE_WEIGHTS];
  }
  return HERO_STATE_WEIGHTS[id as keyof typeof HERO_STATE_WEIGHTS];
}

function buildSignal(
  id: AvatarStageSignalId,
  ratio: number,
  detail: string,
): AvatarStageSignal {
  const meta = SIGNAL_META[id];
  const weight = layerWeight(id);
  return {
    id,
    layer: meta.layer,
    ratio: ratio01(ratio),
    points: pointsFrom(ratio, weight),
    maxPoints: Math.round(weight * 1000) / 10,
    label: meta.label,
    detail,
  };
}

function driverWhy(signal: AvatarStageSignal): string {
  switch (signal.id) {
    case 'weight':
      return 'Лучший подтверждённый вес сдвигает силуэт тела.';
    case 'waist':
      return 'Талия может чуть продвинуть стадию тела даже при стабильном весе.';
    case 'measurements':
      return 'Другие обхваты мягко поддерживают силуэт.';
    case 'abilities':
      return 'Открытые способности усиливают собранность героя.';
    case 'steps':
      return 'Стабильные шаги держат осанку и энергию пути.';
    case 'nutrition':
      return 'Контроль питания поддерживает состояние героя.';
    case 'lifestyle':
      return 'Сон, ресурс и дни без алкоголя меняют энергию стойки.';
    case 'momentum':
      return 'Инерция влияет на визуальную собранность (может временно просесть).';
    case 'campaign':
      return 'Главы и сезоны добавляют уверенность образа.';
    default:
      return signal.detail;
  }
}

function buildDrivers(
  signals: AvatarStageSignal[],
  limit = 4,
): AvatarStageDriver[] {
  return [...signals]
    .filter((s) => s.points > 0)
    .sort((a, b) => b.points - a.points)
    .slice(0, limit)
    .map((s) => ({
      id: s.id,
      layer: s.layer,
      label: s.label,
      detail: s.detail,
      why: driverWhy(s),
    }));
}

function sumPoints(signals: AvatarStageSignal[]): number {
  return clamp(
    Math.round(signals.reduce((sum, s) => sum + s.points, 0) * 10) / 10,
    0,
    100,
  );
}

export function resolveAvatarStageSnapshot(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
  today?: string;
}): AvatarStageSnapshot {
  const today = params.today ?? todayISO();
  const profile = resolveGameProfile(params.settings);

  const weightRatio = calcWeightRatio({
    measurements: params.measurements,
    targetWeight: profile.targetWeight,
  });
  const waistRatio = calcWaistRatio(params.measurements);
  const measurementsRatio = calcOtherMeasurementsRatio(params.measurements);
  const abilitiesRatio = calcAbilitiesRatio(params);
  const stepsRatio = calcStepsRatio(params.dailyEntries, params.settings, today);
  const nutritionRatio = calcNutritionRatio(
    params.dailyEntries,
    params.settings,
    today,
  );
  const lifestyleRatio = calcLifestyleRatio(params.dailyEntries, today);
  const momentumRatio = calcMomentumRatio({
    dailyEntries: params.dailyEntries,
    settings: params.settings,
    today,
  });
  const campaignRatio = calcCampaignRatio({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today,
  });

  const waistCm = getWaistLossCm(params.measurements);

  const bodySignals: AvatarStageSignal[] = [
    buildSignal(
      'weight',
      weightRatio,
      weightRatio > 0
        ? `Лучший вес на пути: ${Math.round(weightRatio * 100)}% шкалы`
        : 'Нет подтверждённого прогресса веса',
    ),
    buildSignal(
      'waist',
      waistRatio,
      waistRatio > 0
        ? `Талия: −${Math.round(waistCm)} см от старта (лучший)`
        : 'Талия пока без заметного сдвига',
    ),
    buildSignal(
      'measurements',
      measurementsRatio,
      measurementsRatio > 0
        ? `Обхваты (живот/бёдра/грудь): ${Math.round(measurementsRatio * 100)}%`
        : 'Другие замеры пока без сдвига',
    ),
  ];

  const heroSignals: AvatarStageSignal[] = [
    buildSignal(
      'abilities',
      abilitiesRatio,
      abilitiesRatio > 0
        ? `Открыто способностей: ${Math.round(abilitiesRatio * 100)}% карты`
        : 'Способности тела ещё ждут открытия',
    ),
    buildSignal(
      'steps',
      stepsRatio,
      stepsRatio > 0
        ? `Стабильность шагов: ${Math.round(stepsRatio * 100)}%`
        : 'Шаги пока редкие в окне стабильности',
    ),
    buildSignal(
      'nutrition',
      nutritionRatio,
      !isNutritionTrackingEnabled(params.settings)
        ? 'Учёт питания выключен — сигнал нейтрален'
        : nutritionRatio > 0
          ? `Контроль питания: ${Math.round(nutritionRatio * 100)}%`
          : 'Питание пока без устойчивых отметок',
    ),
    buildSignal(
      'lifestyle',
      lifestyleRatio,
      lifestyleRatio > 0
        ? `Сон / ресурс / без алкоголя: ${Math.round(lifestyleRatio * 100)}%`
        : 'Сон, ресурс и алкоголь почти не отмечены',
    ),
    buildSignal(
      'momentum',
      momentumRatio,
      `Инерция на шкале состояния: ${Math.round(momentumRatio * 100)}%`,
    ),
    buildSignal(
      'campaign',
      campaignRatio,
      campaignRatio > 0
        ? `Вехи кампании: ${Math.round(campaignRatio * 100)}%`
        : 'Сезонные вехи ещё впереди',
    ),
  ];

  const bodyProgress = sumPoints(bodySignals);
  const heroStateProgress = sumPoints(heroSignals);
  const bodyStage = stageFromProgress(bodyProgress);
  const heroState = getHeroStateFromProgress(heroStateProgress);
  const avatarProgress = clamp(
    Math.round(bodyProgress * 0.55 + heroStateProgress * 0.45),
    0,
    100,
  );

  const startWeight = getStartWeight(params.measurements);
  const bestWeight = getBestWeightForWeightLoss(params.measurements);
  const weightOnlyProgress = getWeightLossProgressPercent({
    startWeight,
    currentWeight: bestWeight,
    targetWeight: profile.targetWeight,
  });
  const weightOnlyStage = getHeroStageFromWeightLoss({
    startWeight,
    currentWeight: bestWeight,
    targetWeight: profile.targetWeight,
  });

  const bodyDrivers = buildDrivers(bodySignals, 3);
  const heroDrivers = buildDrivers(heroSignals, 4);
  const signals = [...bodySignals, ...heroSignals];

  return {
    bodyProgress,
    heroStateProgress,
    bodyStage,
    heroState,
    avatarProgress,
    stage: bodyStage,
    chapter: getChapterFromStage(bodyStage),
    bodySignals,
    heroSignals,
    bodyDrivers,
    heroDrivers,
    signals,
    drivers: [...bodyDrivers, ...heroDrivers].slice(0, 5),
    weightOnlyStage,
    weightOnlyProgress: Math.round(weightOnlyProgress * 10) / 10,
    advancedBeyondWeight: bodyStage > weightOnlyStage,
    disclaimer: AVATAR_STAGE_DISCLAIMER,
  };
}

/** Safe empty snapshot for legacy / no-data users. */
export function getDefaultAvatarStageSnapshot(): AvatarStageSnapshot {
  const bodySignals = (
    Object.keys(BODY_STAGE_WEIGHTS) as Array<keyof typeof BODY_STAGE_WEIGHTS>
  ).map((id) => buildSignal(id, 0, 'Нет данных — безопасный старт'));
  const heroSignals = (
    Object.keys(HERO_STATE_WEIGHTS) as Array<keyof typeof HERO_STATE_WEIGHTS>
  ).map((id) => buildSignal(id, 0, 'Нет данных — безопасный старт'));

  return {
    bodyProgress: 0,
    heroStateProgress: 0,
    bodyStage: 1,
    heroState: 'depleted',
    avatarProgress: 0,
    stage: 1,
    chapter: 1,
    bodySignals,
    heroSignals,
    bodyDrivers: [],
    heroDrivers: [],
    signals: [...bodySignals, ...heroSignals],
    drivers: [],
    weightOnlyStage: 1,
    weightOnlyProgress: 0,
    advancedBeyondWeight: false,
    disclaimer: AVATAR_STAGE_DISCLAIMER,
  };
}

export function getAvatarStageFromProgress(progress: number): HeroStageNumber {
  return stageFromProgress(progress);
}

/** Body silhouette stage from bodyProgress only. */
export function getBodyStageFromProgress(bodyProgress: number): HeroStageNumber {
  return stageFromProgress(bodyProgress);
}
