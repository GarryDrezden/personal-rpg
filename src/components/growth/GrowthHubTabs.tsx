import { NavLink } from 'react-router-dom';
import { GROWTH_HUB_TABS } from '../../constants/growthHub';
import {
  GROWTH_HUB_TAB_ACTIVE,
  GROWTH_HUB_TAB_IDLE,
  GROWTH_HUB_TABS_SHELL,
} from './growthHubUi';

export function GrowthHubTabs() {
  return (
    <nav
      data-testid="growth-hub-tabs"
      className={GROWTH_HUB_TABS_SHELL}
      aria-label="Разделы роста героя"
    >
      {GROWTH_HUB_TABS.map(({ id, label, path, icon: Icon }) => (
        <NavLink
          key={id}
          to={path}
          className={({ isActive }) =>
            `flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? GROWTH_HUB_TAB_ACTIVE : GROWTH_HUB_TAB_IDLE
            }`
          }
        >
          <Icon size={16} strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
