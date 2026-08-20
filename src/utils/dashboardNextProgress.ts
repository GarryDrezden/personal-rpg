import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';
import type { AppThemeId } from '../types/theme';
import type { JourneyMapSummary } from '../types/journeyMap';
import type { SeasonSnapshot } from '../game/seasons/seasonTypes';
import { getPersonalBodyAbilitySummary } from './bodyAbilityPersonalEngine';
import {
  formatMissingResources,
  getCozyHomeProgress,
  getCozyHomeState,
  getNextCozyHomeUpgrade,
} from './cozyHomeEngine';
import { getIncompleteConditions } from './journeyMapEngine';
import { pickNbaCopy } from '../content/nbaCopy';
import { pickLongProjectLine } from '../content/homeStatus';

export type DashboardNextKind =
  | 'ability_confirm'
  | 'home_upgrade'
  | 'season_near'
  | 'body_stage_near'
  | 'home_missing'
  | 'journey_milestone';

export type DashboardNextProgress = {
  id: string;
  kind: DashboardNextKind;
  title: string;
  description: string;
  actionLabel: string;
  targetRoute: string;
};

const VISUAL_ANCHORS = [5, 10, 15, 20] as const;

export function isSeasonNearCompletion(season: SeasonSnapshot): boolean {
  const total = season.quests.length;
  if (total <= 0) return false;
  if (season.completedQuestCount >= Math.ceil(total * 0.75)) return true;
  return season.questsNearCompletion >= 1 && season.completedQuestCount >= Math.ceil(total / 2);
}

function nextVisualAnchor(bodyStage: number): number | null {
  return VISUAL_ANCHORS.find((anchor) => anchor > bodyStage) ?? null;
}

/**
 * One medium-horizon NEXT for Dashboard. Today CTA stays in NOW
 * (`getNextBestAction`); this resolver does not replace it.
 */
export function getDashboardNextProgress(params: {
  themeId: AppThemeId;
  settings: AppSettings;
  dailyEntries: DailyEntry[];
  measurements: MeasurementEntry[];
  season: SeasonSnapshot;
  journeySummary: JourneyMapSummary;
  bodyStage: number;
  today?: string;
}): DashboardNextProgress | null {
  const { themeId, settings, season, journeySummary, bodyStage } = params;
  const isCozy = themeId === 'cozy';
  const today = params.today ?? season.seasonStartDate;

  const ability = getPersonalBodyAbilitySummary(settings);
  if (ability.configured && ability.nextSuggested) {
    return {
      id: `ability_${ability.nextSuggested.id}`,
      kind: 'ability_confirm',
      title: 'Можно проверить',
      description: `Можно проверить: ${ability.nextSuggested.title}`,
      actionLabel: 'Способности',
      targetRoute: '/growth/abilities',
    };
  }

  if (isCozy) {
    const home = getCozyHomeState(settings);
    const progress = getCozyHomeProgress(home);
    if (progress.done < progress.total) {
      const next = getNextCozyHomeUpgrade(home);
      if (next?.canUpgrade) {
        return {
          id: `home_upgrade_${next.zoneId}_${next.nextLevel}`,
          kind: 'home_upgrade',
          title: `Можно улучшить: ${next.zoneTitle}`,
          description: next.isLongProject
            ? `${next.nextDescription} ${pickLongProjectLine(today, next.zoneId)}`
            : next.nextDescription,
          actionLabel: 'Открыть дом',
          targetRoute: '/home',
        };
      }
    }
  }

  if (isSeasonNearCompletion(season)) {
    const total = Math.max(1, season.quests.length);
    return {
      id: `season_near_${season.seasonIndex}`,
      kind: 'season_near',
      title: isCozy ? 'Сезон почти собран' : 'Сезон почти закрыт',
      description: `${pickNbaCopy({ family: 'season_close', themeId, date: today })} Задач сезона: ${season.completedQuestCount} из ${total}.`,
      actionLabel: isCozy ? 'Дневник сезона' : 'Летопись',
      targetRoute: '/seasons',
    };
  }

  const anchor = nextVisualAnchor(bodyStage);
  if (anchor != null && anchor - bodyStage <= 1) {
    return {
      id: `body_stage_${anchor}`,
      kind: 'body_stage_near',
      title: 'Ближе визуальный якорь',
      description: `Стадия тела ${bodyStage} из 20 — следующий якорь ${anchor}.`,
      actionLabel: 'Свобода тела',
      targetRoute: '/freedom',
    };
  }

  if (isCozy) {
    const next = getNextCozyHomeUpgrade(getCozyHomeState(settings));
    if (next && !next.canUpgrade) {
      const missing = formatMissingResources(next.missingResources);
      return {
        id: `home_missing_${next.zoneId}_${next.nextLevel}`,
        kind: 'home_missing',
        title: `До восстановления «${next.zoneTitle}»`,
        description: missing
          ? `До восстановления «${next.zoneTitle}» не хватает ${missing}.`
          : next.nextDescription,
        actionLabel: 'Открыть дом',
        targetRoute: '/home',
      };
    }
  }

  const current = journeySummary.currentStage;
  if (current && current.status !== 'completed') {
    const incomplete = getIncompleteConditions(current, 1)[0];
    return {
      id: `journey_${current.stage.id}`,
      kind: 'journey_milestone',
      title: `Глава ${current.stage.order} из ${journeySummary.totalStages}`,
      description: incomplete ? incomplete.condition.title : current.stage.subtitle,
      actionLabel: 'Открыть карту',
      targetRoute: '/journey',
    };
  }

  return null;
}
