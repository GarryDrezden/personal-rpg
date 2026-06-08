import { useMemo } from 'react';
import { useAppStore } from '../store/appStore';
import { calcAllSkillProgress, getSkillsSummary } from '../utils/skillEngine';
import { SKILLS, SKILL_LEVEL_HOW_TO } from '../constants/skills';
import { SkillCard } from '../components/skills/SkillCard';
import { Card } from '../components/ui/Card';

export function SkillsPage() {
  const { dailyEntries, measurements, settings } = useAppStore();

  const skills = useMemo(
    () => calcAllSkillProgress(dailyEntries, measurements, settings),
    [dailyEntries, measurements, settings],
  );

  const ordered = SKILLS.map((def) => skills.find((s) => s.id === def.id)!);
  const { totalLevels, strongest, weakest, hasAnyXp } = getSkillsSummary(skills);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-[var(--app-text)]">Навыки персонажа</h1>
        <p className="mt-1 text-sm text-[var(--app-text-muted)]">
          Каждое действие прокачивает одну из сторон режима.
        </p>
      </header>

      <Card className="bg-[color-mix(in_srgb,var(--app-primary)_8%,var(--app-card))]">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-[var(--app-text-muted)]">Сумма уровней</p>
            <p className="text-2xl font-bold text-[var(--app-primary)]">{totalLevels}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--app-text-muted)]">Самый прокачанный</p>
            <p className="text-lg font-semibold text-[var(--app-text)]">
              {hasAnyXp ? `${strongest.icon} ${strongest.title}` : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--app-text-muted)]">Самый слабый</p>
            <p className="text-lg font-semibold text-[var(--app-text)]">
              {hasAnyXp ? `${weakest.icon} ${weakest.title}` : '—'}
            </p>
          </div>
        </div>
        {!hasAnyXp && (
          <p className="mt-4 text-sm text-[var(--app-text-muted)]">
            Навыки начнут расти после первых записей.
          </p>
        )}
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {ordered.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold text-[var(--app-text)]">Как качаются навыки</h2>
        <ul className="space-y-2">
          {SKILL_LEVEL_HOW_TO.map(({ skill, actions }) => (
            <li key={skill} className="flex gap-2 text-sm">
              <span className="min-w-[5.5rem] font-semibold text-[var(--app-text)]">{skill}:</span>
              <span className="text-[var(--app-text-muted)]">{actions}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
