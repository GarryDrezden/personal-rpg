import type { CognitiveBreakLevel, SleepQuality } from '../types';

export const SLEEP_QUALITY_OPTIONS: { value: SleepQuality; label: string }[] = [
  { value: 'poor', label: 'Плохо' },
  { value: 'ok', label: 'Нормально' },
  { value: 'good', label: 'Хорошо' },
];

export const COGNITIVE_BREAK_OPTIONS: { value: CognitiveBreakLevel; label: string }[] = [
  { value: 'none', label: 'Не было' },
  { value: 'small', label: 'Немного' },
  { value: 'good', label: 'Нормально' },
  { value: 'deep', label: 'Глубоко' },
];

export const RESOURCE_LEVEL_LABELS = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
} as const;

export const REST_DAY_COPY = {
  title: 'Восстановление',
  lead: 'Ресурс тоже часть пути. Иногда лучший ход — восстановиться.',
  hint: 'Перерывы защищают маршрут от обвала.',
} as const;

export function getSleepQualityLabel(value: SleepQuality | null | undefined): string {
  if (!value) return 'Не отмечен';
  return SLEEP_QUALITY_OPTIONS.find((o) => o.value === value)?.label ?? 'Не отмечен';
}

export function getCognitiveBreakLabel(value: CognitiveBreakLevel | null | undefined): string {
  if (!value || value === 'none') return 'Не было';
  return COGNITIVE_BREAK_OPTIONS.find((o) => o.value === value)?.label ?? 'Не было';
}
