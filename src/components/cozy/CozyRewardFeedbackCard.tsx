import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { COZY_RESOURCE_LABELS } from '../../constants/cozyHomeConfig';
import type { AppThemeId } from '../../types/theme';
import type { CozyHomeState, CozyRewardsGranted } from '../../types/cozyHome';
import {
  getCozyUpgradeHintLine,
  getNextCozyHomeUpgrade,
} from '../../utils/cozyHomeEngine';
import {
  listGrantedCozyResources,
  pickCozyRewardReasons,
  sumCozyGrantedResources,
} from '../../utils/cozyHomeRewardsEngine';

type CozyRewardFeedbackCardProps = {
  rewards: CozyRewardsGranted;
  homeState: CozyHomeState;
  themeId: AppThemeId;
};

const CHIP_CLASS: Record<keyof typeof COZY_RESOURCE_LABELS, string> = {
  comfort: 'cozy-resource-chip cozy-resource-chip--comfort cozy-reward-chip',
  materials: 'cozy-resource-chip cozy-resource-chip--materials cozy-reward-chip',
  garden: 'cozy-resource-chip cozy-resource-chip--garden cozy-reward-chip',
  clarity: 'cozy-resource-chip cozy-resource-chip--clarity cozy-reward-chip',
};

export function CozyRewardFeedbackCard({
  rewards,
  homeState,
  themeId,
}: CozyRewardFeedbackCardProps) {
  const total = sumCozyGrantedResources(rewards.resources);
  if (total <= 0) return null;

  const isCozy = themeId === 'cozy';
  const granted = listGrantedCozyResources(rewards.resources);
  const reasons = pickCozyRewardReasons(rewards.reasons, 3);
  const next = getNextCozyHomeUpgrade(homeState);
  const hint = getCozyUpgradeHintLine(homeState);
  const ctaLabel = next?.canUpgrade ? 'Улучшить дом' : 'Открыть дом';
  const title = isCozy ? 'Дом стал чуть теплее' : 'Дом получил ресурсы';
  const lead = isCozy
    ? 'День сохранён. Забота о теле принесла ресурсы для дома.'
    : 'День сохранён. Дом получил ресурсы для восстановления.';

  return (
    <section
      data-testid="cozy-reward-feedback"
      className={isCozy ? 'cozy-reward-feedback' : 'cozy-reward-feedback cozy-reward-feedback--neutral'}
      aria-label={title}
    >
      <div className="flex items-start gap-2.5">
        <span className="cozy-reward-feedback__icon" aria-hidden>
          <Home size={18} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="cozy-reward-feedback__eyebrow">
            {isCozy ? 'Дом' : 'Награда дня'}
          </p>
          <h3 className="cozy-reward-feedback__title">{title}</h3>
          <p className="cozy-reward-feedback__lead">{lead}</p>
        </div>
      </div>

      <div className="cozy-reward-feedback__chips" aria-label="Начисленные ресурсы">
        {granted.map(({ id, amount }) => (
          <span key={id} className={CHIP_CLASS[id]}>
            <span className="cozy-resource-chip__value">+{amount}</span>
            <span className="cozy-resource-chip__label">{COZY_RESOURCE_LABELS[id]}</span>
          </span>
        ))}
      </div>

      {reasons.length > 0 ? (
        <ul className="cozy-reward-feedback__reasons">
          {reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}

      <p className="cozy-reward-feedback__hint">{hint}</p>

      <Link to="/home" className="cozy-reward-feedback__cta">
        {ctaLabel}
        <span aria-hidden> →</span>
      </Link>
    </section>
  );
}
