import type { SkillDefinition, SkillId } from '../types/skills';

export const SKILLS: SkillDefinition[] = [
  {
    id: 'body',
    title: 'Тело',
    description: 'Шаги, зал и зарядка',
    icon: '💪',
    colorClass: 'text-red-600',
    gradientClass: 'from-red-500/20 to-orange-100',
  },
  {
    id: 'control',
    title: 'Контроль',
    description: 'Калории и замеры',
    icon: '🎯',
    colorClass: 'text-blue-600',
    gradientClass: 'from-blue-500/20 to-sky-100',
  },
  {
    id: 'clarity',
    title: 'Ясность',
    description: 'Трезвость и дневник',
    icon: '🧠',
    colorClass: 'text-indigo-600',
    gradientClass: 'from-indigo-500/20 to-violet-100',
  },
  {
    id: 'home',
    title: 'Быт',
    description: 'Готовка и ремонт',
    icon: '🏠',
    colorClass: 'text-amber-700',
    gradientClass: 'from-amber-500/20 to-yellow-100',
  },
  {
    id: 'green',
    title: 'Зелень',
    description: 'Растения и уход',
    icon: '🌱',
    colorClass: 'text-emerald-600',
    gradientClass: 'from-emerald-500/20 to-green-100',
  },
  {
    id: 'joy',
    title: 'Радость',
    description: 'Хобби и отдых',
    icon: '🎨',
    colorClass: 'text-purple-600',
    gradientClass: 'from-purple-500/20 to-fuchsia-100',
  },
];

/** @deprecated use SKILLS */
export const SKILL_DEFINITIONS = SKILLS;

export const SKILL_BY_ID = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
) as Record<SkillId, SkillDefinition>;

/** XP навыков — отдельно от очков приложения */
export const SKILL_XP_AWARDS = {
  stepsGoal: 35,
  gym: 40,
  morningExercise: 20,
  caloriesLogged: 10,
  caloriesOk: 40,
  weightLogged: 15,
  waistLogged: 15,
  mondayMeasurement: 30,
  // fluidOk: 15
  noAlcohol: 35,
  journal: 20,
  cooking: 15,
  repair: 15,
  // cleaning: 10
  plants: 20,
  // garden: 20, hydroponics: 20
  hobby: 20,
  // rest: 10
} as const;

export const SKILL_LEVEL_HOW_TO: { skill: string; actions: string }[] = [
  { skill: 'Тело', actions: 'шаги, зал, зарядка' },
  { skill: 'Контроль', actions: 'калории и замеры' },
  { skill: 'Ясность', actions: 'без алкоголя и дневник' },
  { skill: 'Быт', actions: 'готовка и ремонт' },
  { skill: 'Зелень', actions: 'растения' },
  { skill: 'Радость', actions: 'хобби' },
];
