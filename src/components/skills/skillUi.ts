import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  Brain,
  Home,
  Palette,
  Sprout,
  Target,
} from 'lucide-react';
import type { SkillId } from '../../types/skills';

export type SkillRoadUi = {
  subtitle: string;
  description: string;
  Icon: LucideIcon;
  accentBorder: string;
  accentGlow: string;
  accentIcon: string;
  accentBar: string;
  radialOverlay: string;
};

export const SKILL_ROAD_UI: Record<SkillId, SkillRoadUi> = {
  body: {
    subtitle: 'Дорога движения',
    description: 'Шаги, зал и зарядка.',
    Icon: Activity,
    accentBorder: 'border-red-400/20',
    accentGlow: 'shadow-[0_0_24px_rgba(239,68,68,0.1)]',
    accentIcon: 'text-red-300/75 drop-shadow-[0_0_10px_rgba(239,68,68,0.25)]',
    accentBar: 'bg-gradient-to-r from-red-500/45 to-[var(--app-gold)]/35',
    radialOverlay: 'bg-[radial-gradient(ellipse_at_0%_0%,rgba(127,29,29,0.18),transparent_55%)]',
  },
  control: {
    subtitle: 'Дорога режима',
    description: 'Калории, замеры и удержание курса.',
    Icon: Target,
    accentBorder: 'border-blue-400/20',
    accentGlow: 'shadow-[0_0_24px_rgba(59,130,246,0.1)]',
    accentIcon: 'text-blue-300/75 drop-shadow-[0_0_10px_rgba(59,130,246,0.25)]',
    accentBar: 'bg-gradient-to-r from-blue-500/45 to-[var(--app-gold)]/35',
    radialOverlay: 'bg-[radial-gradient(ellipse_at_0%_0%,rgba(30,58,138,0.18),transparent_55%)]',
  },
  clarity: {
    subtitle: 'Дорога ясной головы',
    description: 'Без алкоголя, дневник и внимание к состоянию.',
    Icon: Brain,
    accentBorder: 'border-indigo-400/20',
    accentGlow: 'shadow-[0_0_24px_rgba(129,140,248,0.1)]',
    accentIcon: 'text-indigo-300/75 drop-shadow-[0_0_10px_rgba(129,140,248,0.25)]',
    accentBar: 'bg-gradient-to-r from-indigo-500/45 to-[var(--app-gold)]/35',
    radialOverlay: 'bg-[radial-gradient(ellipse_at_0%_0%,rgba(49,46,129,0.18),transparent_55%)]',
  },
  home: {
    subtitle: 'Дорога опоры',
    description: 'Готовка, порядок и дела, которые держат базу.',
    Icon: Home,
    accentBorder: 'border-amber-400/20',
    accentGlow: 'shadow-[0_0_24px_rgba(245,158,11,0.1)]',
    accentIcon: 'text-amber-300/75 drop-shadow-[0_0_10px_rgba(245,158,11,0.25)]',
    accentBar: 'bg-gradient-to-r from-amber-500/45 to-[var(--app-gold)]/35',
    radialOverlay: 'bg-[radial-gradient(ellipse_at_0%_0%,rgba(120,53,15,0.15),transparent_55%)]',
  },
  green: {
    subtitle: 'Дорога заботы',
    description: 'Растения, уход и спокойные ритуалы.',
    Icon: Sprout,
    accentBorder: 'border-emerald-400/20',
    accentGlow: 'shadow-[0_0_24px_rgba(52,211,153,0.1)]',
    accentIcon: 'text-emerald-300/75 drop-shadow-[0_0_10px_rgba(52,211,153,0.25)]',
    accentBar: 'bg-gradient-to-r from-emerald-500/45 to-[var(--app-gold)]/35',
    radialOverlay: 'bg-[radial-gradient(ellipse_at_0%_0%,rgba(6,78,59,0.18),transparent_55%)]',
  },
  joy: {
    subtitle: 'Дорога жизни',
    description: 'Хобби, отдых и то, ради чего маршрут продолжается.',
    Icon: Palette,
    accentBorder: 'border-violet-400/20',
    accentGlow: 'shadow-[0_0_24px_rgba(167,139,250,0.1)]',
    accentIcon: 'text-violet-300/75 drop-shadow-[0_0_10px_rgba(167,139,250,0.25)]',
    accentBar: 'bg-gradient-to-r from-violet-500/45 to-[var(--app-gold)]/35',
    radialOverlay: 'bg-[radial-gradient(ellipse_at_0%_0%,rgba(76,29,149,0.18),transparent_55%)]',
  },
};

export const SKILL_XP_CODEX_ROWS: { skill: string; actions: string }[] = [
  { skill: 'Тело', actions: 'шаги, зал, зарядка' },
  { skill: 'Контроль', actions: 'калории и замеры' },
  { skill: 'Ясность', actions: 'без алкоголя и дневник' },
  { skill: 'Быт', actions: 'готовка и домашние дела' },
  { skill: 'Зелень', actions: 'растения и уход' },
  { skill: 'Радость', actions: 'хобби и отдых' },
];

export function getSkillRoadUi(skillId: SkillId): SkillRoadUi {
  return SKILL_ROAD_UI[skillId];
}
