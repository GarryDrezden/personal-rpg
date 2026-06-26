import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Calendar,
  CalendarDays,
  Map,
  MoreHorizontal,
  Gauge,
  Feather,
  Settings,
  HelpCircle,
  BookOpen,
  X,
} from 'lucide-react';

const mainLinks = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/today', icon: Calendar, label: 'Сегодня' },
  { to: '/week', icon: CalendarDays, label: 'Неделя' },
  { to: '/journey', icon: Map, label: 'Путь' },
];

const moreLinks = [
  { to: '/codex', icon: BookOpen, label: 'Кодекс' },
  { to: '/momentum', icon: Gauge, label: 'Инерция' },
  { to: '/freedom', icon: Feather, label: 'Свобода' },
  { to: '/faq', icon: HelpCircle, label: 'FAQ' },
  { to: '/settings', icon: Settings, label: 'Настройки' },
];

const morePaths = moreLinks.map((l) => l.to);

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreActive = morePaths.some(
    (p) => location.pathname === p || location.pathname.startsWith(`${p}/`),
  );

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {moreOpen && (
        <div className="fixed bottom-[calc(3.5rem+env(safe-area-inset-bottom))] left-2 right-2 z-50 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-strong)] p-2 shadow-xl md:hidden">
          <div className="mb-2 flex items-center justify-between px-2 pt-1">
            <p className="text-sm font-semibold text-[var(--app-text)]">Ещё</p>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="rounded-lg p-1 text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]"
              aria-label="Закрыть"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-1">
            {moreLinks.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[color-mix(in_srgb,var(--app-primary)_12%,var(--app-card))] text-[var(--app-primary)]'
                      : 'text-[var(--app-text)] hover:bg-[var(--app-bg-soft)]'
                  }`
                }
              >
                <Icon size={20} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--app-border)] bg-[var(--app-card-strong)] backdrop-blur-md md:hidden">
        <div className="flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {mainLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex min-w-0 flex-col items-center gap-0.5 px-1 py-1 text-[10px] ${
                  isActive
                    ? 'font-semibold text-[var(--app-primary)]'
                    : 'text-[var(--app-text-muted)]'
                }`
              }
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className={`flex min-w-0 flex-col items-center gap-0.5 px-1 py-1 text-[10px] ${
              moreActive || moreOpen
                ? 'font-semibold text-[var(--app-primary)]'
                : 'text-[var(--app-text-muted)]'
            }`}
          >
            <MoreHorizontal size={20} />
            <span>Ещё</span>
          </button>
        </div>
      </nav>
    </>
  );
}
