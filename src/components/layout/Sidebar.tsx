import { Swords } from 'lucide-react';
import { navGroups } from '../../constants/navigation';
import { NavItemLink } from './NavItemLink';

const SIDEBAR_WIDTH = 'md:w-64';

export function Sidebar() {
  const systemGroup = navGroups.find((group) => group.id === 'system');
  const scrollGroups = navGroups.filter((group) => group.id !== 'system');

  return (
    <aside
      className={`hidden md:flex ${SIDEBAR_WIDTH} md:flex-col md:fixed md:inset-y-0 border-r border-[var(--app-border)] bg-[var(--app-card-strong)] backdrop-blur-md`}
    >
      <div className="flex items-center gap-3 border-b border-[var(--app-border)] px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color-mix(in_srgb,var(--app-primary)_18%,var(--app-bg-soft))] text-[var(--app-primary)]">
          <Swords size={22} strokeWidth={2.25} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold leading-tight text-[var(--app-text)]">
            Личная RPG
          </p>
          <p className="truncate text-xs text-[var(--app-text-muted)]">Твой путь героя</p>
        </div>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3 py-4">
        {scrollGroups.map((group, index) => (
          <section
            key={group.id}
            className={index > 0 ? 'mt-5 border-t border-[var(--app-border)] pt-4' : ''}
          >
            <div className="mb-2 px-2.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--app-primary)]">
                {group.title}
              </p>
              {group.hint ? (
                <p className="mt-0.5 text-[11px] leading-snug text-[var(--app-text-muted)]">
                  {group.hint}
                </p>
              ) : null}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavItemLink key={item.to} {...item} />
              ))}
            </div>
          </section>
        ))}
      </nav>

      {systemGroup ? (
        <div className="shrink-0 border-t border-[var(--app-border)] px-3 py-3">
          <div className="flex flex-col gap-0.5">
            {systemGroup.items.map((item) => (
              <NavItemLink key={item.to} {...item} />
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export { SIDEBAR_WIDTH };
