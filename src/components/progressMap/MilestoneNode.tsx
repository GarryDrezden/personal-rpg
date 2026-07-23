import { Check, Lock } from 'lucide-react';
import type { MilestoneStatus, ProgressMilestone } from '../../types/progressMap';

type MilestoneNodeProps = {
  milestone: ProgressMilestone;
  status: MilestoneStatus;
  isLast?: boolean;
};

export function MilestoneNode({ milestone, status, isLast = false }: MilestoneNodeProps) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isUpcoming = status === 'upcoming';

  return (
    <li className="relative flex gap-3">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <div
          className={`relative z-[1] flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
            isCompleted
              ? 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200'
              : isCurrent
                ? 'border-amber-300/70 bg-gradient-to-br from-amber-200/90 via-amber-400 to-amber-700 text-slate-950 shadow-[0_0_16px_rgba(251,191,36,0.45)]'
                : 'border-violet-500/25 bg-[#0e0c14]/90 text-stone-400'
          }`}
          title={milestone.description}
        >
          {isCompleted ? (
            <Check size={14} strokeWidth={2.5} aria-hidden />
          ) : isUpcoming ? (
            <Lock size={12} aria-hidden />
          ) : (
            <span aria-hidden>{milestone.icon}</span>
          )}
        </div>
        {!isLast ? (
          <div
            className={`mt-1 w-px flex-1 min-h-[1.25rem] ${
              isCompleted
                ? 'bg-gradient-to-b from-emerald-400/50 to-violet-500/20'
                : isCurrent
                  ? 'bg-gradient-to-b from-amber-400/45 to-violet-500/15'
                  : 'bg-violet-500/15'
            }`}
            aria-hidden
          />
        ) : null}
      </div>

      <div className={`min-w-0 flex-1 pb-3 ${isLast ? 'pb-0' : ''}`}>
        <p
          className={`text-sm font-semibold leading-tight ${
            isCompleted
              ? 'text-emerald-200/90'
              : isCurrent
                ? 'text-[var(--app-gold)]'
                : 'text-[var(--app-text-muted)]'
          }`}
        >
          {milestone.title}
          {isCurrent ? (
            <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-amber-300/80">
              Сейчас
            </span>
          ) : null}
        </p>
        <p
          className={`mt-0.5 text-xs leading-snug ${
            isUpcoming ? 'text-[var(--app-text-muted)]/55' : 'text-[var(--app-text-muted)]/80'
          }`}
        >
          {milestone.description}
        </p>
      </div>
    </li>
  );
}
