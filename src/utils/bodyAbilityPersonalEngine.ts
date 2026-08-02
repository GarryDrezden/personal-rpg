import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type {
  BodyAbilitiesPersonalState,
  BodyAbilityDefinition,
  BodyAbilityPersonalItem,
  BodyAbilityPersonalSummary,
  BodyAbilityProfile,
  BodyAbilityStatus,
  UserBodyAbility,
} from '../types/bodyAbilityPersonal';
import type { BodyAbilityState } from '../types/bodyAbilityV1';
import {
  BODY_ABILITY_BANK,
  BODY_ABILITY_BANK_VERSION,
  getBodyAbilityDefinition,
} from '../constants/bodyAbilityBank';
import {
  explainBodyAbilitySelection,
  selectPersonalBodyAbilities,
} from './bodyAbilitySelectionEngine';
import {
  getWeightLossKg,
  getWaistLossCm,
} from './bodyAbilityEngine';
import { getDayMode, isStepsMinimumDone, isStepsNormalDone } from './stepsEngine';
import {
  getNutritionQuestCompleted,
  getTrackingMode,
  isNutritionTrackingEnabled,
} from './nutritionEngine';

export function emptyPersonalState(): BodyAbilitiesPersonalState {
  return {
    profile: null,
    selectedAbilityIds: [],
    abilities: {},
    generatedAt: null,
    lastReviewedAt: null,
    abilityBankVersion: null,
    retainedUnlockedIds: [],
  };
}

export function getPersonalBodyAbilitiesState(
  settings: AppSettings,
): BodyAbilitiesPersonalState {
  const raw = settings.bodyAbilityState?.personal;
  if (!raw) return emptyPersonalState();
  return {
    profile: raw.profile ?? null,
    selectedAbilityIds: raw.selectedAbilityIds ?? [],
    abilities: raw.abilities ?? {},
    generatedAt: raw.generatedAt ?? null,
    lastReviewedAt: raw.lastReviewedAt ?? null,
    abilityBankVersion: raw.abilityBankVersion ?? null,
    retainedUnlockedIds: raw.retainedUnlockedIds ?? [],
  };
}

export function previewBodyAbilitySelection(profile: BodyAbilityProfile) {
  return explainBodyAbilitySelection(profile, BODY_ABILITY_BANK, {
    targetCount: 24,
  });
}

export function isBodyAbilityProfileConfigured(settings: AppSettings): boolean {
  const personal = getPersonalBodyAbilitiesState(settings);
  return Boolean(personal.profile?.configuredAt && personal.selectedAbilityIds.length > 0);
}

function withPersonal(
  settings: AppSettings,
  personal: BodyAbilitiesPersonalState,
): AppSettings {
  const base: BodyAbilityState = {
    unlockedAbilityIds: settings.bodyAbilityState?.unlockedAbilityIds ?? [],
    abilityUnlocks: settings.bodyAbilityState?.abilityUnlocks ?? [],
    dismissedAbilityHintIds: settings.bodyAbilityState?.dismissedAbilityHintIds ?? [],
    personal,
  };
  return { ...settings, bodyAbilityState: base };
}

export function applyBodyAbilityProfile(
  settings: AppSettings,
  profile: BodyAbilityProfile,
  options?: { targetCount?: number; preserveUnlocked?: boolean },
): AppSettings {
  const preserveUnlocked = options?.preserveUnlocked !== false;
  const selected = selectPersonalBodyAbilities(profile, BODY_ABILITY_BANK, options);
  const now = new Date().toISOString();
  const previous = getPersonalBodyAbilitiesState(settings);

  const previouslyUnlocked = Object.values(previous.abilities).filter(
    (a) => a.status === 'unlocked',
  );
  const retainedUnlockedIds = preserveUnlocked
    ? previouslyUnlocked.map((a) => a.abilityId)
    : [];

  const selectedIds = new Set(selected.map((a) => a.id));
  for (const id of retainedUnlockedIds) selectedIds.add(id);

  const abilities: Record<string, UserBodyAbility> = {};

  for (const id of selectedIds) {
    const def = getBodyAbilityDefinition(id);
    if (!def) continue;
    const prev = previous.abilities[id];
    const wasUnlocked = prev?.status === 'unlocked';
    abilities[id] = {
      abilityId: id,
      status: wasUnlocked ? 'unlocked' : 'locked',
      selectedAt: prev?.selectedAt ?? now,
      suggestedAt: wasUnlocked ? null : null,
      unlockedAt: wasUnlocked ? prev?.unlockedAt ?? now : null,
      confirmedByUser: prev?.confirmedByUser,
    };
  }

  const personal: BodyAbilitiesPersonalState = {
    profile: { ...profile, configuredAt: profile.configuredAt ?? now },
    selectedAbilityIds: [...selectedIds].sort((a, b) => a.localeCompare(b)),
    abilities,
    generatedAt: now,
    lastReviewedAt: now,
    abilityBankVersion: BODY_ABILITY_BANK_VERSION,
    retainedUnlockedIds,
  };

  return withPersonal(settings, personal);
}

