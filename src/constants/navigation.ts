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
  House,
  Lightbulb,
  Map,
  Route,
  Ruler,
  Scroll,
  Settings,
  TrendingUp,
} from 'lucide-react';
import { isGrowthHubPath } from './growthHub';
import type { AppSettings } from '../types';
import type { SidebarVisibilityKey } from '../types/sidebar';
import type { AppThemeId } from '../types/theme';
import { getSidebarVisibilityForTheme } from '../utils/sidebarVisibility';

export type NavItemId =
  | 'home'
  | 'today'
  | 'week'
  | 'journey'
  | 'cozyHome'
  | 'chronicle'
  | 'codex'
  | 'skillMap'
  | 'momentum'
  | 'freedom'
  | 'heroGrowth'
  | 'measurements'
  | 'insights'
  | 'reports'
  | 'settings'
  | 'faq';

export type NavItem = {
  id: NavItemId;
  to: string;
  icon: LucideIcon;
  label: string;
  /** Короткая подпись для мобильной нижней панели */
  shortLabel?: string;
  /** If set, item is shown only for these themes (e.g. Cozy Home) */
  themes?: AppThemeId[];
  /** Advanced / low-frequency screen — opt-in via settings */
  optional?: boolean;
  visibilityKey?: SidebarVisibilityKey;
};

export type NavGroup = {
  id: string;
  title: string;
  hint?: string;
  items: NavItem[];
};

/** Сгруппированная навигация — базовый shell + optional advanced items */
export const navGroups: NavGroup[] = [
  {
    id: 'daily',
    title: 'Каждый день',
    hint: 'Ежедневный цикл',
    items: [
      { id: 'home', to: '/', icon: Home, label: 'Главная', shortLabel: 'Главная' },
      { id: 'today', to: '/today', icon: Calendar, label: 'Сегодня', shortLabel: 'Сегодня' },
      { id: 'week', to: '/week', icon: CalendarDays, label: 'Неделя', shortLabel: 'Неделя' },
    ],
  },
  {
    id: 'adventure',
    title: 'Приключение',
    hint: 'Мир и карта пути',
    items: [
      { id: 'journey', to: '/journey', icon: Route, label: 'Путь', shortLabel: 'Путь' },
      {
        id: 'cozyHome',
        to: '/home',
        icon: House,
        label: 'Дом',
        shortLabel: 'Дом',
        themes: ['cozy'],
      },
      {
        id: 'chronicle',
        to: '/seasons',
        icon: Scroll,
        label: 'Летопись',
        shortLabel: 'Сезоны',
        optional: true,
        visibilityKey: 'chronicle',
      },
      { id: 'codex', to: '/codex', icon: BookOpen, label: 'Кодекс', shortLabel: 'Кодекс' },
      {
        id: 'skillMap',
        to: '/map',
        icon: Map,
        label: 'Карта навыков',
        optional: true,
        visibilityKey: 'skillMap',
      },
    ],
  },
  {
    id: 'state',
    title: 'Состояние',
    hint: 'Как чувствует себя герой',
    items: [
      {
        id: 'momentum',
        to: '/momentum',
        icon: Gauge,
        label: 'Инерция',
        optional: true,
        visibilityKey: 'momentum',
      },
      { id: 'freedom', to: '/freedom', icon: Feather, label: 'Свобода тела' },
    ],
  },
  {
    id: 'growth',
    title: 'Рост героя',
    hint: 'Сила, награды, испытания',
    items: [
      {
        id: 'heroGrowth',
        to: '/growth',
        icon: TrendingUp,
        label: 'Рост героя',
        optional: true,
        visibilityKey: 'heroGrowth',
      },
    ],
  },
  {
    id: 'data',
    title: 'Данные',
    hint: 'Замеры и отчёты',
    items: [
      { id: 'measurements', to: '/measurements', icon: Ruler, label: 'Замеры' },
      { id: 'insights', to: '/insights', icon: Lightbulb, label: 'Аналитика' },
      { id: 'reports', to: '/reports', icon: FileText, label: 'Отчёты' },
    ],
  },
  {
    id: 'system',
    title: 'Система',
    items: [
      { id: 'settings', to: '/settings', icon: Settings, label: 'Настройки' },
      { id: 'faq', to: '/faq', icon: HelpCircle, label: 'Справка' },
    ],
  },
];

export type SidebarNavigationInput = {
  themeId: AppThemeId;
  settings?: Pick<AppSettings, 'sidebarVisibility'> | AppSettings | null;
};

function isThemeAllowed(item: NavItem, themeId: AppThemeId): boolean {
  return !item.themes || item.themes.includes(themeId);
}

function isOptionalAllowed(
  item: NavItem,
  themeId: AppThemeId,
  settings?: SidebarNavigationInput['settings'],
): boolean {
  if (!item.optional || !item.visibilityKey) return true;
  const visibility = getSidebarVisibilityForTheme(settings, themeId);
  return visibility[item.visibilityKey] === true;
}

/** Single resolver for desktop sidebar + mobile drawer. */
export function getSidebarNavigation({
  themeId,
  settings,
}: SidebarNavigationInput): NavGroup[] {
  return navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => isThemeAllowed(item, themeId) && isOptionalAllowed(item, themeId, settings),
      ),
    }))
    .filter((group) => group.items.length > 0);
}

/** @deprecated Prefer getSidebarNavigation({ themeId, settings }) */
export function getNavGroupsForTheme(
  themeId: AppThemeId,
  settings?: SidebarNavigationInput['settings'],
): NavGroup[] {
  return getSidebarNavigation({ themeId, settings });
}

export function isNavItemVisible(item: NavItem, themeId: AppThemeId): boolean {
  return isThemeAllowed(item, themeId);
}

export const allNavItems = navGroups.flatMap((group) => group.items);

/** Нижняя панель на телефоне — самые частые действия (always-core) */
export const mobileTabNav: NavItem[] = [
  allNavItems.find((item) => item.id === 'home')!,
  allNavItems.find((item) => item.id === 'today')!,
  allNavItems.find((item) => item.id === 'week')!,
  allNavItems.find((item) => item.id === 'codex')!,
];

const mobileTabPaths = new Set(mobileTabNav.map((item) => item.to));

/** Группы для выезжающего меню «Ещё» — без пунктов из нижней панели */
export function getMobileDrawerGroups(
  themeId: AppThemeId,
  settings?: SidebarNavigationInput['settings'],
): NavGroup[] {
  return getSidebarNavigation({ themeId, settings })
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !mobileTabPaths.has(item.to)),
    }))
    .filter((group) => group.items.length > 0);
}

export function getMobileDrawerPaths(
  themeId: AppThemeId,
  settings?: SidebarNavigationInput['settings'],
): string[] {
  return getMobileDrawerGroups(themeId, settings).flatMap((group) =>
    group.items.map((item) => item.to),
  );
}

/** @deprecated Prefer getMobileDrawerGroups(themeId, settings) */
export const mobileDrawerGroups: NavGroup[] = navGroups
  .map((group) => ({
    ...group,
    items: group.items.filter((item) => !mobileTabPaths.has(item.to)),
  }))
  .filter((group) => group.items.length > 0);

/** @deprecated Prefer getMobileDrawerPaths(themeId, settings) */
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

export function sidebarContainsPath(groups: NavGroup[], path: string): boolean {
  return groups.some((group) => group.items.some((item) => item.to === path));
}
