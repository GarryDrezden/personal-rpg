import { Link } from 'react-router-dom';
import type { SkillProgress } from '../../types/skills';
import { SKILLS } from '../../constants/skills';
import { getSkillsSummary } from '../../utils/skillEngine';
import { SkillCard } from './SkillCard';
import { Card } from '../ui/Card';
import { Sparkles } from 'lucide-react';

type SkillsOverviewCardProps = {
  skills: SkillProgress[];
};

export function SkillsOverviewCard({ skills }: SkillsOverviewCardProps) {
  const ordered = SKILLS.map((def) => skills.find((s) => s.id === def.id)!);
  const { hasAnyXp, strongest } = getSkillsSummary(skills);
  const totalSkillXp = skills.reduce((sum, sk) => sum + sk.totalXp, 0);

  return (
    <Card className="bg-gradient-to-br from-stone-50 to-white">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <Sparkles className="mt-0.5 shrink-0 text-gold" size={22} />
          <div>
            <h2 className="text-lg font-semibold">Навыки персонажа</h2>
            <p className="text-sm text-rpg-muted">
              {totalSkillXp.toLocaleString('ru')} XP навыков
              {hasAnyXp && strongest && (
                <> · лидер: {strongest.title}</>
              )}
            </p>
          </div>
        </div>
        <Link to="/skills" className="shrink-0 text-sm font-medium text-gold hover:underline">
          Все навыки →
        </Link>
      </div>

      {!hasAnyXp && (
        <p className="mb-3 rounded-xl border border-dashed border-rpg-border bg-stone-50 px-4 py-3 text-center text-sm text-rpg-muted">
          Навыки начнут расти после первых записей.
        </p>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {ordered.map((skill) => (
          <SkillCard key={skill.id} skill={skill} compact />
        ))}
      </div>
    </Card>
  );
}
