import type { AppThemeId } from '../../types/theme';
import { APP_THEMES } from '../../constants/themes';
import { Badge } from '../ui/Badge';

type ThemeSelectorProps = {
  value: AppThemeId;
  onChange: (themeId: AppThemeId) => void;
};

function ThemePreview({ themeId }: { themeId: AppThemeId }) {
  if (themeId === 'cozy') {
    return (
      <div className="mt-3 rounded-2xl border border-[var(--app-border)] bg-[#f8fafc] p-3">
        <div className="rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm">
          <div className="mb-2 h-2 w-2/3 rounded-full bg-amber-400" />
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="h-2 w-2 rounded-full bg-violet-400" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 rounded-2xl border border-violet-500/20 bg-[#090812] p-3">
      <div className="rounded-xl border border-violet-400/25 bg-[#171329] p-2 shadow-[0_0_20px_rgba(167,139,250,0.18)]">
        <div className="mb-2 h-2 w-2/3 rounded-full bg-yellow-400" />
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="h-2 w-2 rounded-full bg-violet-400" />
        </div>
      </div>
    </div>
  );
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {APP_THEMES.map((theme) => {
        const active = value === theme.id;
        return (
          <div
            key={theme.id}
            className={`rounded-3xl border p-4 transition-shadow ${
              active
                ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] shadow-[var(--app-shadow)]'
                : 'border-[var(--app-border)] bg-[var(--app-card)]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{theme.previewEmoji}</span>
                <div>
                  <h3 className="font-semibold text-[var(--app-text)]">{theme.title}</h3>
                  <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                    {theme.description}
                  </p>
                </div>
              </div>
              {active && <Badge variant="gold">Активна</Badge>}
            </div>

            <ThemePreview themeId={theme.id} />

            <button
              type="button"
              onClick={() => onChange(theme.id)}
              disabled={active}
              className="mt-4 w-full rounded-xl bg-[var(--app-primary)] px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-default disabled:opacity-50"
            >
              {active ? 'Выбрана' : 'Выбрать'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
