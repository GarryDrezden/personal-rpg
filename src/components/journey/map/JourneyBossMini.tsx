import { useState } from 'react';
import type { BossId } from '../../../types/gameAssets';
import { getThemeTerm } from '../../../constants/themeTerms';
import { getBossMeta } from '../../../game/assetRegistry';
import { getBossPresentation } from '../../../game/themeEntityPresentation';
import { useAppTheme } from '../../../hooks/useAppTheme';
import type { JourneyStageStatus } from '../../../types/journeyMap';

type JourneyBossMiniProps = {
  bossId: BossId;
  status: JourneyStageStatus;
  isSelected?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
};

function BossPlaceholder({ label, size }: { label: string; size: 'xs' | 'sm' | 'md' }) {
  const initial = label.charAt(0).toUpperCase();
  return (
    <span
      className={`journey-boss-mini__placeholder ${size === 'sm' ? 'journey-boss-mini__placeholder--sm' : ''}`}
      aria-hidden
    >
      {initial}
    </span>
  );
}

export function JourneyBossMini({
  bossId,
  status,
  isSelected,
  className = '',
  size = 'md',
}: JourneyBossMiniProps) {
  const { themeId } = useAppTheme();
  const meta = getBossMeta(bossId);
  const presentation = getBossPresentation(themeId, bossId, meta);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const candidates = presentation.imageCandidates;
  const activeSrc = candidates[candidateIndex];
  const label = presentation.title;
  const term = getThemeTerm(themeId, 'boss');
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';
  const imgFailed = candidateIndex >= candidates.length;

  return (
    <div
      className={`journey-boss-mini journey-boss-mini--${size} ${
        isCurrent ? 'journey-boss-mini--current' : ''
      } ${isLocked ? 'journey-boss-mini--locked' : ''} ${
        isSelected ? 'journey-boss-mini--selected' : ''
      } ${className}`}
      title={label}
      aria-label={`${term}: ${label}`}
    >
      <div className="journey-boss-mini__frame">
        {!imgFailed && activeSrc ? (
          <img
            src={activeSrc}
            alt=""
            className="journey-boss-mini__img"
            loading="lazy"
            decoding="async"
            onError={() => setCandidateIndex((i) => i + 1)}
          />
        ) : (
          <BossPlaceholder label={label} size={size} />
        )}
      </div>
    </div>
  );
}
