import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import type {
  AvatarStageDriver,
  AvatarStageSignal,
  AvatarStageSignalId,
  AvatarStageSnapshot,
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

/** Visual reflection of progress — not a medical body score. */
export const AVATAR_STAGE_DISCLAIMER =
  'Стадии героя — визуальное отражение общего прогресса пути, а не медицинская оценка тела и не обещание конкретного внешнего результата.';

/**
 * Signal weights (sum = 1). Weight is important but never the only driver.
 * Non-weight signals can advance stage when weight is stalled.
 */
export const AVATAR_STAGE_WEIGHTS: Record<AvatarStageSignalId, number> = {
  weight: 0.34,
  waist: 0.16,
  abilities: 0.16,
  steps: 0.12,
  nutrition: 0.1,
  lifestyle: 0.07,
  campaign: 0.05,
};

/** Soft reference for waist progress when start/min known (cm lost → 1.0). */
const WAIST_SOFT_TARGET_CM = 20;

/** Personal map size used to normalize unlocks; classic fallback uses 12. */
const CLASSIC_ABILITY_SOFT_MAX = 12;

const SIGNAL_LABELS: Record<AvatarStageSignalId, string> = {
  weight: 'Прогресс веса',
  waist: 'Талия и обхваты',
  abilities: 'Способности тела',
  steps: 'Стабильность шагов',
  nutrition: 'Контроль питания',
  lifestyle: 'Алкоголь, сон и ресурс',
  campaign: 'Вехи кампании',
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

function countRecentDays(
  dailyEntries: DailyEntry[],
  today: string,
  windowDays: number,
  predicate: (entry: DailyEntry) => boolean,
): { hit: number; span: number } {
  const byDate = new Map(dailyEntries.map((e) => [e.date, e]));
  let hit = 0;
  let span = 0;
  const end = new Date(`${today}T12:00:00`);
  for (let i = 0; i < windowDays; i += 1) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    const iso = d.toISOString().slice(0, 10);
    const entry = byDate.get(iso);
    if (!entry) continue;
    span += 1;
    if (predicate(entry)) hit += 1;
  }
  return { hit, span };
}

function calcWeightRatio(params: {
  measurements: MeasurementEntry[];
  targetWeight: number | null | undefined;
}): number {
  const startWeight = getStartWeight(params.measurements);
  const bestWeight = getBestWeightForWeightLoss(params.measurements);
  return getWeightLossProgressRatio({
    startWeight,
    currentWeight: bestWeight,
    targetWeight: params.targetWeight,
  });
}

function calcWaistRatio(measurements: MeasurementEntry[]): number {
  const lost = getWaistLossCm(measurements);
  if (lost <= 0) return 0;
  return ratio01(lost / WAIST_SOFT_TARGET_CM);
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
    // Lifetime soft signal when window empty but history exists.
    const lifetimeNormal = dailyEntries.filter((e) =>
      isStepsNormalDone(e.steps, settings, e.date),
    ).length;
    if (lifetimeNormal === 0) return 0;
    return ratio01(lifetimeNormal / 40);
  }
  const normalRatio = normal / Math.min(windowDays, Math.max(span, 1));
  const minRatio = minimum / Math.min(windowDays, Math.max(span, 1));
  return ratio01(normalRatio * 0.7 + minRatio * 0.3);
}

