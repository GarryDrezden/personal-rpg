import type { SkillId } from '../../types/skills';
import { getSkillRoadUi } from './skillUi';

export function SkillRoadInlineIcon({
  skillId,
  className = 'h-4 w-4',
}: {
  skillId: SkillId;
  className?: string;
}) {
  const road = getSkillRoadUi(skillId);
  const Icon = road.Icon;
  return <Icon className={`shrink-0 ${road.accentIcon} ${className}`} strokeWidth={1.5} />;
}
