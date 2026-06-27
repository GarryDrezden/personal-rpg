import { Link } from 'react-router-dom';
import type { NextBestAction } from '../../types/nextBestAction';

type DashboardPrimaryCtaProps = {
  action: NextBestAction;
};

export function DashboardPrimaryCta({ action }: DashboardPrimaryCtaProps) {
  return (
    <section
      data-testid="dashboard-primary-cta"
      className="rounded-2xl border border-[color-mix(in_srgb,var(--app-primary)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))] p-4 shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--app-primary)]">
        Главное действие дня
      </p>

      <div className="mt-2 flex items-start gap-3">
        <span className="text-3xl leading-none" aria-hidden>
          {action.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold leading-snug text-[var(--app-text)]">{action.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-[var(--app-text-muted)]">
            {action.description}
          </p>
        </div>
      </div>

      {action.targetRoute ? (
        <Link
          to={action.targetRoute}
          className="mt-4 flex w-full items-center justify-center rounded-xl bg-[var(--app-primary)] px-4 py-3 text-base font-bold text-slate-950 transition hover:brightness-105"
        >
          {action.actionLabel} →
        </Link>
      ) : null}
    </section>
  );
}
