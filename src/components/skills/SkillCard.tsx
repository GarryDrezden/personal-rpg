import type { SkillProgress } from '../../types/skills';
import { getSkillRoadUi } from './skillUi';

type SkillCardProps = {
  skill: SkillProgress;
  compact?: boolean;
};

function SkillRoadProgressBar({
  value,
  barClass,
  className = 'h-1',
}: {
  value: number;
  barClass: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-full bg-[var(--app-bg-soft)]/50 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${barClass}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function SkillMedallion({
  skillId,
  compact,
}: {
  skillId: SkillProgress['id'];
  compact?: boolean;
}) {
  const road = getSkillRoadUi(skillId);
  const Icon = road.Icon;
  const size = compact ? 'h-10 w-10' : 'h-12 w-12 sm:h-14 sm:w-14';
  const iconSize = compact ? 'h-5 w-5' : 'h-6 w-6 sm:h-7 sm:w-7';

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center rounded-full border ${road.accentBorder} bg-gradient-to-br from-[#14101c]/95 via-[#0e0c16] to-[#08070f] ${size} ${road.accentGlow}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_38%,rgba(212,165,55,0.1),transparent_58%)]`}
        aria-hidden
      />
      <Icon className={`relative ${iconSize} ${road.accentIcon}`} strokeWidth={1.35} />
    </div>
  );
}

export function SkillCard({ skill, compact = false }: SkillCardProps) {
  const road = getSkillRoadUi(skill.id);

  if (compact) {
    return (
      <article
        className={`relative overflow-hidden rounded-xl border ${road.accentBorder} bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/92 to-[#08070f]/95 p-3 ${road.accentGlow}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${road.radialOverlay}`}
          aria-hidden
        />
        <div className="relative flex items-center gap-2.5">
          <SkillMedallion skillId={skill.id} compact />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-[var(--app-text)]">
                {skill.title}
              </span>
              <span className="shrink-0 rounded-full border border-violet-500/20 bg-[#14101c]/80 px-2 py-0.5 text-[10px] font-bold text-[var(--app-gold)]/90">
                Ур. {skill.level}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[10px] text-[var(--app-text-muted)]/60">
              {road.subtitle}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-[var(--app-text-muted)]">
              <span className="truncate">{skill.totalXp.toLocaleString('ru')} XP</span>
              <span className="shrink-0 text-[var(--app-text-muted)]/80">
                {skill.currentLevelXp} / {skill.nextLevelXp}
              </span>
            </div>
            <SkillRoadProgressBar
              value={skill.progressToNextLevel}
              barClass={road.accentBar}
              className="mt-1.5 h-1"
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border ${road.accentBorder} bg-gradient-to-br from-[#12101c]/95 via-[#0e0c16]/92 to-[#08070f]/95 p-4 ${road.accentGlow}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${road.radialOverlay}`}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--app-gold)]/15 to-transparent" />

      <div className="relative flex items-start gap-3">
        <SkillMedallion skillId={skill.id} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-[var(--app-text)]">{skill.title}</h3>
            <span className="rounded-full border border-violet-500/25 bg-[#14101c]/80 px-2 py-0.5 text-xs font-bold text-[var(--app-gold)]/90">
              Ур. {skill.level}
            </span>
            {skill.level >= 10 ? (
              <span className="rounded-full border border-[var(--app-gold)]/25 bg-[var(--app-primary-soft)]/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--app-gold)]/85">
                Мастер дороги
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11px] font-medium tracking-wide text-violet-200/45">
            {road.subtitle}
          </p>
          <p className="mt-1 text-xs leading-snug text-[var(--app-text-muted)]/75">
            {road.description}
          </p>
          <p className="mt-2 text-xs font-medium text-[var(--app-text-muted)]">
            {skill.totalXp.toLocaleString('ru')} XP на дороге
          </p>
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] text-[var(--app-text-muted)]/70">
              <span>До след. уровня</span>
              <span className="text-[var(--app-text-muted)]">
                {skill.currentLevelXp} / {skill.nextLevelXp}
              </span>
            </div>
            <SkillRoadProgressBar
              value={skill.progressToNextLevel}
              barClass={road.accentBar}
              className="h-1.5"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
