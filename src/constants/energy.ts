import type { DayMode, EnergyLevel } from '../types';

export const ENERGY_LEVELS: {
  value: EnergyLevel;
  label: string;
  emoji: string;
  chipClass: string;
}[] = [
  {
    value: 5,
    label: 'Полный ресурс',
    emoji: '🟢',
    chipClass:
      'border-emerald-400/60 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200',
  },
  {
    value: 4,
    label: 'Нормально',
    emoji: '🟢',
    chipClass:
      'border-emerald-300/50 bg-emerald-400/10 text-emerald-700 dark:text-emerald-200',
  },
  {
    value: 3,
    label: 'Устал',
    emoji: '🟡',
    chipClass:
      'border-amber-400/60 bg-amber-400/15 text-amber-900 dark:text-amber-100',
  },
  {
    value: 2,
    label: 'Низкий ресурс',
    emoji: '🟠',
    chipClass:
      'border-orange-400/60 bg-orange-400/15 text-orange-900 dark:text-orange-100',
  },
  {
    value: 1,
    label: 'Восстановление',
    emoji: '🔴',
    chipClass:
      'border-rose-400/60 bg-rose-500/15 text-rose-900 dark:text-rose-100',
  },
];

export const DAY_MODES: {
  value: DayMode;
  label: string;
  description: string;
}[] = [
  {
    value: 'normal',
    label: 'Обычный',
    description:
      'Полные цели дня: калории, шаги, привычки и бонусные дела.',
  },
  {
    value: 'recovery',
    label: 'Восстановление',
    description:
      'Сниженная нагрузка. Калории и алкоголь остаются базой, шаги считаются по облегчённому порогу.',
  },
  {
    value: 'minimal',
    label: 'Минимальный',
    description:
      'День удержания: внести калории, 5000 шагов, без алкоголя и короткий дневник/комментарий.',
  },
];

export function getEnergyRecommendation(
  energyLevel: EnergyLevel | null | undefined,
  dayMode: DayMode | undefined,
): string {
  const mode = dayMode ?? 'normal';
  if (mode === 'recovery') {
    return '🔴 Режим восстановления — важнее удержать базу, чем давить максимум.';
  }
  if (mode === 'minimal') {
    return '🟠 Минимальный день — калории, 5000 шагов, без алкоголя, короткая заметка.';
  }
  switch (energyLevel) {
    case 5:
    case 4:
      return '🟢 Ресурс нормальный — можно идти по обычному плану.';
    case 3:
      return '🟡 Средний ресурс — держим базу, без перегруза.';
    case 2:
      return '🟠 Низкий ресурс — держим базу: калории, без алкоголя, минимум шагов.';
    case 1:
      return '🔴 Восстановление — сегодня важнее удержать режим, чем давить максимум.';
    default:
      return 'Отметь ресурс дня — это поможет подобрать темп.';
  }
}

export function shouldSuggestRecoveryMode(energyLevel: EnergyLevel | null | undefined): boolean {
  return energyLevel === 1 || energyLevel === 2;
}

export function getEnergyLabel(energyLevel: EnergyLevel | null | undefined): string {
  if (!energyLevel) return 'Не отмечен';
  const found = ENERGY_LEVELS.find((e) => e.value === energyLevel);
  return found ? `${found.emoji} ${found.label}` : 'Не отмечен';
}

export function getDayModeLabel(dayMode: DayMode | undefined): string {
  const found = DAY_MODES.find((m) => m.value === (dayMode ?? 'normal'));
  return found?.label ?? 'Обычный';
}
