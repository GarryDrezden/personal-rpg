import { NavLink } from 'react-router-dom';
import { Home, Calendar, CalendarDays, Ruler, Gift, Settings, Swords } from 'lucide-react';

const links = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/today', icon: Calendar, label: 'Сегодня' },
  { to: '/week', icon: CalendarDays, label: 'Неделя' },
  { to: '/measurements', icon: Ruler, label: 'Замеры' },
  { to: '/rewards', icon: Gift, label: 'Награды' },
  { to: '/settings', icon: Settings, label: 'Настройки' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-rpg-border bg-white">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-rpg-border">
        <Swords className="text-gold" size={28} />
        <span className="text-lg font-bold">Личная RPG</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-amber-50 text-amber-900'
                  : 'text-stone-600 hover:bg-stone-50'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
