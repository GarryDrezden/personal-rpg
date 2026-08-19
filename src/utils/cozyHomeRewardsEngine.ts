import type { AppSettings, DailyEntry } from '../types';
import type { CozyResourceId } from '../types/cozyHome';
import { getPhysicalActivityLevel } from './movementCreditEngine';
import { getNutritionQuestCompleted } from './nutritionEngine';
import { normalizeSleepQuality } from './resourceEngine';
import { getDayMode, isStepsMinimumDone, isStepsNormalDone } from './stepsEngine';
import { hasJournalEntry } from './journalEntry';

export function getCozyRewardsForEntry(
  entry: DailyEntry,
  settings: AppSettings,
): {
  resources: Partial<Record<CozyResourceId, number>>;
  reasons: string[];
} {
  const resources: Partial<Record<CozyResourceId, number>> = {};
  const reasons: string[] = [];

  const add = (id: CozyResourceId, amount: number, reason: string) => {
    if (amount <= 0) return;
    resources[id] = (resources[id] ?? 0) + amount;
    reasons.push(reason);
  };

  const mode = getDayMode(entry.dayMode);

  // Freedom treats disabled nutrition as "not a gap". Cozy rewards require a real log.
  if (getNutritionQuestCompleted({ entry, settings })) {
    add('comfort', 1, 'Питание отмечено — в доме стало чуть больше порядка.');
  }

  if (isStepsMinimumDone(entry.steps, settings, entry.date)) {
    add('materials', 1, 'Шаги дали материалы для ремонта.');
    add('garden', 1, 'Движение поддержало двор и сад.');
  }
  if (isStepsNormalDone(entry.steps, settings, entry.date)) {
    add('materials', 1, 'Норма шагов — дополнительные материалы.');
    add('garden', 1, 'Норма шагов — сад продвинулся.');
  }

  const pa = getPhysicalActivityLevel(entry);
  if (pa === 'light') {
    add('materials', 1, 'Физическая активность принесла материалы для ремонта.');
  } else if (pa === 'medium') {
    add('materials', 2, 'Физическая активность принесла материалы для ремонта.');
  } else if (pa === 'heavy') {
    add('materials', 3, 'Физическая активность принесла материалы для ремонта.');
  }
  if (
    (pa === 'light' || pa === 'medium' || pa === 'heavy') &&
    entry.physicalActivityDuration === '6h_plus'
  ) {
    add('materials', 1, 'Долгая нагрузка добавила материалов.');
  }

  if (entry.gym || entry.morningExercise) {
    add('materials', 1, 'Зал или зарядка дали материалы.');
  }

  const sleep = normalizeSleepQuality(
    entry.sleepQuality as Parameters<typeof normalizeSleepQuality>[0],
  );
  if (sleep === 'ok') {
    add('comfort', 1, 'Сон восстановил уют.');
  } else if (sleep === 'good') {
    add('comfort', 2, 'Сон восстановил уют.');
  }

  const cognitive = entry.cognitiveBreaks;
  if (cognitive === 'small') {
    add('clarity', 1, 'Короткий перерыв добавил ясности.');
  } else if (cognitive === 'good') {
    add('clarity', 2, 'Разгрузка головы добавила ясности.');
  } else if (cognitive === 'deep') {
    add('clarity', 3, 'Глубокая разгрузка добавила ясности.');
  }

  if (entry.alcohol === 'none') {
    add('clarity', 2, 'День без алкоголя добавил ясности.');
    add('garden', 1, 'Ясный день поддержал сад.');
  }

  if (hasJournalEntry(entry)) {
    add('clarity', 1, 'Дневник добавил ясности.');
    add('comfort', 1, 'Дневник поддержал уют.');
  }

  if (mode === 'minimal') {
    add('comfort', 1, 'Минимальный день тоже поддержал дом.');
  }
  if (mode === 'recovery') {
    add('comfort', 2, 'День восстановления согрел дом.');
    add('garden', 1, 'Восстановление поддержало сад.');
  }

  if (
    entry.energyLevel != null &&
    entry.energyLevel >= 3 &&
    !reasons.some((r) => r.includes('Сон'))
  ) {
    add('comfort', 1, 'Ресурс дня поддержал уют дома.');
  }

  return { resources, reasons };
}

export function getCozyRewardSummaryLine(granted: {
  resources: Partial<Record<CozyResourceId, number>>;
  reasons?: string[];
} | null): string | null {
  if (!granted?.reasons?.length) return null;
  return granted.reasons[0] ?? null;
}

export function sumCozyGrantedResources(
  resources: Partial<Record<CozyResourceId, number>> | undefined,
): number {
  if (!resources) return 0;
  let total = 0;
  for (const n of Object.values(resources)) {
    total += n ?? 0;
  }
  return total;
}

/** Prefer short human reasons already produced by the engine; cap for UI. */
export function pickCozyRewardReasons(
  reasons: string[] | undefined,
  limit = 3,
): string[] {
  if (!reasons?.length) return [];
  const unique: string[] = [];
  for (const reason of reasons) {
    const trimmed = reason.trim();
    if (!trimmed) continue;
    if (unique.includes(trimmed)) continue;
    unique.push(trimmed);
    if (unique.length >= limit) break;
  }
  return unique;
}

export function listGrantedCozyResources(
  resources: Partial<Record<CozyResourceId, number>> | undefined,
): { id: CozyResourceId; amount: number }[] {
  if (!resources) return [];
  const order: CozyResourceId[] = ['comfort', 'materials', 'garden', 'clarity'];
  return order
    .filter((id) => (resources[id] ?? 0) > 0)
    .map((id) => ({ id, amount: resources[id] ?? 0 }));
}
