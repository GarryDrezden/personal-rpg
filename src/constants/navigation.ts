import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calendar,
  CalendarDays,
  Feather,
  FileText,
  Gauge,
  HelpCircle,
  Home,
  Lightbulb,
  Map,
  Route,
  Ruler,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { isGrowthHubPath } from './growthHub';

export type NavItem = {
  to: string;
  icon: LucideIcon;
  label: string;
  /** Короткая подпись для мобильной нижней панели */
  shortLabel?: string;
};

export type NavGroup = {
  id: string;
  title: string;
  hint?: string;
  items: NavItem[];
};

/** Сгруппированная навигация — меньше шума, понятные «главы» приложения */
export const navGroups: NavGroup[] = [
  {
    id: 'daily',
    title: 'Каждый день',
    hint: 'Ежедневный цикл',
    items: [
      { to: '/', icon: Home, label: 'Главная', shortLabel: 'Главная' },
      { to: '/today', icon: Calendar, label: 'Сегодня', shortLabel: 'Сегодня' },
      { to: '/week', icon: CalendarDays, label: 'Неделя', shortLabel: 'Неделя' },
    ],
  },
  {
    id: 'adventure',
    title: 'Приключение',
    hint: 'Мир и карта пути',
    items: [
      { to: '/journey', icon: Route, label: 'Путь', shortLabel: 'Путь' },
      { to: '/codex', icon: BookOpen, label: 'Кодекс', shortLabel: 'Кодекс' },
      { to: '/map', icon: Map, label: 'Карта навыков' },
    ],
  },
  {
    id: 'state',
    title: 'Состояние',
    hint: 'Как чувствует себя герой',
    items: [
      { to: '/momentum', icon: Gauge, label: 'Инерция' },
      { to: '/freedom', icon: Feather, label: 'Свобода тела' },
    ],
  },
  {
    id: 'growth',
    title: 'Рост героя',
    hint: 'Сила, награды, испытания',
    items: [{ to: '/growth', icon: TrendingUp, label: 'Рост героя' }],
  },
  {
    id: 'data',
    title: 'Данные',
    hint: 'Замеры и отчёты',
    items: [
      { to: '/measurements', icon: Ruler, label: 'Замеры' },
      { to: '/insights', icon: Lightbulb, label: 'Аналитика' },
      { to: '/reports', icon: FileText, label: 'Отчёты' },
    ],
  },
  {
    id: 'system',
    title: 'Система',
    items: [
      { to: '/settings', icon: Settings, label: 'Настройки' },
      { to: '/faq', icon: HelpCircle, label: 'Справка' },
    ],
  },
];

export const allNavItems = navGroups.flatMap((group) => group.items);

/** Нижняя панель на телефоне — самые частые действия */
export const mobileTabNav: NavItem[] = [
  allNavItems.find((item) => item.to === '/')!,
  allNavItems.find((item) => item.to === '/today')!,
  allNavItems.find((item) => item.to === '/week')!,
  allNavItems.find((item) => item.to === '/codex')!,
];

const mobileTabPaths = new Set(mobileTabNav.map((item) => item.to));

/** Группы для выезжающего меню «Ещё» — без пунктов из нижней панели */
export const mobileDrawerGroups: NavGroup[] = navGroups
  .map((group) => ({
    ...group,
    items: group.items.filter((item) => !mobileTabPaths.has(item.to)),
  }))
  .filter((group) => group.items.length > 0);

export const mobileDrawerPaths = mobileDrawerGroups.flatMap((group) =>
  group.items.map((item) => item.to),
);

export const allNavPaths = allNavItems.map((item) => item.to);

/** @deprecated используй navGroups */
export const primaryNav = navGroups
  .filter((group) => group.id !== 'growth' && group.id !== 'data' && group.id !== 'system')
  .flatMap((group) => group.items);

/** @deprecated используй navGroups */
export const secondaryNav = navGroups
  .filter((group) => group.id === 'growth' || group.id === 'data' || group.id === 'system')
  .flatMap((group) => group.items);

export const secondaryNavPaths = secondaryNav.map((item) => item.to);

export function isNavPathActive(pathname: string, to: string): boolean {
  if (to === '/') return pathname === '/';
  if (to === '/growth') return isGrowthHubPath(pathname);
  return pathname === to || pathname.startsWith(`${to}/`);
}
