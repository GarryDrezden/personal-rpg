import { useNavigate } from 'react-router-dom';
import type { NextBestAction } from '../../types/nextBestAction';
import { Card } from '../ui/Card';

type NextBestActionCardProps = {
  action: NextBestAction;
  onNavigate?: (route: string) => void;
};

export function NextBestActionCard({ action, onNavigate }: NextBestActionCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (action.targetRoute) {
      if (onNavigate) onNavigate(action.targetRoute);
      else navigate(action.targetRoute);
    }
  };

  return (
    <Card className="border-[color-mix(in_srgb,var(--app-primary)_35%,var(--app-border))] bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))]">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--app-primary)]">
        Следующий лучший шаг
      </p>
      <div className="mt-3 flex items-start gap-3">
        <span className="text-3xl" aria-hidden>
          {action.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold text-[var(--app-text)]">{action.title}</h2>
          <p className="mt-1 text-sm text-[var(--app-text-muted)]">{action.description}</p>
          {action.targetRoute ? (
            <button
              type="button"
              onClick={handleClick}
              className="btn-primary mt-4 rounded-xl px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              {action.actionLabel}
            </button>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
