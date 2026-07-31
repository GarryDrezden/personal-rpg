import type {
  PhysicalActivityDuration,
  PhysicalActivityLevel,
} from '../types/physicalActivity';

export const PHYSICAL_ACTIVITY_LEVEL_OPTIONS: {
  value: PhysicalActivityLevel;
  label: string;
  hint: string;
}[] = [
  {
    value: 'none',
    label: 'Не было',
    hint: 'Дополнительной физической нагрузки не было',
  },
  {
    value: 'light',
    label: 'Лёгкая',
    hint: 'Лёгкая уборка, недолгая работа по дому, короткая активность',
  },
  {
    value: 'medium',
    label: 'Средняя',
    hint: 'Косил, собирал руками, 1–4 часа активной работы',
  },
  {
    value: 'heavy',
    label: 'Тяжёлая',
    hint: '5–6+ часов, сварка, таскал материалы, сильная усталость тела',
  },
];

export const PHYSICAL_ACTIVITY_DURATION_OPTIONS: {
  value: PhysicalActivityDuration;
  label: string;
}[] = [
  { value: 'under_1h', label: 'до 1 часа' },
  { value: '1_3h', label: '1–3 часа' },
  { value: '3_6h', label: '3–6 часов' },
  { value: '6h_plus', label: '6+ часов' },
];

export const PHYSICAL_ACTIVITY_NOTE_PLACEHOLDER =
  'Например: сваривал конструкцию, косил участок, собирал вольер';

export const PHYSICAL_ACTIVITY_MOMENTUM: Record<
  Exclude<PhysicalActivityLevel, 'none'>,
  number
> = {
  light: 1,
  medium: 2,
  heavy: 3,
};

/** Soft body XP — not a calorie calculator */
export const PHYSICAL_ACTIVITY_XP = {
  light: 10,
  medium: 25,
  heavy: 45,
  duration6hPlus: 12,
} as const;

export function getPhysicalActivityLevelLabel(
  level: PhysicalActivityLevel | null | undefined,
): string {
  if (!level) return 'Не отмечена';
  return (
    PHYSICAL_ACTIVITY_LEVEL_OPTIONS.find((o) => o.value === level)?.label ?? 'Не отмечена'
  );
}

export function getPhysicalActivityDurationLabel(
  duration: PhysicalActivityDuration | null | undefined,
): string {
  if (!duration) return '';
  return PHYSICAL_ACTIVITY_DURATION_OPTIONS.find((o) => o.value === duration)?.label ?? '';
}
