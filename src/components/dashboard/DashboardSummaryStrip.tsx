import { Link } from 'react-router-dom';
import {
  BookOpen,
  CalendarDays,
  Feather,
  Gauge,
  Route,
  Trophy,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const links: { to: string; label: string; icon: LucideIcon }[] = [
  { to: '/codex', label: 'Кодекс', icon: BookOpen },
  { to: '/journey', label: 'Путь', icon: Route },
  { to: '/momentum', label: 'Инерция', icon: Gauge },
  { to: '/freedom', label: 'Свобода', icon: Feather },
  { to: '/week', label: 'Неделя', icon: CalendarDays },
  { to: '/achievements', label: 'Достижения', icon: Trophy },
];

export function DashboardSummaryStrip() {
  return (
    <nav
      data-testid="dashboard-summary-strip"
      className="flex flex-wrap gap-2"
      aria-label="Быстрые разделы"
    >
      {links.map(({ to, label, icon: Icon }) => (
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
