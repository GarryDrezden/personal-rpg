import { navGroups } from '../../constants/navigation';
import { NavItemLink } from './NavItemLink';

const SIDEBAR_WIDTH = 'md:w-[356px]';
const SIDEBAR_MARGIN = 'md:ml-[356px]';

export function Sidebar() {
  const systemGroup = navGroups.find((group) => group.id === 'system');
  const scrollGroups = navGroups.filter((group) => group.id !== 'system');

  return (
    <aside
      className={`hidden md:flex ${SIDEBAR_WIDTH} md:flex-col md:fixed md:inset-y-0 border-r border-[var(--app-border)] bg-[var(--app-card-strong)] backdrop-blur-md`}
    >
      <div className="flex shrink-0 flex-col items-center border-b border-[var(--app-border)] px-4 py-4 text-center">
        <img
          src="/logo.png"
          alt=""
          width={120}
          height={120}
          className="h-[120px] w-[120px] object-contain"
          draggable={false}
        />
        <p className="mt-2 text-sm font-bold leading-tight text-[var(--app-text)]">Личная RPG</p>
        <p className="mt-0.5 text-[11px] text-[var(--app-text-muted)]">Твой путь героя</p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2.5 py-2">
        {scrollGroups.map((group, index) => (
          <section
            key={group.id}
            className={index > 0 ? 'mt-2 border-t border-[var(--app-border)] pt-2' : ''}
          >
            <p className="mb-0.5 px-2 text-[10px] font-bold uppercase tracking-wider text-[var(--app-primary)]">
              {group.title}
            </p>
            <div className="flex flex-col">
              {group.items.map((item) => (
                <NavItemLink key={item.to} {...item} />
              ))}
            </div>
          </section>
        ))}
      </nav>

      {systemGroup ? (
        <div className="shrink-0 border-t border-[var(--app-border)] px-2.5 py-2">
          <div className="flex flex-col">
            {systemGroup.items.map((item) => (
              <NavItemLink key={item.to} {...item} />
            ))}
          </div>
        </div>
      ) : null}
    </aside>
  );
}

export { SIDEBAR_WIDTH, SIDEBAR_MARGIN };
