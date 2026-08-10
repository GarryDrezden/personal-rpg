import type { ReactNode } from 'react';

type CampaignDashboardCardShellProps = {
  testId: string;
  art: ReactNode;
  artCaption: string;
  children: ReactNode;
};

/**
 * Shared shell for Season + Camp dashboard plates —
 * same banner height, caption band, and body padding.
 */
export function CampaignDashboardCardShell({
  testId,
  art,
  artCaption,
  children,
}: CampaignDashboardCardShellProps) {
  return (
    <section
      data-testid={testId}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-card)]/80"
    >
      <div className="shrink-0 border-b border-[var(--app-border)]/60 bg-[var(--app-bg-soft)]/30">
        {art}
        <p className="px-3 py-2 text-center text-[10px] font-medium uppercase tracking-wide text-[var(--app-text-muted)]">
          {artCaption}
        </p>
      </div>
      <div className="flex flex-1 flex-col px-4 py-3">{children}</div>
    </section>
  );
}

type CampaignDashboardCardHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  meta: ReactNode;
};

export function CampaignDashboardCardHeader({
  eyebrow,
  title,
  meta,
}: CampaignDashboardCardHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--app-gold)]">
          {eyebrow}
        </p>
        <p className="truncate text-sm font-medium text-[var(--app-text)]">{title}</p>
      </div>
      <p className="text-xs text-[var(--app-text-muted)]">{meta}</p>
    </div>
  );
}
