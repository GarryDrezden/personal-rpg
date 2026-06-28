import { HeroScenePanel } from './HeroScenePanel';

type GameHeroPanelProps = {
  level: number;
  totalXp: number;
  todayPoints: number;
  todayCoins: number;
  availableCoins: number;
};

/** @deprecated Use HeroScenePanel — kept for backwards compatibility */
export function GameHeroPanel(props: GameHeroPanelProps) {
  return <HeroScenePanel {...props} />;
}
