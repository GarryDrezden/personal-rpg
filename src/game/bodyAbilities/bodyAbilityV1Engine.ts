import type { AppSettings, DailyEntry, MeasurementEntry } from '../../types';
import type {
  BodyAbilityState,
  BodyAbilityV1Def,
  BodyAbilityV1Hint,
  BodyAbilityV1Item,
  BodyAbilityV1Summary,
  BodyAbilityHintSignal,
} from '../../types/bodyAbilityV1';
import { BODY_ABILITIES_V1 } from './bodyAbilityConfig';
import { getWeightLossKg, getWaistLossCm } from '../../utils/bodyAbilityEngine';
import { getDayMode, isStepsNormalDone } from '../../utils/stepsEngine';

const HINT_MESSAGE =
  'Возможно, тело уже отвечает. Если заметил улучшение в жизни — открой способность.';

export function normalizeBodyAbilityState(
  state: BodyAbilityState | undefined,
): BodyAbilityState {
  return {
    unlockedAbilityIds: state?.unlockedAbilityIds ?? [],
    abilityUnlocks: state?.abilityUnlocks ?? [],
    dismissedAbilityHintIds: state?.dismissedAbilityHintIds ?? [],
  };
}

export function getBodyAbilityState(settings: AppSettings): BodyAbilityState {
  return normalizeBodyAbilityState(settings.bodyAbilityState);
}

export function isBodyAbilityV1Unlocked(settings: AppSettings, abilityId: string): boolean {
  return getBodyAbilityState(settings).unlockedAbilityIds.includes(abilityId);
}

export function unlockBodyAbilityV1(
  settings: AppSettings,
  abilityId: string,
  source: 'manual' | 'hint' = 'manual',
): AppSettings {
  const state = getBodyAbilityState(settings);
  if (state.unlockedAbilityIds.includes(abilityId)) return settings;

  const now = new Date().toISOString();
  return {
    ...settings,
    bodyAbilityState: {
      ...state,
      unlockedAbilityIds: [...state.unlockedAbilityIds, abilityId],
      abilityUnlocks: [
        ...(state.abilityUnlocks ?? []),
        { abilityId, unlockedAt: now, source },
      ],
    },
  };
}

export function dismissBodyAbilityHint(
  settings: AppSettings,
  abilityId: string,
): AppSettings {
  const state = getBodyAbilityState(settings);
  if (state.dismissedAbilityHintIds?.includes(abilityId)) return settings;
  return {
    ...settings,
    bodyAbilityState: {
      ...state,
      dismissedAbilityHintIds: [...(state.dismissedAbilityHintIds ?? []), abilityId],
    },
  };
}

function recentEntries(entries: DailyEntry[], days: number): DailyEntry[] {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  return sorted.slice(0, days);
}

function evaluateHintSignal(
  signal: BodyAbilityHintSignal,
  params: {
    dailyEntries: DailyEntry[];
    measurements: MeasurementEntry[];
    settings: AppSettings;
  },
): boolean {
  const { dailyEntries, measurements, settings } = params;
  const recent = recentEntries(dailyEntries, 14);

  switch (signal) {
    case 'steps_stable': {
      const withSteps = recent.filter((e) => e.steps != null && e.steps > 0);
      if (withSteps.length < 5) return false;
      const good = withSteps.filter((e) =>
        isStepsNormalDone(e.steps, settings, e.date),
      ).length;
      return good >= 3;
    }
    case 'steps_5000_days':
      return recent.filter((e) => (e.steps ?? 0) >= 5000).length >= 3;
    case 'steps_8000_days':
      return recent.filter((e) => (e.steps ?? 0) >= 8000).length >= 2;
    case 'waist_down':
      return getWaistLossCm(measurements) >= 1;
    case 'weight_down':
      return getWeightLossKg(measurements) >= 1;
    case 'recovery_rhythm':
      return recent.filter((e) => {
        const mode = getDayMode(e.dayMode);
        return mode === 'recovery' || mode === 'minimal';
      }).length >= 2;
    case 'journal_entries':
      return recent.filter((e) => e.journal).length >= 3;
    case 'movement_habits':
      return recent.filter(
        (e) => e.gym || e.morningExercise || (e.steps ?? 0) >= 3000,
      ).length >= 3;
    default:
      return false;
  }
}

function isHintEligible(
  ability: BodyAbilityV1Def,
  params: {
    dailyEntries: DailyEntry[];
    measurements: MeasurementEntry[];
    settings: AppSettings;
  },
): boolean {
  if (isBodyAbilityV1Unlocked(params.settings, ability.id)) return false;
  const dismissed = getBodyAbilityState(params.settings).dismissedAbilityHintIds ?? [];
  if (dismissed.includes(ability.id)) return false;
  return ability.hintSignals.some((signal) => evaluateHintSignal(signal, params));
}

export function getBodyAbilityV1Hints(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): BodyAbilityV1Hint[] {
  return BODY_ABILITIES_V1.filter((ability) => isHintEligible(ability, params)).map(
    (ability) => ({
      ability,
      message: ability.hint || HINT_MESSAGE,
    }),
  );
}

export function getTopBodyAbilityV1Hint(params: {
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  settings: AppSettings;
}): BodyAbilityV1Hint | null {
  const hints = getBodyAbilityV1Hints(params);
  return hints[0] ?? null;
}

export function getBodyAbilityV1Items(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
}): BodyAbilityV1Item[] {
  const state = getBodyAbilityState(params.settings);
  const unlockMap = new Map(
    (state.abilityUnlocks ?? []).map((u) => [u.abilityId, u.unlockedAt]),
  );

  return BODY_ABILITIES_V1.map((ability) => ({
    ability,
    unlocked: state.unlockedAbilityIds.includes(ability.id),
    unlockedAt: unlockMap.get(ability.id),
    hintActive: isHintEligible(ability, params),
  }));
}

export function getUnlockedBodyAbilitiesV1(settings: AppSettings): BodyAbilityV1Def[] {
  const ids = new Set(getBodyAbilityState(settings).unlockedAbilityIds);
  return BODY_ABILITIES_V1.filter((a) => ids.has(a.id));
}

export function getLockedBodyAbilitiesV1(settings: AppSettings): BodyAbilityV1Def[] {
  const ids = new Set(getBodyAbilityState(settings).unlockedAbilityIds);
  return BODY_ABILITIES_V1.filter((a) => !ids.has(a.id));
}

export function getBodyAbilityV1Summary(params: {
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
}): BodyAbilityV1Summary {
  const items = getBodyAbilityV1Items(params);
  const unlockedCount = items.filter((i) => i.unlocked).length;
  const locked = items.filter((i) => !i.unlocked);
  const hinted = locked.filter((i) => i.hintActive);
  const nextSuggested =
    hinted[0]?.ability ?? locked.find((i) => i.ability.tier === 'early')?.ability ?? null;

  return {
    unlockedCount,
    totalCount: BODY_ABILITIES_V1.length,
    nextSuggested,
    progressLine: 'Тело возвращает свободу не только на весах.',
  };
}

export function getBodyAbilityV1UnlockReaction(ability: BodyAbilityV1Def): string {
  return `Способность открыта: ${ability.title}. Это не просто цифра — тело возвращает свободу.`;
}
