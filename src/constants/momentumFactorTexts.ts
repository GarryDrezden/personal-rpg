import { LEGACY_SLEEP_FACTOR_IDS, MOMENTUM_FACTOR_ID_MIGRATIONS } from './momentumFactorMigrations';
import type { AppThemeId } from '../types/theme';

export type MomentumFactorThemeText = {
  title: string;
  description?: string;
  explanation?: string;
};

export const MOMENTUM_SLEEP_FACTOR_TEXTS: Record<
  string,
  Record<AppThemeId, MomentumFactorThemeText>
> = {
  sleep_good: {
    cozy: {
      title: 'Сон поддержал систему',
      description: 'Сон дал небольшой вклад в инерцию.',
      explanation:
        'Применяется, когда указано не меньше 7 часов сна и качество сна 4 или 5.',
    },
    darkFantasy: {
      title: 'Восстановление укрепило ядро',
      description: 'Сон усилил накопленный ритм пути.',
      explanation:
        'Применяется, когда указано не меньше 7 часов сна и качество сна 4 или 5.',
    },
  },
  sleep_low: {
    cozy: {
      title: 'Сон просел',
      description: 'Низкое восстановление снизило инерцию дня.',
      explanation:
        'Применяется, когда указано меньше 5 часов сна или качество сна 1–2.',
    },
    darkFantasy: {
      title: 'Восстановление ослабло',
      description: 'Низкий сон снизил ход ядра пути.',
      explanation:
        'Применяется, когда указано меньше 5 часов сна или качество сна 1–2.',
    },
  },
  sleep_low_streak: {
    cozy: {
      title: 'Несколько дней низкого восстановления',
      description: 'Несколько дней подряд с низким сном сильнее тормозят систему.',
      explanation:
        'Применяется, когда 3 дня подряд указано меньше 5 часов сна или качество сна 1–2.',
    },
    darkFantasy: {
      title: 'Цепь усталости усилилась',
      description: 'Несколько дней подряд слабого восстановления тормозят путь.',
      explanation:
        'Применяется, когда 3 дня подряд указано меньше 5 часов сна или качество сна 1–2.',
    },
  },
};

export function getSleepFactorThemeText(
  factorId: string,
  themeId: AppThemeId = 'cozy',
): MomentumFactorThemeText | null {
  const normalized = MOMENTUM_FACTOR_ID_MIGRATIONS[factorId] ?? factorId;
  return MOMENTUM_SLEEP_FACTOR_TEXTS[normalized]?.[themeId] ?? null;
}

export function isSleepFactor(factorId: string): boolean {
  const normalized = MOMENTUM_FACTOR_ID_MIGRATIONS[factorId] ?? factorId;
  return normalized.startsWith('sleep_') || LEGACY_SLEEP_FACTOR_IDS.has(factorId);
}
