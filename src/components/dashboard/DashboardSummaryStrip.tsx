import { Link } from 'react-router-dom';
import { BookOpen, Gauge, Route, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getThemeTerm } from '../../constants/themeTerms';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAppStore } from '../../store/appStore';
import { isSidebarOptionalVisible } from '../../utils/sidebarVisibility';
import type { SidebarVisibilityKey } from '../../types/sidebar';

type StripLink = {
  to: string;
  label: string;
  icon: LucideIcon;
  /** When set, link only renders if this optional section is enabled. */
  visibilityKey?: SidebarVisibilityKey;
};

export function DashboardSummaryStrip() {
  const { themeId, isCozy } = useAppTheme();
  const settings = useAppStore((s) => s.settings);

  const links: StripLink[] = [
    {
      to: '/growth/camp',
      label: isCozy ? 'Укрытие' : 'Лагерь',
      icon: TrendingUp,
    },
    { to: '/journey', label: 'Путь', icon: Route },
    { to: '/momentum', label: 'Инерция', icon: Gauge, visibilityKey: 'momentum' },
    { to: '/codex', label: getThemeTerm(themeId, 'codex'), icon: BookOpen },
  ];

  const visible = links.filter(
    (link) =>
      !link.visibilityKey ||
      isSidebarOptionalVisible(settings, themeId, link.visibilityKey),
  );

  if (visible.length === 0) return null;

  return (
    <nav
      data-testid="dashboard-summary-strip"
      className="flex flex-wrap gap-2"
      aria-label="Быстрые разделы"
    >
      {visible.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          className="inline-flex items-center gap-1.5 rounded-full border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--app-primary)] transition hover:border-[var(--app-primary)]/40 hover:bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-bg-soft))]"
        >
          <Icon size={14} strokeWidth={2} />
          {label}
        </Link>
      ))}
    </nav>
  );
}
