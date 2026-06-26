import { COMPANION_IDS } from '../../types/gameAssets';
import type { CompanionId } from '../../types/gameAssets';
import { CompanionCard } from './CompanionCard';

type CompanionSelectorProps = {
  value: CompanionId;
  onChange: (id: CompanionId) => void;
  compact?: boolean;
};

export function CompanionSelector({ value, onChange, compact = false }: CompanionSelectorProps) {
  return (
    <div
      data-testid="companion-selector"
      className={compact ? 'grid gap-2' : 'grid gap-3 sm:grid-cols-2'}
    >
      {COMPANION_IDS.map((id) => (
        <CompanionCard
          key={id}
          companionId={id}
          selected={value === id}
          compact={compact}
          onSelect={onChange}
        />
      ))}
    </div>
  );
}