/** Safe regenerate: unlocked stay; locked/suggested rebuilt from new profile answers. */
export function regenerateBodyAbilityMap(
  settings: AppSettings,
  profile: BodyAbilityProfile,
): AppSettings {
  return applyBodyAbilityProfile(settings, profile, {
    targetCount: 24,
    preserveUnlocked: true,
  });
}

export function getPersonalAbilityItems(
  settings: AppSettings,
): BodyAbilityPersonalItem[] {
  const personal = getPersonalBodyAbilitiesState(settings);
  return personal.selectedAbilityIds
    .map((id) => {
      const definition = getBodyAbilityDefinition(id);
      const user = personal.abilities[id];
      if (!definition || !user) return null;
      return { definition, user };
    })
    .filter((x): x is BodyAbilityPersonalItem => x != null);
}

function countDays(
  dailyEntries: DailyEntry[],
  predicate: (e: DailyEntry) => boolean,
): number {
  return dailyEntries.filter(predicate).length;
}

function evaluateAuto(
  def: BodyAbilityDefinition,
  params: {
    dailyEntries: DailyEntry[];
    measurements: MeasurementEntry[];
    settings: AppSettings;
  },
): boolean {
  if (def.unlockMode !== 'auto' || !def.autoUnlock) return false;
  const { type, target } = def.autoUnlock;
  const { dailyEntries, measurements, settings } = params;

  switch (type) {
    case 'weight_loss_kg':
      return getWeightLossKg(measurements) >= target;
    case 'waist_loss_cm':
      return getWaistLossCm(measurements) >= target;
    case 'steps_days_normal':
      return (
        countDays(dailyEntries, (e) => isStepsNormalDone(e.steps, settings, e.date)) >=
        target
      );
    case 'steps_days_minimum':
      return (
        countDays(dailyEntries, (e) => isStepsMinimumDone(e.steps, settings, e.date)) >=
        target
      );
    case 'no_alcohol_days':
      return countDays(dailyEntries, (e) => e.alcohol === 'none') >= target;
    case 'calorie_tracking_days':
      if (!isNutritionTrackingEnabled(settings)) return false;
      return (
        countDays(dailyEntries, (e) =>
          getNutritionQuestCompleted({ entry: e, settings }),
        ) >= target
      );
    case 'calorie_limit_days': {
      if (!isNutritionTrackingEnabled(settings)) return false;
      if (getTrackingMode(settings) !== 'precise') {
        return (
          countDays(dailyEntries, (e) =>
            getNutritionQuestCompleted({ entry: e, settings }),
          ) >= target
        );
      }
      return (
        countDays(dailyEntries, (e) =>
          getNutritionQuestCompleted({ entry: e, settings }),
        ) >= target
      );
    }
    case 'recovery_days':
      return (
        countDays(dailyEntries, (e) => {
          const mode = getDayMode(e.dayMode);
          return mode === 'recovery' || mode === 'minimal';
        }) >= target
      );
    case 'gym_total':
      return countDays(dailyEntries, (e) => Boolean(e.gym)) >= target;
    case 'sleep_or_energy_days':
      return (
        countDays(
          dailyEntries,
          (e) => e.sleepHours != null || e.energyLevel != null,
        ) >= target
      );
    default:
      return false;
  }
}

function evaluateSuggestionSignal(
  def: BodyAbilityDefinition,
  params: {
    dailyEntries: DailyEntry[];
    measurements: MeasurementEntry[];
    settings: AppSettings;
  },
): boolean {
  if (def.unlockMode !== 'suggested_confirmation') return false;
  // Soft signals only — never auto-unlock.
  if (getWeightLossKg(params.measurements) >= 1) return true;
  if (getWaistLossCm(params.measurements) >= 1) return true;
  const recent = [...params.dailyEntries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 14);
  const stepsOk = recent.filter((e) =>
    isStepsMinimumDone(e.steps, params.settings, e.date),
  ).length;
  if (stepsOk >= 4 && def.tags.some((t) => ['walk', 'stairs', 'mobility', 'endurance'].includes(t) || t === 'stairs')) {
    return true;
  }
  if (
    recent.filter((e) => e.gym || e.morningExercise).length >= 2 &&
    (def.category === 'sport_training' || def.category === 'strength')
  ) {
    return true;
  }
  if (
    recent.filter((e) => getNutritionQuestCompleted({ entry: e, settings: params.settings }))
      .length >= 4 &&
    def.category === 'nutrition_control'
  ) {
    return true;
  }
  return false;
}

