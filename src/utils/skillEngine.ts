import type { AppSettings, DailyEntry, MeasurementEntry } from '../types';

import type { SkillId, SkillProgress } from '../types/skills';

import { SKILLS, SKILL_XP_AWARDS } from '../constants/skills';

import { isNoAlcohol } from './achievementEngine';
import {
  getNutritionCoinEligible,
  getNutritionQuestCompleted,
  isNutritionLogged,
  isNutritionTrackingEnabled,
} from './nutritionEngine';

import { isMinimalDayCompleted } from './recoveryEngine';

import { getDayMode, getStepsStatus } from './stepsEngine';

import { isMonday } from './dates';



const INITIAL_THRESHOLDS = [0, 100, 250, 450, 700];



function buildSkillThresholds(maxLevel = 50): number[] {

  const thresholds = [...INITIAL_THRESHOLDS];

  let lastDelta = thresholds[4] - thresholds[3];



  for (let level = 5; thresholds.length <= maxLevel; level++) {

    lastDelta = lastDelta + level * 150;

    thresholds.push(thresholds[thresholds.length - 1] + lastDelta);

  }

  return thresholds;

}



const SKILL_THRESHOLDS = buildSkillThresholds();



export function getSkillLevelFromXp(totalXp: number): {

  level: number;

  currentLevelXp: number;

  nextLevelXp: number;

  progressToNextLevel: number;

} {

  const xp = Math.max(0, totalXp);

  let level = 1;



  for (let i = 1; i < SKILL_THRESHOLDS.length; i++) {

    if (xp >= SKILL_THRESHOLDS[i]) level = i + 1;

    else break;

  }



  const xpForCurrentLevel = SKILL_THRESHOLDS[level - 1] ?? 0;

  const xpForNextLevel =

    SKILL_THRESHOLDS[level] ?? SKILL_THRESHOLDS[SKILL_THRESHOLDS.length - 1] + level * 150;

  const range = xpForNextLevel - xpForCurrentLevel;

  const currentLevelXp = xp - xpForCurrentLevel;

  const progressToNextLevel =

    range > 0 ? Math.min(100, Math.max(0, (currentLevelXp / range) * 100)) : 100;



  return {

    level,

    currentLevelXp,

    nextLevelXp: range,

    progressToNextLevel,

  };

}



function emptySkillTotals(): Record<SkillId, number> {

  return { body: 0, control: 0, clarity: 0, home: 0, green: 0, joy: 0 };

}



export function calcSkillXpFromDailyEntry(

  entry: DailyEntry,

  settings: AppSettings,

): Record<SkillId, number> {

  const xp = emptySkillTotals();

  const a = SKILL_XP_AWARDS;

  const stepsInfo = getStepsStatus({

    steps: entry.steps,

    settings,

    date: entry.date,

    dayMode: entry.dayMode,

  });



  if (stepsInfo.status === 'excellent') xp.body += a.stepsExcellent;

  else if (stepsInfo.status === 'normal') xp.body += a.stepsNormal;

  else if (stepsInfo.status === 'minimum') xp.body += a.stepsMinimum;



  if (entry.gym) xp.body += a.gym;

  if (entry.morningExercise) xp.body += a.morningExercise;



  if (isNutritionTrackingEnabled(settings)) {
    if (getNutritionQuestCompleted({ entry, settings })) {
      xp.control += a.caloriesLogged;
    }
    if (getNutritionCoinEligible({ entry, settings })) {
      xp.control += a.caloriesOk;
    }
  }



  if (isNoAlcohol(entry)) xp.clarity += a.noAlcohol;

  if (entry.journal) xp.clarity += a.journal;



  const mode = getDayMode(entry.dayMode);

  if ((mode === 'recovery' || mode === 'minimal') && isNoAlcohol(entry)) {

    xp.clarity += a.recoveryClarity;

  }



  if (isMinimalDayCompleted({ todayEntry: entry, settings })) {

    xp.control += a.minimalControl;

  } else if (mode === 'recovery' && isNutritionLogged({ entry, settings: settings }) && isNoAlcohol(entry)) {

    xp.control += a.recoveryControl;

  }



  if (entry.cooking) xp.home += a.cooking;

  if (entry.repair) xp.home += a.repair;



  if (entry.plants) xp.green += a.plants;



  if (entry.hobby) xp.joy += a.hobby;



  return xp;

}



export function calcSkillXpFromMeasurement(m: MeasurementEntry): Record<SkillId, number> {

  const xp = emptySkillTotals();

  const a = SKILL_XP_AWARDS;



  if (m.weight !== null && m.weight > 0) xp.control += a.weightLogged;

  if (m.waist !== null && m.waist > 0) xp.control += a.waistLogged;

  if (isMonday(m.date)) xp.control += a.mondayMeasurement;



  return xp;

}



export function calcTotalSkillXp(

  dailyEntries: DailyEntry[],

  measurements: MeasurementEntry[],

  settings: AppSettings,

): Record<SkillId, number> {

  const totals = emptySkillTotals();



  for (const entry of dailyEntries) {

    const dayXp = calcSkillXpFromDailyEntry(entry, settings);

    for (const id of Object.keys(dayXp) as SkillId[]) {

      totals[id] += dayXp[id];

    }

  }



  for (const m of measurements) {

    const mXp = calcSkillXpFromMeasurement(m);

    for (const id of Object.keys(mXp) as SkillId[]) {

      totals[id] += mXp[id];

    }

  }



  return totals;

}



export function calcAllSkillProgress(

  dailyEntries: DailyEntry[],

  measurements: MeasurementEntry[],

  settings: AppSettings,

): SkillProgress[] {

  const totals = calcTotalSkillXp(dailyEntries, measurements, settings);



  return SKILLS.map((def) => {

    const totalXp = totals[def.id];

    const { level, currentLevelXp, nextLevelXp, progressToNextLevel } =

      getSkillLevelFromXp(totalXp);



    return {

      id: def.id,

      title: def.title,

      description: def.description,

      icon: def.icon,

      level,

      totalXp,

      currentLevelXp,

      nextLevelXp,

      progressToNextLevel,

    };

  });

}



export function getSkillsSummary(skills: SkillProgress[]) {

  const totalLevels = skills.reduce((s, sk) => s + sk.level, 0);

  const sorted = [...skills].sort((a, b) => b.totalXp - a.totalXp);

  const strongest = sorted[0];

  const weakest = [...skills].sort((a, b) => a.totalXp - b.totalXp)[0];

  const hasAnyXp = skills.some((s) => s.totalXp > 0);



  return { totalLevels, strongest, weakest, hasAnyXp };

}


