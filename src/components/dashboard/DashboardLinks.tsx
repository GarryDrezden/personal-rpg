import { Link } from 'react-router-dom';
import { getThemeTerm } from '../../constants/themeTerms';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAppStore } from '../../store/appStore';
import { isSidebarOptionalVisible } from '../../utils/sidebarVisibility';
import type { SidebarVisibilityKey } from '../../types/sidebar';
import { Card } from '../ui/Card';

type DashLink = {
  to: string;
  label: string;
  visibilityKey?: SidebarVisibilityKey;
};

export function DashboardLinks() {
  const { themeId, isCozy } = useAppTheme();
  const settings = useAppStore((s) => s.settings);

  const links: DashLink[] = [
    { to: '/today', label: isCozy ? 'Задачи дня' : 'Квесты дня' },
    { to: '/codex', label: getThemeTerm(themeId, 'codex') },
    { to: '/journey', label: 'Путь' },
    { to: '/momentum', label: 'Инерция', visibilityKey: 'momentum' },
    { to: '/freedom', label: 'Свобода' },
    { to: '/week', label: 'Неделя' },
    { to: '/measurements', label: 'Замеры' },
    { to: '/achievements', label: 'Достижения' },
    { to: '/map', label: 'Карта навыков', visibilityKey: 'skillMap' },
    { to: '/seasons', label: getThemeTerm(themeId, 'chronicle'), visibilityKey: 'chronicle' },
    { to: '/growth', label: 'Рост героя', visibilityKey: 'heroGrowth' },
  ];

  const visible = links.filter(
    (link) =>
      !link.visibilityKey ||
      isSidebarOptionalVisible(settings, themeId, link.visibilityKey),
  );

  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
        Разделы
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {visible.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-3 py-1.5 text-sm font-medium text-[var(--app-primary)] hover:border-[var(--app-primary)]/40"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </Card>
  );
}
