import { SettingsToc } from '../components/settings/SettingsToc';
import { SettingsHeader } from '../components/settings/SettingsHeader';
import { ThemeSettingsSection } from '../components/settings/ThemeSettingsSection';
import { ExperimentalSettingsSection } from '../components/settings/ExperimentalSettingsSection';
import { BodyAbilityMapSettingsCard } from '../components/settings/BodyAbilityMapSettingsCard';
import { SidebarVisibilitySettingsCard } from '../components/settings/SidebarVisibilitySettingsCard';
import { PwaInstallCard } from '../components/pwa/PwaInstallCard';
import { GameHeroSettingsSection } from '../components/settings/GameHeroSettingsSection';
import { AvatarSettingsSection } from '../components/settings/AvatarSettingsSection';
import { NutritionSettingsSection } from '../components/settings/NutritionSettingsSection';
import {
  DefaultGoalsSettingsSection,
  ProgressCharacterSettingsSection,
  WeeklyGoalsSettingsSection,
} from '../components/settings/GoalsSettingsSections';
import {
  CoinSettingsSection,
  HabitsSettingsSection,
  XpSettingsSection,
} from '../components/settings/AdvancedSettingsSections';
import { DataBackupSection } from '../components/settings/DataBackupSection';
import { SETTINGS_SECTION_IDS } from '../components/settings/settingsTocSections';
import { useSettingsDraft } from '../hooks/useSettingsDraft';

export function SettingsPage() {
  const draft = useSettingsDraft();

  return (
    <div className="space-y-6" data-testid="settings-page">
      <SettingsHeader saving={draft.saving} onSave={() => void draft.handleSave()} />
      <SettingsToc />
      <ThemeSettingsSection />
      <SidebarVisibilitySettingsCard />
      <div id={SETTINGS_SECTION_IDS.pwa} className="scroll-mt-28">
        <PwaInstallCard />
      </div>
      <BodyAbilityMapSettingsCard />
      <ExperimentalSettingsSection />
      <ProgressCharacterSettingsSection draft={draft} />
      <GameHeroSettingsSection draft={draft} />
      <AvatarSettingsSection draft={draft} />
      <NutritionSettingsSection draft={draft} />
      <DefaultGoalsSettingsSection draft={draft} />
      <WeeklyGoalsSettingsSection draft={draft} />
      <CoinSettingsSection draft={draft} />
      <XpSettingsSection draft={draft} />
      <HabitsSettingsSection draft={draft} />
      <DataBackupSection />
    </div>
  );
}
