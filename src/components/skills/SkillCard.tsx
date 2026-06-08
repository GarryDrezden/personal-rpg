import type { SkillProgress, SkillId } from '../../types/skills';
import { SKILL_BY_ID } from '../../constants/skills';
import { useAppTheme } from '../../hooks/useAppTheme';
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

const DARK_SKILL_BG: Record<SkillId, string> = {
  body: 'color-mix(in srgb, #ef4444 14%, var(--app-card))',
  control: 'color-mix(in srgb, #3b82f6 14%, var(--app-card))',
  clarity: 'color-mix(in srgb, #6366f1 14%, var(--app-card))',
  home: 'color-mix(in srgb, #f59e0b 14%, var(--app-card))',
  green: 'color-mix(in srgb, #10b981 14%, var(--app-card))',
  joy: 'color-mix(in srgb, #a855f7 14%, var(--app-card))',
};

const DARK_SKILL_ACCENT: Record<SkillId, string> = {
  body: 'text-red-400',
  control: 'text-blue-400',
  clarity: 'text-indigo-400',
  home: 'text-amber-400',
  green: 'text-emerald-400',
  joy: 'text-purple-400',
};

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const { isDarkFantasy } = useAppTheme();
  const def = SKILL_BY_ID[skill.id];
  const progressColor = PROGRESS_COLORS[skill.id] ?? 'gold';

  const titleClass = isDarkFantasy ? DARK_SKILL_ACCENT[skill.id] : def.colorClass;
  const levelBadgeClass = 'bg-[var(--app-card-strong)] text-[var(--app-text)]';

  const cardClass = compact ? 'p-3' : 'p-4';
  const cozyCard = `rounded-2xl border border-white/70 bg-gradient-to-br ${def.gradientClass} ${cardClass} shadow-sm`;
  const darkCard = `rounded-2xl border border-[var(--app-border)] ${cardClass}`;

  const cardStyle = isDarkFantasy ? { background: DARK_SKILL_BG[skill.id] } : undefined;

  if (compact) {
    return (
      <div className={isDarkFantasy ? darkCard : cozyCard} style={cardStyle}>
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xl shadow-inner ring-2 ${
              isDarkFantasy
                ? 'bg-[var(--app-bg-soft)] ring-[var(--app-border)]'
                : `bg-gradient-to-br ${def.gradientClass} ring-white/80`
            }`}
          >
            {skill.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className={`truncate text-sm font-semibold ${titleClass}`}>{skill.title}</span>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${levelBadgeClass}`}
              >
                Ур. {skill.level}
              </span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-[var(--app-text-muted)]">
              <span className="truncate">{skill.totalXp.toLocaleString('ru')} XP</span>
              <span className="shrink-0 text-[var(--app-text)]">
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
    <div className={isDarkFantasy ? darkCard : cozyCard} style={cardStyle}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl shadow-inner ring-2 ${
            isDarkFantasy
              ? 'bg-[var(--app-bg-soft)] ring-[var(--app-border)]'
              : `bg-gradient-to-br ${def.gradientClass} ring-white/80`
          }`}
        >
          {skill.icon}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`font-semibold ${titleClass}`}>{skill.title}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-bold shadow-sm ${levelBadgeClass}`}
            >
              Ур. {skill.level}
            </span>
            {skill.level >= 10 && (
              <span className="rounded-full bg-[var(--app-primary-soft)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--app-primary)]">
                Прокачан
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[var(--app-text-muted)]">{skill.description}</p>
          <p className="mt-1 text-xs font-medium text-[var(--app-text)]">
            {skill.totalXp.toLocaleString('ru')} XP всего
          </p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] text-[var(--app-text-muted)]">
              <span>До след. уровня</span>
              <span className="text-[var(--app-text)]">
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
