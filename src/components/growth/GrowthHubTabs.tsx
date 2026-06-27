import { NavLink } from 'react-router-dom';
import { GROWTH_HUB_TABS } from '../../constants/growthHub';

export function GrowthHubTabs() {
  return (
    <nav
      data-testid="growth-hub-tabs"
      className="flex gap-1 overflow-x-auto rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] p-1"
      aria-label="Разделы роста героя"
    >
      {GROWTH_HUB_TABS.map(({ id, label, path, icon: Icon }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) =>
            `flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-[var(--app-primary)] text-slate-950 shadow-sm'
                : 'text-[var(--app-text-muted)] hover:bg-[var(--app-card)] hover:text-[var(--app-text)]'
            }`
          }
        >
          <Icon size={16} strokeWidth={2} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
