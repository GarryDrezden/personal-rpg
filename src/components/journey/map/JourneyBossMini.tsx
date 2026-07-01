import { useState } from 'react';
import type { BossId } from '../../../types/gameAssets';
import { getBossPublicPath } from '../../../game/assetPaths';
import type { JourneyStageStatus } from '../../../types/journeyMap';

type JourneyBossMiniProps = {
  bossId: BossId;
  status: JourneyStageStatus;
  isSelected?: boolean;
  className?: string;
  size?: 'sm' | 'md';
};

const BOSS_LABELS: Partial<Record<BossId, string>> = {
  lord_of_empty_day: 'Пустой день',
  divan_king: 'Диванный король',
  misty_baron: 'Туманный барон',
  resource_devourer: 'Пожиратель',
  old_form_guardian: 'Страж формы',
  chain_of_rollback: 'Цепь отката',
  night_feast_baron: 'Ночной барон',
  promise_collector: 'Сборщик обещаний',
};

function BossPlaceholder({ label, size }: { label: string; size: 'sm' | 'md' }) {
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
  const [imgFailed, setImgFailed] = useState(false);
  const label = BOSS_LABELS[bossId] ?? 'Босс';
  const isLocked = status === 'locked';
  const isCurrent = status === 'current';

  return (
    <div
      className={`journey-boss-mini journey-boss-mini--${size} ${
        isCurrent ? 'journey-boss-mini--current' : ''
      } ${isLocked ? 'journey-boss-mini--locked' : ''} ${
        isSelected ? 'journey-boss-mini--selected' : ''
      } ${className}`}
      title={label}
      aria-label={`Босс: ${label}`}
    >
      <div className="journey-boss-mini__frame">
        {!imgFailed ? (
          <img
            src={getBossPublicPath(bossId)}
            alt=""
            className="journey-boss-mini__img"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <BossPlaceholder label={label} size={size} />
        )}
      </div>
    </div>
  );
}
