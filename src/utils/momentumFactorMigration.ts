import { MOMENTUM_SLEEP_FACTOR_TEXTS } from '../constants/momentumFactorTexts';
import { MOMENTUM_FACTOR_ID_MIGRATIONS } from '../constants/momentumFactorMigrations';
import type { MomentumDailyFactor, MomentumDayResult } from '../types/momentum';

const DEFAULT_SLEEP_TEXTS = MOMENTUM_SLEEP_FACTOR_TEXTS;

function enrichSleepFactor(factor: MomentumDailyFactor): MomentumDailyFactor {
  const cozy = DEFAULT_SLEEP_TEXTS[factor.id]?.cozy;
  if (!cozy) return factor;

  return {
    ...factor,
    source: 'sleep',
    title: factor.title || cozy.title,
    description: factor.description ?? cozy.description,
    explanation: factor.explanation ?? cozy.explanation,
    type:
      factor.value > 0 ? 'positive' : factor.value < 0 ? 'negative' : factor.type,
  };
}

export function migrateMomentumFactorId(id: string): string {
  return MOMENTUM_FACTOR_ID_MIGRATIONS[id] ?? id;
}

export function migrateMomentumFactor(factor: MomentumDailyFactor): MomentumDailyFactor {
  const nextId = migrateMomentumFactorId(factor.id);
  if (nextId === factor.id) return factor;

  const migrated: MomentumDailyFactor = { ...factor, id: nextId };
  if (nextId.startsWith('sleep_')) {
    return enrichSleepFactor(migrated);
  }
  return migrated;
}

export function migrateMomentumDayResult(result: MomentumDayResult): MomentumDayResult {
  const factors = result.factors.map(migrateMomentumFactor);
  const changed = factors.some((f, i) => f !== result.factors[i]);
  if (!changed) return result;
  return { ...result, factors };
}

export function migrateMomentumHistoryRecord(
  history: Record<string, MomentumDayResult>,
): { history: Record<string, MomentumDayResult>; changed: boolean } {
  let changed = false;
  const next: Record<string, MomentumDayResult> = {};

  for (const [date, day] of Object.entries(history)) {
    const migrated = migrateMomentumDayResult(day);
    next[date] = migrated;
    if (migrated !== day) changed = true;
  }

  return { history: next, changed };
}