export function syncPersonalBodyAbilityProgress(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
}): AppSettings {
  const personal = getPersonalBodyAbilitiesState(params.settings);
  if (!personal.profile || personal.selectedAbilityIds.length === 0) {
    return params.settings;
  }

  let changed = false;
  const abilities = { ...personal.abilities };
  const now = new Date().toISOString();

  for (const id of personal.selectedAbilityIds) {
    const def = getBodyAbilityDefinition(id);
    const user = abilities[id];
    if (!def || !user || user.status === 'unlocked' || user.status === 'hidden') continue;

    if (def.unlockMode === 'auto' && evaluateAuto(def, params)) {
      abilities[id] = {
        ...user,
        status: 'unlocked',
        unlockedAt: now,
        confirmedByUser: false,
      };
      changed = true;
      continue;
    }

    if (
      def.unlockMode === 'suggested_confirmation' &&
      user.status === 'locked' &&
      evaluateSuggestionSignal(def, params)
    ) {
      abilities[id] = {
        ...user,
        status: 'suggested',
        suggestedAt: now,
      };
      changed = true;
    }
  }

  if (!changed) return params.settings;
  return withPersonal(params.settings, {
    ...personal,
    abilities,
    lastReviewedAt: now,
  });
}

export function respondToSuggestedAbility(
  settings: AppSettings,
  abilityId: string,
  response: 'yes' | 'not_yet' | 'irrelevant',
): AppSettings {
  const personal = getPersonalBodyAbilitiesState(settings);
  const user = personal.abilities[abilityId];
  if (!user) return settings;
  const now = new Date().toISOString();

  let status: BodyAbilityStatus = user.status;
  if (response === 'yes') status = 'unlocked';
  else if (response === 'not_yet') status = 'locked';
  else status = 'hidden';

  return withPersonal(settings, {
    ...personal,
    abilities: {
      ...personal.abilities,
      [abilityId]: {
        ...user,
        status,
        unlockedAt: status === 'unlocked' ? now : user.unlockedAt,
        suggestedAt: user.suggestedAt,
        confirmedByUser: response === 'yes',
      },
    },
    lastReviewedAt: now,
  });
}

export function manuallyUnlockPersonalAbility(
  settings: AppSettings,
  abilityId: string,
): AppSettings {
  const personal = getPersonalBodyAbilitiesState(settings);
  const user = personal.abilities[abilityId];
  const def = getBodyAbilityDefinition(abilityId);
  if (!user || !def) return settings;
  if (def.unlockMode === 'auto') return settings;
  if (user.status === 'unlocked') return settings;

  const now = new Date().toISOString();
  return withPersonal(settings, {
    ...personal,
    abilities: {
      ...personal.abilities,
      [abilityId]: {
        ...user,
        status: 'unlocked',
        unlockedAt: now,
        confirmedByUser: true,
      },
    },
    lastReviewedAt: now,
  });
}

export function getPersonalBodyAbilitySummary(
  settings: AppSettings,
): BodyAbilityPersonalSummary {
  const personal = getPersonalBodyAbilitiesState(settings);
  const items = getPersonalAbilityItems(settings);
  const unlockedCount = items.filter((i) => i.user.status === 'unlocked').length;
  const suggested = items.filter((i) => i.user.status === 'suggested');
  const nextSuggested = suggested[0]?.definition ?? null;
  const nextAuto =
    items.find(
      (i) => i.definition.unlockMode === 'auto' && i.user.status === 'locked',
    )?.definition ?? null;

  const configured = isBodyAbilityProfileConfigured(settings);

  return {
    configured,
    unlockedCount,
    selectedCount: personal.selectedAbilityIds.length,
    suggestedCount: suggested.length,
    nextSuggested,
    nextAuto,
    progressLine: !configured
      ? 'Настрой карту тела, чтобы видеть подходящие именно тебе изменения.'
      : unlockedCount > 0
        ? 'Вес может стоять, но тело всё равно может возвращать возможности.'
        : 'Карта собрана. Открывай изменения по данным или когда заметишь их.',
  };
}

export function getTopPersonalSuggestedAbility(
  settings: AppSettings,
): BodyAbilityDefinition | null {
  return getPersonalBodyAbilitySummary(settings).nextSuggested;
}
