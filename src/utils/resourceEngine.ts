import type {
  CognitiveBreakLevel,
  DailyEntry,
  EnergyLevel,
  SleepQuality,
} from '../types';
import { getDayMode } from './stepsEngine';

export type ResourceLevel = 'low' | 'medium' | 'high';

export type DailyResourceResult = {
  score: number;
  level: ResourceLevel;
  reasons: string[];
  suggestion?: string;
};

/** Legacy entries may store sleepQuality as 1–5 */
export type LegacySleepQuality = SleepQuality | 1 | 2 | 3 | 4 | 5;

export function normalizeSleepQuality(
  value: LegacySleepQuality | null | undefined,
): SleepQuality | null {
  if (value === null || value === undefined) return null;
  if (value === 'poor' || value === 'ok' || value === 'good') return value;
  if (value <= 2) return 'poor';
  if (value === 3) return 'ok';
  return 'good';
}

export function hasSleepMarked(entry: DailyEntry): boolean {
  return normalizeSleepQuality(entry.sleepQuality as LegacySleepQuality) !== null;
}

export function hasCognitiveBreak(entry: DailyEntry): boolean {
  const level = entry.cognitiveBreaks;
  return level === 'small' || level === 'good' || level === 'deep';
}

export function hasEnergyMarked(entry: DailyEntry): boolean {
  return entry.energyLevel !== null && entry.energyLevel !== undefined;
}

export function hasRestMarker(entry: DailyEntry): boolean {
  return hasSleepMarked(entry) || hasEnergyMarked(entry) || hasCognitiveBreak(entry);
}

export function isRestRecoveryDay(entry: DailyEntry): boolean {
  const mode = getDayMode(entry.dayMode);
  if (mode === 'recovery' || mode === 'minimal') return true;
  return hasRestMarker(entry);
}

export function countRestMarkerDays(entries: DailyEntry[]): number {
  return entries.filter((e) => hasSleepMarked(e) || hasEnergyMarked(e)).length;
}

export function countRestRecoveryDays(entries: DailyEntry[]): number {
  return entries.filter((e) => isRestRecoveryDay(e)).length;
}

export function countCognitiveBreakDays(entries: DailyEntry[]): number {
  return entries.filter((e) => hasCognitiveBreak(e)).length;
}

function scoreSleep(quality: SleepQuality | null): { points: number; reason?: string } {
  switch (quality) {
    case 'good':
      return { points: 35, reason: 'Хороший сон поддержал ресурс' };
    case 'ok':
      return { points: 20, reason: 'Сон в норме' };
    case 'poor':
      return { points: 5, reason: 'Сон просел — это сигнал, не приговор' };
    default:
      return { points: 0 };
  }
}

function scoreCognitiveBreaks(level: CognitiveBreakLevel | null | undefined): {
  points: number;
  reason?: string;
} {
  switch (level) {
    case 'deep':
      return { points: 35, reason: 'Глубокая разгрузка головы' };
    case 'good':
      return { points: 25, reason: 'Нормальная разгрузка головы' };
    case 'small':
      return { points: 12, reason: 'Короткий перерыв уже считается ходом' };
    case 'none':
      return { points: 0, reason: 'Перерыва не было — можно добавить один короткий' };
    default:
      return { points: 0 };
  }
}

function scoreEnergy(energy: EnergyLevel | null | undefined): { points: number; reason?: string } {
  if (energy === null || energy === undefined) return { points: 0 };
  if (energy >= 4) return { points: 20, reason: 'Энергия высокая' };
  if (energy === 3) return { points: 12, reason: 'Энергия средняя' };
  return { points: 4, reason: 'Ресурс просел — можно удержать минимальный день' };
}

function levelFromScore(score: number): ResourceLevel {
  if (score >= 70) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

function buildSuggestion(level: ResourceLevel, entry: DailyEntry): string | undefined {
  const mode = getDayMode(entry.dayMode);
  if (mode === 'recovery' || mode === 'minimal') {
    if (hasRestMarker(entry)) {
      return 'Маршрут удержан. Восстановление сегодня — уже ход вперёд.';
    }
  }

  if (level === 'low') {
    return 'Ресурс просел. Сегодня можно удержать путь минимальным днём.';
  }
  if (level === 'medium' && !hasCognitiveBreak(entry)) {
    return 'Система перегружена. Один короткий перерыв уже считается ходом вперёд.';
  }
  if (level === 'high') {
    return 'Ресурс восстановлен. Сегодня путь будет держаться легче.';
  }
  return undefined;
}

export function getDailyResource(entry: DailyEntry): DailyResourceResult {
  const sleep = normalizeSleepQuality(entry.sleepQuality as LegacySleepQuality);
  const cognitive = entry.cognitiveBreaks ?? null;

  const sleepScore = scoreSleep(sleep);
  const cognitiveScore = scoreCognitiveBreaks(cognitive);
  const energyScore = scoreEnergy(entry.energyLevel);

  const score = sleepScore.points + cognitiveScore.points + energyScore.points;
  const level = levelFromScore(score);

  const reasons = [sleepScore.reason, cognitiveScore.reason, energyScore.reason].filter(
    Boolean,
  ) as string[];

  return {
    score,
    level,
    reasons,
    suggestion: buildSuggestion(level, entry),
  };
}

/** XP bonus for marking recovery (no coins) */
export function calcResourceRestBonusPoints(entry: DailyEntry): number {
  let bonus = 0;
  const sleep = normalizeSleepQuality(entry.sleepQuality as LegacySleepQuality);

  if (sleep !== null) bonus += 10;
  if (sleep === 'good') bonus += 15;

  switch (entry.cognitiveBreaks) {
    case 'small':
      bonus += 5;
      break;
    case 'good':
      bonus += 15;
      break;
    case 'deep':
      bonus += 25;
      break;
    default:
      break;
  }

  return bonus;
}

/** Momentum bonus factors from rest (additive, gentle) */
export function getResourceMomentumBonus(entry: DailyEntry): number {
  let bonus = 0;
  const sleep = normalizeSleepQuality(entry.sleepQuality as LegacySleepQuality);

  if (sleep === 'good') bonus += 3;
  else if (sleep === 'ok') bonus += 1;
  else if (sleep === 'poor') bonus -= 1;

  switch (entry.cognitiveBreaks) {
    case 'deep':
      bonus += 3;
      break;
    case 'good':
      bonus += 2;
      break;
    default:
      break;
  }

  return bonus;
}

export function shouldSuggestRecoveryFromResource(entry: DailyEntry): boolean {
  return getDailyResource(entry).level === 'low';
}

export function getMaxCognitiveBreakStreak(entries: DailyEntry[]): number {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  let max = 0;
  let current = 0;
  for (const e of sorted) {
    if (hasCognitiveBreak(e)) {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}

export function getMaxRestHighStreak(entries: DailyEntry[]): number {
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  let max = 0;
  let current = 0;
  for (const e of sorted) {
    if (getDailyResource(e).level === 'high') {
      current += 1;
      max = Math.max(max, current);
    } else {
      current = 0;
    }
  }
  return max;
}