function calcNutritionRatio(
  dailyEntries: DailyEntry[],
  settings: AppSettings,
  today: string,
): number {
  if (!isNutritionTrackingEnabled(settings)) {
    // Tracking off: do not punish legacy users — neutral soft zero.
    return 0;
  }
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

  return ratio01(
    (alcohol.hit / denom) * 0.55 + (sleepOrEnergy.hit / denom) * 0.45,
  );
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

function buildSignal(
  id: AvatarStageSignalId,
  ratio: number,
  detail: string,
): AvatarStageSignal {
  const maxPoints = AVATAR_STAGE_WEIGHTS[id] * 100;
  return {
    id,
    ratio: ratio01(ratio),
    points: pointsFrom(ratio, AVATAR_STAGE_WEIGHTS[id]),
    maxPoints: Math.round(maxPoints * 10) / 10,
    label: SIGNAL_LABELS[id],
    detail,
  };
}

function buildDrivers(signals: AvatarStageSignal[]): AvatarStageDriver[] {
  const ranked = [...signals]
    .filter((s) => s.points > 0)
    .sort((a, b) => b.points - a.points);

  return ranked.slice(0, 4).map((s) => ({
    id: s.id,
    label: s.label,
    detail: s.detail,
    why: driverWhy(s),
  }));
}

function driverWhy(signal: AvatarStageSignal): string {
  switch (signal.id) {
    case 'weight':
      return 'Вес сдвинул визуальный путь — но стадия считает и другие опоры.';
    case 'waist':
      return 'Обхваты (талия) подтянули стадию даже без скачка веса.';
    case 'abilities':
      return 'Открытые способности тела усиливают образ героя.';
    case 'steps':
      return 'Стабильные шаги держат прогресс формы в движении.';
    case 'nutrition':
      return 'Контроль питания добавляет устойчивость стадии.';
    case 'lifestyle':
      return 'Сон, ресурс и дни без алкоголя мягко двигают образ.';
    case 'campaign':
      return 'Вехи сезонов кампании отражаются в стадии героя.';
    default:
      return signal.detail;
  }
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
  const abilitiesRatio = calcAbilitiesRatio(params);
  const stepsRatio = calcStepsRatio(params.dailyEntries, params.settings, today);
  const nutritionRatio = calcNutritionRatio(
    params.dailyEntries,
    params.settings,
    today,
  );
  const lifestyleRatio = calcLifestyleRatio(params.dailyEntries, today);
  const campaignRatio = calcCampaignRatio({
    settings: params.settings,
    dailyEntries: params.dailyEntries,
    today,
  });

  const signals: AvatarStageSignal[] = [
    buildSignal(
      'weight',
      weightRatio,
      weightRatio > 0
        ? `Путь веса: ${Math.round(weightRatio * 100)}% к цели`
        : 'Вес ещё не задаёт путь (нет старта/цели или прогресса)',
    ),
    buildSignal(
      'waist',
      waistRatio,
      waistRatio > 0
        ? `Снято с талии: ~${Math.round(waistRatio * WAIST_SOFT_TARGET_CM)} см (мягкая шкала)`
        : 'Обхваты пока без заметного сдвига',
    ),
    buildSignal(
      'abilities',
      abilitiesRatio,
      abilitiesRatio > 0
        ? `Открыто способностей: ${Math.round(abilitiesRatio * 100)}% карты`
        : 'Способности тела ещё ждут первого открытия',
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
      'campaign',
      campaignRatio,
      campaignRatio > 0
        ? `Вехи кампании: ${Math.round(campaignRatio * 100)}%`
        : 'Сезонные вехи ещё впереди',
    ),
  ];

  const avatarProgress = clamp(
    Math.round(signals.reduce((sum, s) => sum + s.points, 0) * 10) / 10,
    0,
    100,
  );
  const stage = stageFromProgress(avatarProgress);

  const weightOnlyProgress = getWeightLossProgressPercent({
    startWeight: getStartWeight(params.measurements),
    currentWeight: getBestWeightForWeightLoss(params.measurements),
    targetWeight: profile.targetWeight,
  });
  const weightOnlyStage = getHeroStageFromWeightLoss({
    startWeight: getStartWeight(params.measurements),
    currentWeight: getBestWeightForWeightLoss(params.measurements),
    targetWeight: profile.targetWeight,
  });

  return {
    avatarProgress,
    stage,
    chapter: getChapterFromStage(stage),
    signals,
    drivers: buildDrivers(signals),
    weightOnlyStage,
    weightOnlyProgress: Math.round(weightOnlyProgress * 10) / 10,
    advancedBeyondWeight: stage > weightOnlyStage,
    disclaimer: AVATAR_STAGE_DISCLAIMER,
  };
}

/** Safe empty snapshot for legacy / no-data users. */
export function getDefaultAvatarStageSnapshot(): AvatarStageSnapshot {
  const signals = (Object.keys(AVATAR_STAGE_WEIGHTS) as AvatarStageSignalId[]).map(
    (id) => buildSignal(id, 0, 'Нет данных — безопасный старт'),
  );
  return {
    avatarProgress: 0,
    stage: 1,
    chapter: 1,
    signals,
    drivers: [],
    weightOnlyStage: 1,
    weightOnlyProgress: 0,
    advancedBeyondWeight: false,
    disclaimer: AVATAR_STAGE_DISCLAIMER,
  };
}

export function getAvatarStageFromProgress(avatarProgress: number): HeroStageNumber {
  return stageFromProgress(avatarProgress);
}
