import { Navigate, useParams } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { isGrowthHubTab } from '../constants/growthHub';
import { GrowthHubTabs } from '../components/growth/GrowthHubTabs';
import { SkillsPage } from './SkillsPage';
import { BodyAbilitiesPage } from './BodyAbilitiesPage';
import { RewardsPage } from './RewardsPage';
import { AchievementsPage } from './AchievementsPage';
import { BossesPage } from './BossesPage';
import { BaseCampPage } from './BaseCampPage';

export function GrowthHubPage() {
  const { tab } = useParams<{ tab: string }>();

  if (!tab || !isGrowthHubTab(tab)) {
    return <Navigate to="/growth/skills" replace />;
  }

  return (
    <div data-testid="growth-hub-page" className="space-y-4 pb-4">
      <header>
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[color-mix(in_srgb,var(--app-primary)_18%,var(--app-card))] text-[var(--app-primary)]">
            <TrendingUp size={24} strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--app-text)]">Рост героя</h1>
            <p className="mt-1 max-w-2xl text-sm text-[var(--app-text-muted)]">
              Навыки, способности тела, лагерь, награды, коллекция трофеев и испытания недели —
              слои долгой кампании. Ежедневный ход остаётся на экране «Сегодня».
            </p>
          </div>
        </div>
      </header>

      <GrowthHubTabs />

      <div className="pt-1">
        {tab === 'skills' ? <SkillsPage embedded /> : null}
        {tab === 'abilities' ? <BodyAbilitiesPage embedded /> : null}
        {tab === 'camp' ? <BaseCampPage embedded /> : null}
        {tab === 'rewards' ? <RewardsPage embedded /> : null}
        {tab === 'achievements' ? <AchievementsPage embedded /> : null}
        {tab === 'trials' ? <BossesPage embedded /> : null}
      </div>
    </div>
  );
}
