import { Leaf } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { GROWTH_HUB_TABS } from '../../constants/growthHub';
import { getThemeTerm } from '../../constants/themeTerms';
import { useAppTheme } from '../../hooks/useAppTheme';
import {
  GROWTH_HUB_TAB_ACTIVE,
  GROWTH_HUB_TAB_IDLE,
  GROWTH_HUB_TABS_SHELL,
} from './growthHubUi';

export function GrowthHubTabs() {
  const { themeId, isCozy } = useAppTheme();

  return (
    <nav
      data-testid="growth-hub-tabs"
      className={GROWTH_HUB_TABS_SHELL}
      aria-label="Разделы роста героя"
    >
      {GROWTH_HUB_TABS.map(({ id, label, path, icon: Icon }) => {
        const displayLabel =
          id === 'trials' ? getThemeTerm(themeId, 'weeklyTrials') : label;
        const TabIcon = id === 'trials' && isCozy ? Leaf : Icon;
        return (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? GROWTH_HUB_TAB_ACTIVE : GROWTH_HUB_TAB_IDLE
              }`
            }
          >
            <TabIcon size={16} strokeWidth={1.75} />
            {displayLabel}
          </NavLink>
        );
      })}
    </nav>
  );
}
