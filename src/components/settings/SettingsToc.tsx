const SECTIONS = [
  { id: 'settings-theme', label: 'Внешний вид' },
  { id: 'settings-weight', label: 'Персонаж' },
  { id: 'settings-game-hero', label: 'Герой RPG' },
  { id: 'settings-avatar', label: 'Аватар' },
  { id: 'settings-nutrition', label: 'Питание' },
  { id: 'settings-defaults', label: 'Цели' },
  { id: 'settings-weeks', label: 'Недели' },
  { id: 'settings-coins', label: 'Монеты' },
  { id: 'settings-xp', label: 'Баллы' },
  { id: 'settings-habits', label: 'Второст. цели' },
  { id: 'settings-backup', label: 'Бэкап' },
] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function SettingsToc() {
  return (
    <nav
      aria-label="Разделы настроек"
      className="sticky top-0 z-20 -mx-1 rounded-2xl border border-[var(--app-border)] bg-[color-mix(in_srgb,var(--app-card)_92%,transparent)] px-3 py-3 shadow-[var(--app-shadow)] backdrop-blur-md"
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--app-text-muted)]">
        Оглавление
      </p>
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollToSection(id)}
            className="rounded-lg border border-[var(--app-border)] bg-[var(--app-card-strong)] px-3 py-1.5 text-sm font-medium text-[var(--app-text-muted)] transition hover:border-[var(--app-primary)] hover:text-[var(--app-primary)]"
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
