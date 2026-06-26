import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calendar,
  CalendarDays,
  Dna,
  Feather,
  FileText,
  Gauge,
  Gift,
  HelpCircle,
  Home,
  Lightbulb,
  Map,
  Route,
  Ruler,
  Settings,
  Sparkles,
  Swords,
  Trophy,
} from 'lucide-react';

export type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
};

/** First-level navigation — always visible */
export const primaryNav: NavItem[] = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/today', icon: Calendar, label: 'Сегодня' },
  { to: '/week', icon: CalendarDays, label: 'Неделя' },
  { to: '/journey', icon: Route, label: 'Путь' },
  { to: '/momentum', icon: Gauge, label: 'Инерция' },
  { to: '/freedom', icon: Feather, label: 'Свобода' },
  { to: '/codex', icon: BookOpen, label: 'Кодекс' },
  { to: '/settings', icon: Settings, label: 'Настройки' },
];

/** Collapsed under “Ещё” on desktop / mobile drawer */
export const secondaryNav: NavItem[] = [
  { to: '/bosses', icon: Swords, label: 'Боссы' },
  { to: '/reports', icon: FileText, label: 'Отчёты' },
  { to: '/measurements', icon: Ruler, label: 'Замеры' },
  { to: '/skills', icon: Sparkles, label: 'Навыки' },
  { to: '/abilities', icon: Dna, label: 'Способности' },
  { to: '/map', icon: Map, label: 'Карта' },
  { to: '/insights', icon: Lightbulb, label: 'Аналитика' },
  { to: '/rewards', icon: Gift, label: 'Награды' },
  { to: '/achievements', icon: Trophy, label: 'Достижения' },
  { to: '/faq', icon: HelpCircle, label: 'FAQ' },
];

export const secondaryNavPaths = secondaryNav.map((item) => item.to);

export function isNavPathActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}
