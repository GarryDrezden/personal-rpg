import { Link } from 'react-router-dom';
import type { SeasonSnapshotWithRecap } from '../../game/seasons/seasonEngine';
import type { BodyAbilityV1Summary } from '../../types/bodyAbilityV1';
import type { PlateauSnapshot } from '../../types/plateauV1';
import type { BaseProgressionSnapshot } from '../../types/baseV1';
import type { BossCampaignSnapshot } from '../../game/bosses/bossTypes';
import { getThemeTerm } from '../../constants/themeTerms';
import { shouldShowPlateauDashboardSummary } from '../../utils/campaignIntegration';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useAppStore } from '../../store/appStore';
import { isSidebarOptionalVisible } from '../../utils/sidebarVisibility';
import { SeasonDashboardSummary } from '../season/SeasonDashboardSummary';
import { BodyAbilityPersonalDashboardCard } from '../bodyAbilities/BodyAbilityPersonalDashboardCard';
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
  bodyAbilitySummary: _bodyAbilitySummary,
  plateauSnapshot,
  baseSnapshot,
  bossSnapshot,
  onTogglePlateauManual,
}: CampaignProgressDashboardSectionProps) {
  const { themeId, isCozy } = useAppTheme();
  const settings = useAppStore((s) => s.settings);
  const showPlateau = shouldShowPlateauDashboardSummary(plateauSnapshot.mode);
  const showChronicle = isSidebarOptionalVisible(settings, themeId, 'chronicle');

  return (
    <section data-testid="campaign-progress-dashboard" className="space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
          {getThemeTerm(themeId, 'campaign')}
        </h2>
        <div className="flex flex-wrap gap-3 text-xs">
          {showChronicle ? (
            <Link to="/seasons" className="font-medium text-[var(--app-primary)] hover:underline">
              {getThemeTerm(themeId, 'chronicle')}
            </Link>
          ) : null}
          <Link to="/freedom" className="font-medium text-[var(--app-primary)] hover:underline">
            Свобода тела
          </Link>
          <Link to="/growth/camp" className="font-medium text-[var(--app-primary)] hover:underline">
            {isCozy ? 'Укрытие' : 'Лагерь'}
          </Link>
          <Link to="/journey" className="font-medium text-[var(--app-primary)] hover:underline">
            Путь
          </Link>
        </div>
      </div>
      <div className="grid items-stretch gap-2 sm:grid-cols-2">
        <SeasonDashboardSummary season={season} compact boss={bossSnapshot} />
        <BaseDashboardSummary snapshot={baseSnapshot} compact />
        <BodyAbilityPersonalDashboardCard />
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
