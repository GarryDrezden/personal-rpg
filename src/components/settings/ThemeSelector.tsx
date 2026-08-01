import type { AppThemeId } from '../../types/theme';
import { APP_THEMES } from '../../constants/themes';

type ThemeSelectorProps = {
  value: AppThemeId;
  onChange: (themeId: AppThemeId) => void;
};
function ThemePreview({ themeId }: { themeId: AppThemeId }) {
  if (themeId === 'cozy') {
    return (
      <div className="mt-3 rounded-2xl border border-[rgba(139,115,85,0.28)] bg-[#f1ebe0] p-3">
        <div className="rounded-xl border border-[rgba(139,115,85,0.22)] bg-[#fff8ee] p-2 shadow-[0_8px_18px_rgba(74,55,32,0.08)]">
          <div className="mb-2 h-2 w-2/3 rounded-full bg-gradient-to-r from-[#5f7a5a] to-[#e8c547]" />
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#5f7a5a]" />
            <span className="h-2 w-2 rounded-full bg-[#c4922a]" />
            <span className="h-2 w-2 rounded-full bg-[#c4785a]" />
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
    <div className="grid gap-4 sm:grid-cols-2" data-testid="theme-toggle">
      {APP_THEMES.map((theme) => {
        const active = value === theme.id;
        return (
          <div
            key={theme.id}
            data-testid={`theme-option-${theme.id}`}
            className={`rounded-3xl border p-4 transition-shadow ${              active
                ? 'border-[var(--app-primary)] bg-[var(--app-primary-soft)] shadow-[var(--app-shadow)]'
                : 'border-[var(--app-border)] bg-[var(--app-card)]'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-2xl">{theme.previewEmoji}</span>
              <div>
                <h3 className="font-semibold text-[var(--app-text)]">{theme.title}</h3>
                <p className="mt-1 text-sm text-[var(--app-text-muted)]">
                  {theme.description}
                </p>
              </div>
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
