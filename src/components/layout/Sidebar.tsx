import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Swords } from 'lucide-react';
import {
  isNavPathActive,
  primaryNav,
  secondaryNav,
  secondaryNavPaths,
} from '../../constants/navigation';

function NavItemLink({
  to,
  icon: Icon,
  label,
}: {
  to: string;
  icon: typeof Swords;
  label: string;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
          isActive
            ? 'nav-link-active'
            : 'text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--app-text)]'
        }`
      }
    >
      <Icon size={17} strokeWidth={2} className="shrink-0" />
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export function Sidebar() {
  const location = useLocation();
  const secondaryActive = secondaryNavPaths.some((path) =>
    isNavPathActive(location.pathname, path),
  );
  const [moreOpen, setMoreOpen] = useState(secondaryActive);

  return (
    <aside className="hidden md:flex md:w-56 md:flex-col md:fixed md:inset-y-0 border-r border-[var(--app-border)] bg-[var(--app-card-strong)] backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-[var(--app-border)] px-4 py-3">
        <Swords className="shrink-0 text-[var(--app-primary)]" size={22} />
        <span className="text-base font-bold text-[var(--app-text)]">Личная RPG</span>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-3">
        <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
          Основное
        </p>
        {primaryNav.map((item) => (
          <NavItemLink key={item.to} {...item} />
        ))}

        <div className="mt-2 border-t border-[var(--app-border)] pt-2">
          <button
            type="button"
            onClick={() => setMoreOpen((value) => !value)}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] font-medium transition-colors ${
              secondaryActive
                ? 'text-[var(--app-primary)]'
                : 'text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--app-text)]'
            }`}
            aria-expanded={moreOpen}
          >
            <span>Ещё</span>
            <ChevronDown
              size={16}
              className={`shrink-0 transition-transform ${moreOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {moreOpen && (
            <div className="mt-0.5 flex flex-col gap-0.5 pb-1">
              {secondaryNav.map((item) => (
                <NavItemLink key={item.to} {...item} />
              ))}
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}
