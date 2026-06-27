import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

type NavItemLinkProps = {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  size?: 'sidebar' | 'drawer';
};

export function NavItemLink({
  to,
  icon: Icon,
  label,
  onClick,
  size = 'sidebar',
}: NavItemLinkProps) {
  const isDrawer = size === 'drawer';

  return (
    <NavLink
      to={to}
      end={to === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl transition-colors ${
          isDrawer ? 'px-3 py-3' : 'px-2.5 py-2.5'
        } ${
          isActive
            ? 'nav-link-active'
            : 'text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)] hover:text-[var(--app-text)]'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex shrink-0 items-center justify-center rounded-lg transition-colors ${
              isDrawer ? 'h-10 w-10' : 'h-9 w-9'
            } ${
              isActive
                ? 'bg-[color-mix(in_srgb,var(--app-primary)_22%,transparent)] text-[var(--app-primary)]'
                : 'bg-[var(--app-bg-soft)] text-[var(--app-text-muted)] group-hover:text-[var(--app-text)]'
            }`}
          >
            <Icon size={isDrawer ? 20 : 18} strokeWidth={2} />
          </span>
          <span className={`truncate font-medium ${isDrawer ? 'text-base' : 'text-sm'}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
