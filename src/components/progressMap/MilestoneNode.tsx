import type { MilestoneStatus, ProgressMilestone } from '../../types/progressMap';

type MilestoneNodeProps = {
  milestone: ProgressMilestone;
  status: MilestoneStatus;
  compact?: boolean;
};

const statusStyles: Record<MilestoneStatus, { node: string; ring: string; label: string }> = {
  completed: {
    node: 'bg-[var(--app-success)] text-slate-950 border-[var(--app-success)]',
    ring: 'ring-[color-mix(in_srgb,var(--app-success)_30%,transparent)]',
    label: 'text-[var(--app-success)] font-medium',
  },
  current: {
    node: 'bg-[var(--app-primary)] text-slate-950 border-[var(--app-primary)] shadow-md',
    ring: 'ring-4 ring-[color-mix(in_srgb,var(--app-primary)_35%,transparent)]',
    label: 'text-[var(--app-primary)] font-semibold',
  },
  upcoming: {
    node: 'bg-[var(--app-bg-soft)] text-[var(--app-text-muted)] border-[var(--app-border)]',
    ring: 'ring-[var(--app-border)]',
    label: 'text-[var(--app-text-muted)]',
  },
};

export function MilestoneNode({ milestone, status, compact = false }: MilestoneNodeProps) {
  const styles = statusStyles[status];

  return (
    <div className={`flex flex-col items-center ${compact ? 'min-w-[3.5rem]' : 'min-w-[4.5rem]'}`}>
      <div
        className={`flex items-center justify-center rounded-full border-2 ${styles.node} ${styles.ring} ${
          compact ? 'h-9 w-9 text-sm' : 'h-11 w-11 text-base'
        }`}
        title={milestone.description}
      >
        <span aria-hidden>{milestone.icon}</span>
      </div>
      <p
        className={`mt-2 text-center leading-tight ${styles.label} ${
          compact ? 'text-[10px]' : 'text-xs'
        }`}
      >
        {milestone.title}
      </p>
    </div>
  );
}
