import type { MilestoneStatus } from '../../types/progressMap';
import type { ProgressMilestone } from '../../types/progressMap';

type MilestoneNodeProps = {
  milestone: ProgressMilestone;
  status: MilestoneStatus;
  compact?: boolean;
};

const statusStyles: Record<MilestoneStatus, { node: string; ring: string; label: string }> = {
  completed: {
    node: 'bg-emerald-500 text-white border-emerald-400',
    ring: 'ring-emerald-200',
    label: 'text-emerald-700 font-medium',
  },
  current: {
    node: 'bg-gold text-white border-amber-400 shadow-md shadow-amber-200/60',
    ring: 'ring-4 ring-amber-200/80',
    label: 'text-amber-800 font-semibold',
  },
  upcoming: {
    node: 'bg-stone-200 text-stone-500 border-stone-300',
    ring: 'ring-stone-100',
    label: 'text-stone-400',
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
