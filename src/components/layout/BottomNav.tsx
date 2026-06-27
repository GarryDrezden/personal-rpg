import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, X } from 'lucide-react';
import {
  isNavPathActive,
  mobileDrawerGroups,
  mobileDrawerPaths,
  mobileTabNav,
} from '../../constants/navigation';
import { NavItemLink } from './NavItemLink';

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreActive = mobileDrawerPaths.some((path) => isNavPathActive(location.pathname, path));

  return (
    <>
      {moreOpen ? (
        <button
          type="button"
          aria-label="Закрыть меню"
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          onClick={() => setMoreOpen(false)}
        />
      ) : null}

      {moreOpen ? (
        <div className="fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom))] left-3 right-3 z-50 max-h-[min(72vh,32rem)] overflow-y-auto rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-strong)] p-3 shadow-2xl md:hidden">
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-base font-bold text-[var(--app-text)]">Разделы</p>
              <p className="text-xs text-[var(--app-text-muted)]">Путь, прогресс, данные</p>
            </div>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              className="rounded-xl p-2 text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
          </div>

          {mobileDrawerGroups.map((group, index) => (
            <section key={group.id} className={index > 0 ? 'mt-4 border-t border-[var(--app-border)] pt-4' : ''}>
              <p className="mb-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-[var(--app-primary)]">
                {group.title}
              </p>
              <div className="grid gap-0.5">
                {group.items.map((item) => (
                  <NavItemLink
                    key={item.to}
                    {...item}
                    size="drawer"
                    onClick={() => setMoreOpen(false)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--app-border)] bg-[var(--app-card-strong)] backdrop-blur-md md:hidden">
        <div className="flex justify-around px-1 pt-1.5 pb-[max(0.625rem,env(safe-area-inset-bottom))]">
          {mobileTabNav.map(({ to, icon: Icon, label, shortLabel }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex min-w-[3.25rem] flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors ${
                  isActive
                    ? 'bg-[color-mix(in_srgb,var(--app-primary)_14%,transparent)] text-[var(--app-primary)]'
                    : 'text-[var(--app-text-muted)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      isActive
                        ? 'bg-[color-mix(in_srgb,var(--app-primary)_22%,transparent)]'
                        : 'bg-[var(--app-bg-soft)]'
                    }`}
                  >
                    <Icon size={21} strokeWidth={isActive ? 2.25 : 2} />
                  </span>
                  <span className={`text-[11px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {shortLabel ?? label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setMoreOpen((value) => !value)}
            className={`flex min-w-[3.25rem] flex-1 flex-col items-center gap-1 rounded-xl px-1 py-2 transition-colors ${
              moreActive || moreOpen
                ? 'bg-[color-mix(in_srgb,var(--app-primary)_14%,transparent)] text-[var(--app-primary)]'
                : 'text-[var(--app-text-muted)]'
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                moreActive || moreOpen
                  ? 'bg-[color-mix(in_srgb,var(--app-primary)_22%,transparent)]'
                  : 'bg-[var(--app-bg-soft)]'
              }`}
            >
              <LayoutGrid size={21} strokeWidth={moreActive || moreOpen ? 2.25 : 2} />
            </span>
            <span
              className={`text-[11px] leading-none ${moreActive || moreOpen ? 'font-bold' : 'font-medium'}`}
            >
              Ещё
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
