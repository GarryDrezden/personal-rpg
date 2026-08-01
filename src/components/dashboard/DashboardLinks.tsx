import { Link } from 'react-router-dom';
import { getThemeTerm } from '../../constants/themeTerms';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Card } from '../ui/Card';

export function DashboardLinks() {
  const { themeId, isCozy } = useAppTheme();
  const links = [
    { to: '/today', label: isCozy ? 'Задачи дня' : 'Квесты дня' },
    { to: '/codex', label: getThemeTerm(themeId, 'codex') },
    { to: '/journey', label: 'Путь' },
    { to: '/momentum', label: 'Инерция' },
    { to: '/freedom', label: 'Свобода' },
    { to: '/week', label: 'Неделя' },
    { to: '/measurements', label: 'Замеры' },
    { to: '/achievements', label: 'Достижения' },
  ] as const;

  return (
    <Card className="p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-text-muted)]">
        Разделы
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
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
