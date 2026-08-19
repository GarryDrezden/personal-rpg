import { SeasonTodayCard } from '../season/SeasonTodayCard';
import { BodyAbilityTodayHint } from '../bodyAbilities/BodyAbilityTodayHint';
import { BodyAbilityPersonalTodayHint } from '../bodyAbilities/BodyAbilityPersonalTodayHint';
import { PlateauTodayCard } from '../plateau/PlateauTodayCard';
import { MomentumHelpCard } from '../momentum/MomentumHelpCard';
import { RecoveryCard } from '../recovery/RecoveryCard';
import { RecoverySuggestionCard } from '../recovery/RecoverySuggestionCard';
import { DailyMobCard } from '../game/DailyMobCard';
import { TodaySaveReactionCard } from './TodaySaveReactionCard';
import { TodayReactionPreview } from './TodayReactionPreview';
import { NutritionRecoverySuggestionCard } from '../nutrition/NutritionRecoverySuggestionCard';
import { shouldShowBodyAbilityHintOnToday } from '../../utils/campaignIntegration';
import type { TodayPageModel } from '../../hooks/useTodayPageModel';

type TodayContextStackProps = {
  model: TodayPageModel;
};

export function TodayContextStack({ model }: TodayContextStackProps) {
  const {
    derived,
    saveReaction,
    dirty,
    recoveryToast,
    isEditingToday,
    today,
    settings,
    entry,
    saving,
    themeId,
    persistDayMode,
    handleDismissRecoverySuggestion,
    handleDismissNutritionHelp,
    handleDismissMomentumHelp,
    handleMarkPlateau,
    handleClearPlateau,
    handleDismissPlateauHint,
    dismissSaveReaction,
  } = model;

  return (
    <>
      {saveReaction && !dirty ? (
        <TodaySaveReactionCard
          reaction={saveReaction}
          homeState={derived.cozyHomeState}
          themeId={themeId}
          onDismiss={dismissSaveReaction}
        />
      ) : (
        <TodayReactionPreview
          reaction={derived.previewReaction}
          cozyPreview={derived.cozyRewardPreview}
          visible={derived.showReactionPreview}
        />
      )}

      {recoveryToast && (
        <p className="rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-center text-sm font-medium text-[var(--app-success)]">
          {recoveryToast}
        </p>
      )}

      {derived.showRecoverySuggestion && (
        <RecoverySuggestionCard
          onAccept={() => void persistDayMode('recovery')}
          onDismiss={handleDismissRecoverySuggestion}
        />
      )}

      {derived.showNutritionRecovery ? (
        <NutritionRecoverySuggestionCard
          onAcceptRecovery={() => void persistDayMode('recovery')}
          onAcceptMinimal={() => void persistDayMode('minimal')}
          onDismiss={handleDismissNutritionHelp}
        />
      ) : null}

      {derived.showMomentumHelp && (
        <MomentumHelpCard
          summary={derived.momentumSummary}
          onSetRecoveryMode={() => void persistDayMode('recovery')}
          onSetMinimalMode={() => void persistDayMode('minimal')}
          onDismiss={handleDismissMomentumHelp}
        />
      )}

      {derived.showRecovery && (
        <RecoveryCard
          today={today}
          dailyEntries={derived.entriesForQuests}
          settings={settings}
          todayEntry={entry}
          showLink={false}
        />
      )}

      {derived.dailyMobId ? (
        <DailyMobCard mobId={derived.dailyMobId} compact contextLine={derived.dailyMobContext} />
      ) : null}

      {isEditingToday ? (
        <SeasonTodayCard season={derived.seasonSnapshot} boss={derived.bossSnapshot} />
      ) : null}

      {derived.personalAbilityHint &&
      shouldShowBodyAbilityHintOnToday(derived.plateauSnapshot.mode) ? (
        <BodyAbilityPersonalTodayHint ability={derived.personalAbilityHint} />
      ) : derived.bodyAbilityHint &&
        shouldShowBodyAbilityHintOnToday(derived.plateauSnapshot.mode) ? (
        <BodyAbilityTodayHint hint={derived.bodyAbilityHint} />
      ) : null}

      {isEditingToday && derived.plateauSnapshot.mode !== 'none' ? (
        <PlateauTodayCard
          snapshot={derived.plateauSnapshot}
          saving={saving}
          onEnableMinimal={() => void persistDayMode('minimal')}
          onMarkPlateau={() => void handleMarkPlateau()}
          onClearPlateau={() => void handleClearPlateau()}
          onDismissHint={() => void handleDismissPlateauHint()}
        />
      ) : null}

      {derived.dayEmpty && derived.recoveryState === 'normal' && derived.dayMode === 'normal' && (
        <p className="rounded-2xl border border-dashed border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-4 text-center text-sm text-[var(--app-text-muted)]">
          {derived.emptyCopy}
        </p>
      )}

      {!derived.dayEmpty && !isEditingToday && (
        <p className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-bg-soft)] px-4 py-3 text-center text-sm text-[var(--app-text-muted)]">
          Редактируешь записи за выбранный день. Не забудь сохранить ход.
        </p>
      )}
    </>
  );
}
