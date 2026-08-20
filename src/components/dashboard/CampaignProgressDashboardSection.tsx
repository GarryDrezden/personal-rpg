import type { PlateauSnapshot } from '../../types/plateauV1';
import { shouldShowPlateauDashboardSummary } from '../../utils/campaignIntegration';
import { PlateauDashboardSummary } from '../plateau/PlateauDashboardSummary';

type CampaignProgressDashboardSectionProps = {
  plateauSnapshot: PlateauSnapshot;
  onTogglePlateauManual: () => void;
};

/** Secondary only: plateau is a NOW-adjacent blocker. Season / abilities live in NEXT. */
export function CampaignProgressDashboardSection({
  plateauSnapshot,
  onTogglePlateauManual,
}: CampaignProgressDashboardSectionProps) {
  const showPlateau = shouldShowPlateauDashboardSummary(plateauSnapshot.mode);
  if (!showPlateau) return null;

  return (
    <section data-testid="campaign-progress-dashboard" className="space-y-2">
      <PlateauDashboardSummary
        snapshot={plateauSnapshot}
        onToggleManual={onTogglePlateauManual}
        compact
      />
    </section>
  );
}
