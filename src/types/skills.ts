export type SkillId =
  | 'body'
  | 'control'
  | 'clarity'
  | 'home'
  | 'green'
  | 'joy';

export type SkillDefinition = {
  id: SkillId;
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  gradientClass: string;
};

export type SkillProgress = {
  id: SkillId;
  title: string;
  description: string;
  icon: string;
  level: number;
  totalXp: number;
  currentLevelXp: number;
  nextLevelXp: number;
  progressToNextLevel: number;
};
