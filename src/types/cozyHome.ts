export type CozyHomeZoneId =
  | 'porch'
  | 'hallway'
  | 'kitchen'
  | 'bedroom'
  | 'yard'
  | 'garden'
  | 'workshop'
  | 'pet_corner';

export type CozyResourceId = 'comfort' | 'materials' | 'garden' | 'clarity';

export type CozyHomeZoneCategory = 'house' | 'yard' | 'garden' | 'companion';

export interface CozyHomeUpgradeLevel {
  level: number;
  title: string;
  description: string;
  cost?: Partial<Record<CozyResourceId, number>>;
}

export interface CozyHomeZoneConfig {
  id: CozyHomeZoneId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  category: CozyHomeZoneCategory;
  levels: CozyHomeUpgradeLevel[];
}

export interface CozyHomeZoneState {
  zoneId: CozyHomeZoneId;
  level: number;
  unlockedAt?: string | null;
  upgradedAt?: string | null;
}

export interface CozyHomeState {
  resources: Record<CozyResourceId, number>;
  zones: Record<CozyHomeZoneId, CozyHomeZoneState>;
  totalUpgrades: number;
  lastUpdatedAt?: string | null;
  lastUpgrade?: {
    zoneId: CozyHomeZoneId;
    level: number;
    title: string;
    at: string;
  } | null;
}

export type CozyRewardsGranted = {
  resources: Partial<Record<CozyResourceId, number>>;
  grantedAt: string;
  reasons?: string[];
};
