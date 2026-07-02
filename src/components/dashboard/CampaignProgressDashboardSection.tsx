import { Link } from 'react-router-dom';
import type { SeasonSnapshotWithRecap } from '../../game/seasons/seasonEngine';
import type { BodyAbilityV1Summary } from '../../types/bodyAbilityV1';
import type { PlateauSnapshot } from '../../types/plateauV1';
import type { BaseProgressionSnapshot } from '../../types/baseV1';
import type { BossCampaignSnapshot } from '../../game/bosses/bossTypes';
import { shouldShowPlateauDashboardSummary } from '../../utils/campaignIntegration';
import { SeasonDashboardSummary } from '../season/SeasonDashboardSummary';
import { BodyAbilityDashboardSummary } from '../bodyAbilities/BodyAbilityDashboardSummary';
import { PlateauDashboardSummary } from '../plateau/PlateauDashboardSummary';
import { BaseDashboardSummary } from '../base/BaseDashboardSummary';

type CampaignProgressDashboardSectionProps = {
  season: SeasonSnapshotWithRecap;
  bodyAbilitySummary: BodyAbilityV1Summary;
  plateauSnapshot: PlateauSnapshot;
  baseSnapshot: BaseProgressionSnapshot;
  bossSnapshot: BossCampaignSnapshot;
  onTogglePlateauManual: () => void;
};

export function CampaignProgressDashboardSection({
  season,
  bodyAbilitySummary,
  plateauSnapshot,
  baseSnapshot,
  bossSnapshot,
  onTogglePlateauManual,
}: CampaignProgressDashboardSectionProps) {
  const showPlateau = shouldShowPlateauDashboardSummary(plateauSnapshot.mode);

  return (
    <section data-testid="campaign-progress-dashboard" className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
          Кампания
        </h2>
        <div className="flex flex-wrap gap-3 text-xs">
          <Link to="/growth/abilities" className="font-medium text-[var(--app-primary)] hover:underline">
            Способности
          </Link>
          <Link to="/growth/camp" className="font-medium text-[var(--app-primary)] hover:underline">
            Лагерь
          </Link>
          <Link to="/journey" className="font-medium text-[var(--app-primary)] hover:underline">
            Путь
          </Link>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <SeasonDashboardSummary season={season} compact boss={bossSnapshot} />
        <BaseDashboardSummary snapshot={baseSnapshot} compact />
        <BodyAbilityDashboardSummary summary={bodyAbilitySummary} compact />
        {showPlateau ? (
          <PlateauDashboardSummary
            snapshot={plateauSnapshot}
            onToggleManual={onTogglePlateauManual}
            compact
          />
        ) : null}
      </div>
    </section>
  );
}
