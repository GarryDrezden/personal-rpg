import { NavLink } from 'react-router-dom';
import {
  Home,
  Calendar,
  CalendarDays,
  Ruler,
  Gift,
  Trophy,
  Sparkles,
  Settings,
  Swords,
  Map,
  FileText,
  Lightbulb,
  Dna,
  Route,
  Feather,
  Gauge,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

const links = [
  { to: '/', icon: Home, label: 'Главная' },
  { to: '/today', icon: Calendar, label: 'Сегодня' },
  { to: '/week', icon: CalendarDays, label: 'Неделя' },
  { to: '/bosses', icon: Swords, label: 'Боссы' },
  { to: '/reports', icon: FileText, label: 'Отчёты' },
  { to: '/measurements', icon: Ruler, label: 'Замеры' },
  { to: '/skills', icon: Sparkles, label: 'Навыки' },
  { to: '/abilities', icon: Dna, label: 'Способности' },
  { to: '/journey', icon: Route, label: 'Путь' },
  { to: '/freedom', icon: Feather, label: 'Свобода' },
  { to: '/momentum', icon: Gauge, label: 'Инерция' },
  { to: '/map', icon: Map, label: 'Карта' },
  { to: '/insights', icon: Lightbulb, label: 'Аналитика' },
  { to: '/rewards', icon: Gift, label: 'Награды' },
  { to: '/achievements', icon: Trophy, label: 'Достижения' },
  { to: '/codex', icon: BookOpen, label: 'Кодекс' },
  { to: '/faq', icon: HelpCircle, label: 'FAQ' },
  { to: '/settings', icon: Settings, label: 'Настройки' },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[var(--app-border)] bg-[var(--app-card-strong)] backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-[var(--app-border)] px-6 py-5">
        <Swords className="text-[var(--app-primary)]" size={28} />
        <span className="text-lg font-bold text-[var(--app-text)]">Личная RPG</span>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'nav-link-active'
                  : 'text-[var(--app-text-muted)] hover:bg-[var(--app-bg-soft)]'
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
