export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export type StatType = 'strength' | 'agility' | 'endurance' | 'vitality' | 'intelligence';

export interface HunterStats {
  strength: number;      // Force : Pompes, tractions, dips, muscle-ups
  agility: number;       // Agilité : Handstand, fluidité, tempo explosif
  endurance: number;     // Endurance : Volume de répétitions, gainage
  vitality: number;      // Vitalité : Récupération, résistance à la fatigue
  intelligence: number;  // Technique : Forme stricte, contrôle, mobilité
}

export interface HunterProfile {
  name: string;
  title: string;
  job: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  fatigue: number; // 0 à 100
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  availablePoints: number;
  rank: HunterRank;
  stats: HunterStats;
  statCyclicProgress: Record<StatType, number>; // 0 to 100%
}

export interface DailyQuestItem {
  id: string;
  title: string;
  subtitle: string;
  target: number;
  current: number;
  unit: string;
  category: 'push' | 'pull' | 'legs' | 'core';
  xpReward: number;
  statBonus: StatType;
}

export interface DailyQuestState {
  date: string;
  items: DailyQuestItem[];
  completed: boolean;
  rewardsClaimed: boolean;
  penaltyWarningDismissed: boolean;
}

export interface DungeonGate {
  id: string;
  rank: HunterRank;
  title: string;
  name: string;
  description: string;
  requiredLevel: number;
  timeLimitMinutes?: number;
  exercises: {
    id: string;
    name: string;
    sets: number;
    reps: string;
    restSec: number;
    tip: string;
  }[];
  rewards: {
    xp: number;
    statPoints: number;
    unlockedSkillId?: string;
    rewardText: string;
  };
  completed: boolean;
  bestTime?: string;
  isCustom?: boolean;
}

export interface SystemSkill {
  id: string;
  name: string;
  type: 'passive' | 'active';
  level: number;
  maxLevel: number;
  unlocked: boolean;
  requiredLevel: number;
  rank: HunterRank;
  description: string;
  bonus: string;
  manaCost?: number;
  cooldown?: string;
  calisthenicsCue: string;
}

export interface PersonalRecord {
  id: string;
  exercise: string;
  category: 'max_reps' | 'isometric_hold' | 'weighted' | 'technique';
  value: number;
  unit: string;
  date: string;
  notes?: string;
  history: { date: string; value: number }[];
}

export interface WorkoutSessionLog {
  id: string;
  date: string;
  title: string;
  summary: string;
  totalReps: number;
  durationMinutes: number;
  xpGained: number;
  statsAffected: StatType[];
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'levelup' | 'quest' | 'warning' | 'skill' | 'reward';
  timestamp: number;
}
