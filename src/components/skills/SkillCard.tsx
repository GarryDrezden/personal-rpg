import type { SkillProgress } from '../../types/skills';
import { SKILL_BY_ID } from '../../constants/skills';
import { ProgressBar } from '../ui/ProgressBar';

type SkillCardProps = {
  skill: SkillProgress;
  compact?: boolean;
};

const PROGRESS_COLORS: Record<string, 'gold' | 'success'> = {
  body: 'success',
  control: 'gold',
  clarity: 'gold',
  home: 'gold',
  green: 'success',
  joy: 'gold',
};

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const def = SKILL_BY_ID[skill.id];
  const progressColor = PROGRESS_COLORS[skill.id] ?? 'gold';

  if (compact) {
    return (
      <div
        className={`rounded-2xl border border-white/70 bg-gradient-to-br ${def.gradientClass} p-3 shadow-sm`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${def.gradientClass} text-xl shadow-inner ring-2 ring-white/80`}
          >
            {skill.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`truncate text-sm font-semibold ${def.colorClass}`}>
                {skill.title}
              </span>
              <span className="shrink-0 rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-stone-700">
                Ур. {skill.level}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-rpg-muted">
              <span className="truncate">{skill.totalXp.toLocaleString('ru')} XP</span>
              <span className="shrink-0">
                {skill.currentLevelXp} / {skill.nextLevelXp}
              </span>
            </div>
            <ProgressBar
              value={skill.progressToNextLevel}
              color={progressColor}
              className="mt-1.5 h-1.5"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-white/70 bg-gradient-to-br ${def.gradientClass} p-4 shadow-sm`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${def.gradientClass} text-2xl shadow-inner ring-2 ring-white/80`}
        >
          {skill.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold ${def.colorClass}`}>{skill.title}</h3>
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-bold text-stone-700 shadow-sm">
              Ур. {skill.level}
            </span>
            {skill.level >= 10 && (
              <span className="rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-900">
                Прокачан
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-rpg-muted">{skill.description}</p>
          <p className="mt-1 text-xs font-medium text-stone-600">
            {skill.totalXp.toLocaleString('ru')} XP всего
          </p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] text-rpg-muted">
              <span>До след. уровня</span>
              <span>
                {skill.currentLevelXp} / {skill.nextLevelXp}
              </span>
            </div>
            <ProgressBar
              value={skill.progressToNextLevel}
              color={progressColor}
              className="h-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
