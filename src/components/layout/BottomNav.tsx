import { NavLink } from 'react-router-dom';
import { Home, Calendar, CalendarDays, Sparkles, Gift, Settings } from 'lucide-react';

const links = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/today', icon: Calendar, label: 'Сегодня' },
  { to: '/week', icon: CalendarDays, label: 'Неделя' },
  { to: '/skills', icon: Sparkles, label: 'Навыки' },
  { to: '/rewards', icon: Gift, label: 'Награды' },
  { to: '/settings', icon: Settings, label: 'Настройки' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-rpg-border bg-white md:hidden">
      <div className="flex justify-around py-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-0 flex-col items-center gap-0.5 px-1 py-1 text-[10px] ${
                isActive ? 'text-gold font-semibold' : 'text-rpg-muted'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
