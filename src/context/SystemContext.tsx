import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  HunterProfile,
  DailyQuestState,
  DungeonGate,
  SystemSkill,
  PersonalRecord,
  WorkoutSessionLog,
  SystemNotification,
  StatType,
  HunterRank,
} from '../types/system';
import {
  INITIAL_HUNTER_PROFILE,
  getInitialDailyQuests,
  INITIAL_GATES,
  INITIAL_SKILLS,
  INITIAL_RECORDS,
  INITIAL_WORKOUT_LOGS,
} from '../data/initialData';
import { sounds } from '../utils/audio';

interface SystemContextType {
  profile: HunterProfile;
  quests: DailyQuestState;
  gates: DungeonGate[];
  skills: SystemSkill[];
  records: PersonalRecord[];
  workoutLogs: WorkoutSessionLog[];
  activeNotification: SystemNotification | null;
  soundEnabled: boolean;
  isRewardModalOpen: boolean;
  isPenaltyModalOpen: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  updateProfileName: (name: string) => void;
  updateProfileTitle: (title: string) => void;
  allocateStatPoint: (stat: StatType) => void;
  resetStats: () => void;
  recoverFatigue: () => void;
  addQuestProgress: (questId: string, amount: number) => void;
  claimQuestRewards: () => void;
  openRewardModal: () => void;
  closeRewardModal: () => void;
  openPenaltyModal: () => void;
  closePenaltyModal: () => void;
  completeGate: (gateId: string, timeSpent: string) => void;
  addCustomGate: (gateData: Omit<DungeonGate, 'id' | 'completed'>) => void;
  updateGate: (gateId: string, updatedGate: Partial<DungeonGate>) => void;
  deleteGate: (gateId: string) => void;
  upgradeSkill: (skillId: string) => void;
  unlockSkill: (skillId: string) => void;
  addRecord: (exercise: string, value: number, unit: string, category: PersonalRecord['category'], notes?: string) => void;
  addWorkoutLog: (title: string, reps: number, minutes: number, stats: StatType[]) => void;
  showNotification: (title: string, message: string, type?: SystemNotification['type']) => void;
  dismissNotification: () => void;
  resetAllData: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROFILE: 'solo_leveling_profile_v3',
  QUESTS: 'solo_leveling_quests_v3',
  GATES: 'solo_leveling_gates_v3',
  SKILLS: 'solo_leveling_skills_v3',
  RECORDS: 'solo_leveling_records_v3',
  LOGS: 'solo_leveling_logs_v3',
  SOUND: 'solo_leveling_sound_v3',
};

// Clear legacy test caches if present
if (typeof window !== 'undefined') {
  const legacyKeys = [
    'solo_leveling_profile_v1',
    'solo_leveling_quests_v1',
    'solo_leveling_gates_v1',
    'solo_leveling_skills_v1',
    'solo_leveling_records_v1',
    'solo_leveling_logs_v1',
    'solo_leveling_profile_v2',
    'solo_leveling_quests_v2',
    'solo_leveling_gates_v2',
    'solo_leveling_skills_v2',
    'solo_leveling_records_v2',
    'solo_leveling_logs_v2',
  ];
  legacyKeys.forEach((k) => localStorage.removeItem(k));
}

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [profile, setProfile] = useState<HunterProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_HUNTER_PROFILE;
  });

  const [quests, setQuests] = useState<DailyQuestState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.QUESTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const today = new Date().toISOString().split('T')[0];
        // If from another day, reset daily quest
        if (parsed.date === today) {
          return parsed;
        }
      } catch { /* ignore */ }
    }
    return getInitialDailyQuests();
  });

  const [gates, setGates] = useState<DungeonGate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GATES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_GATES;
  });

  const [skills, setSkills] = useState<SystemSkill[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_SKILLS;
  });

  const [records, setRecords] = useState<PersonalRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_RECORDS;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutSessionLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_WORKOUT_LOGS;
  });

  const [activeNotification, setActiveNotification] = useState<SystemNotification | null>(null);
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isPenaltyModalOpen, setIsPenaltyModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GATES, JSON.stringify(gates));
  }, [gates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(workoutLogs));
  }, [workoutLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    sounds.enabled = enabled;
  };

  const showNotification = (title: string, message: string, type: SystemNotification['type'] = 'system') => {
    const notif: SystemNotification = {
      id: String(Date.now()),
      title,
      message,
      type,
      timestamp: Date.now(),
    };
    setActiveNotification(notif);

    if (type === 'levelup') {
      sounds.playLevelUp();
    } else if (type === 'warning') {
      sounds.playWarningDrone();
    } else if (type === 'reward') {
      sounds.playRewardUnlock();
    } else {
      sounds.playHoloChime();
    }

    // Auto dismiss after 4.5 seconds
    setTimeout(() => {
      setActiveNotification((curr) => (curr?.id === notif.id ? null : curr));
    }, 4500);
  };

  const dismissNotification = () => {
    setActiveNotification(null);
  };

  // Check and grant XP with potential Level-Up
  const addXp = (amount: number) => {
    setProfile((prev) => {
      let currentXp = prev.xp + amount;
      let currentLevel = prev.level;
      let xpToNext = prev.xpToNextLevel;
      let pointsGained = 0;
      let leveledUp = false;

      while (currentXp >= xpToNext) {
        currentXp -= xpToNext;
        currentLevel += 1;
        xpToNext = Math.round(xpToNext * 1.25);
        pointsGained += 3;
        leveledUp = true;
      }

      if (leveledUp) {
        sounds.playLevelUp();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00d2ff', '#38bdf8', '#ffffff', '#818cf8'],
          });
        } catch { /* ignore */ }

        // Determine hunter rank upgrade
        let newRank: HunterRank = prev.rank;
        if (currentLevel >= 40) newRank = 'S';
        else if (currentLevel >= 30) newRank = 'A';
        else if (currentLevel >= 22) newRank = 'B';
        else if (currentLevel >= 15) newRank = 'C';
        else if (currentLevel >= 8) newRank = 'D';

        showNotification(
          'MONTÉE DE NIVEAU !',
          `Félicitations, vous avez atteint le Niveau ${currentLevel} ! +${pointsGained} Points de Caractéristique attribués.`,
          'levelup'
        );

        return {
          ...prev,
          level: currentLevel,
          xp: currentXp,
          xpToNextLevel: xpToNext,
          availablePoints: prev.availablePoints + pointsGained,
          rank: newRank,
          hp: Math.round(prev.hp * 1.08),
          maxHp: Math.round(prev.maxHp * 1.08),
          mp: Math.round(prev.mp * 1.05),
          maxMp: Math.round(prev.maxMp * 1.05),
        };
      }

      return {
        ...prev,
        xp: currentXp,
      };
    });
  };

  const updateProfileName = (name: string) => {
    setProfile((prev) => ({ ...prev, name }));
  };

  const updateProfileTitle = (title: string) => {
    setProfile((prev) => ({ ...prev, title }));
  };

  // Stat allocation
  const allocateStatPoint = (stat: StatType) => {
    if (profile.availablePoints <= 0) return;
    sounds.playStatUp();

    setProfile((prev) => {
      const nextPoints = prev.availablePoints - 1;
      const nextStatValue = prev.stats[stat] + 1;
      const nextCyclicProgress = Math.min(100, (prev.statCyclicProgress[stat] + 15) % 100);

      // Stat specific boosts
      let nextHp = prev.hp;
      let nextMaxHp = prev.maxHp;
      let nextMp = prev.mp;
      let nextMaxMp = prev.maxMp;

      if (stat === 'vitality') {
        nextMaxHp += 40;
        nextHp += 40;
      }
      if (stat === 'intelligence') {
        nextMaxMp += 25;
        nextMp += 25;
      }

      return {
        ...prev,
        availablePoints: nextPoints,
        stats: {
          ...prev.stats,
          [stat]: nextStatValue,
        },
        statCyclicProgress: {
          ...prev.statCyclicProgress,
          [stat]: nextCyclicProgress,
        },
        hp: nextHp,
        maxHp: nextMaxHp,
        mp: nextMp,
        maxMp: nextMaxMp,
      };
    });
  };

  const resetStats = () => {
    // Reset points allocated back to available
    setProfile((prev) => {
      const base = INITIAL_HUNTER_PROFILE.stats;
      const current = prev.stats;
      const reclaimed =
        (current.strength - base.strength) +
        (current.agility - base.agility) +
        (current.endurance - base.endurance) +
        (current.vitality - base.vitality) +
        (current.intelligence - base.intelligence);

      if (reclaimed <= 0) return prev;

      showNotification('RÉINITIALISATION', `${reclaimed} points de caractéristiques récupérés.`, 'system');

      return {
        ...prev,
        availablePoints: prev.availablePoints + reclaimed,
        stats: { ...base },
      };
    });
  };

  // Recovery
  const recoverFatigue = () => {
    sounds.playRewardUnlock();
    setProfile((prev) => ({
      ...prev,
      fatigue: 0,
      hp: prev.maxHp,
      mp: prev.maxMp,
    }));
    showNotification('RÉCUPÉRATION DU SYSTÈME', 'Fatigue réinitialisée à 0%. Points de vie et de mana restaurés à 100%.', 'reward');
  };

  // Daily quest item progress
  const addQuestProgress = (questId: string, amount: number) => {
    sounds.playCountBeep();
    setQuests((prev) => {
      let isAllCompleted = true;
      const nextItems = prev.items.map((item) => {
        if (item.id === questId) {
          const nextVal = Math.min(item.target, item.current + amount);
          return { ...item, current: nextVal };
        }
        return item;
      });

      nextItems.forEach((it) => {
        if (it.current < it.target) {
          isAllCompleted = false;
        }
      });

      // Advance stat cyclic progress for this exercise
      const targetItem = prev.items.find((i) => i.id === questId);
      if (targetItem) {
        setProfile((p) => {
          const curProg = p.statCyclicProgress[targetItem.statBonus];
          const newProg = curProg + 5;
          let bonusStat = p.stats[targetItem.statBonus];
          let remainder = newProg;
          if (newProg >= 100) {
            remainder = newProg - 100;
            bonusStat += 1;
            showNotification(
              'PROGRESSION CYCLIQUE',
              `Votre rigueur a renforcé votre caractéristique [${targetItem.statBonus.toUpperCase()}] (+1) !`,
              'system'
            );
          }
          return {
            ...p,
            fatigue: Math.min(100, p.fatigue + 2),
            stats: {
              ...p.stats,
              [targetItem.statBonus]: bonusStat,
            },
            statCyclicProgress: {
              ...p.statCyclicProgress,
              [targetItem.statBonus]: remainder,
            },
          };
        });
      }

      if (isAllCompleted && !prev.completed) {
        sounds.playLevelUp();
        showNotification(
          'QUÊTE QUOTIDIENNE ACCOMPLIE !',
          'Toutes les épreuves de renforcement sont terminées. Réclamez vos récompenses !',
          'quest'
        );
      }

      return {
        ...prev,
        items: nextItems,
        completed: isAllCompleted,
      };
    });
  };

  const claimQuestRewards = () => {
    if (!quests.completed || quests.rewardsClaimed) return;
    setIsRewardModalOpen(true);
    sounds.playRewardUnlock();
  };

  const openRewardModal = () => setIsRewardModalOpen(true);
  const closeRewardModal = () => {
    setIsRewardModalOpen(false);
    // Apply rewards: +3 Stat points, full recovery, +800 XP
    setQuests((prev) => ({ ...prev, rewardsClaimed: true }));
    setProfile((prev) => ({
      ...prev,
      fatigue: 0,
      hp: prev.maxHp,
      mp: prev.maxMp,
      availablePoints: prev.availablePoints + 3,
    }));
    addXp(850);
    showNotification(
      'RÉCOMPENSES REÇUES',
      'Rétablissement complet · +3 Points de Caractéristique · +850 XP reçus du Système.',
      'reward'
    );
  };

  const openPenaltyModal = () => {
    setIsPenaltyModalOpen(true);
    sounds.playWarningDrone();
  };

  const closePenaltyModal = () => {
    setIsPenaltyModalOpen(false);
  };

  // Complete Gate dungeon
  const completeGate = (gateId: string, timeSpent: string) => {
    setGates((prev) =>
      prev.map((g) => {
        if (g.id === gateId) {
          return { ...g, completed: true, bestTime: timeSpent };
        }
        return g;
      })
    );

    const targetGate = gates.find((g) => g.id === gateId);
    if (targetGate) {
      addXp(targetGate.rewards.xp);
      setProfile((p) => ({
        ...p,
        availablePoints: p.availablePoints + targetGate.rewards.statPoints,
        fatigue: Math.min(100, p.fatigue + 18),
      }));

      if (targetGate.rewards.unlockedSkillId) {
        unlockSkill(targetGate.rewards.unlockedSkillId);
      }

      showNotification(
        `PORTAIL VAINCU : ${targetGate.title}`,
        `${targetGate.rewards.rewardText} obtenus avec succès en ${timeSpent} !`,
        'reward'
      );
    }
  };

  // Custom Gate Management (User's Workout Program)
  const addCustomGate = (gateData: Omit<DungeonGate, 'id' | 'completed'>) => {
    const newGate: DungeonGate = {
      ...gateData,
      id: `gate-custom-${Date.now()}`,
      completed: false,
      isCustom: true,
    };
    setGates((prev) => [newGate, ...prev]);
    sounds.playLevelUp();
    showNotification(
      'NOUVEAU PROGRAMME FORGÉ',
      `Le portail [${newGate.name}] a été matérialisé selon votre programme d'entraînement !`,
      'reward'
    );
  };

  const updateGate = (gateId: string, updatedGate: Partial<DungeonGate>) => {
    setGates((prev) =>
      prev.map((g) => (g.id === gateId ? { ...g, ...updatedGate } : g))
    );
    sounds.playHoloChime();
    showNotification('PORTAIL MIS À JOUR', 'Les exercices et consignes du programme ont été modifiés.', 'system');
  };

  const deleteGate = (gateId: string) => {
    setGates((prev) => prev.filter((g) => g.id !== gateId));
    sounds.playHoloChime();
    showNotification('PORTAIL DISSIPÉ', 'Le défi personnalisé a été retiré de la matrice.', 'system');
  };

  // Skill management
  const upgradeSkill = (skillId: string) => {
    sounds.playStatUp();
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId && s.level < s.maxLevel) {
          showNotification('COMPÉTENCE AMÉLIORÉE', `[${s.name}] est désormais au Niveau ${s.level + 1} !`, 'skill');
          return { ...s, level: s.level + 1 };
        }
        return s;
      })
    );
  };

  const unlockSkill = (skillId: string) => {
    sounds.playLevelUp();
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === skillId) {
          showNotification('NOUVELLE COMPÉTENCE DÉVERROUILLÉE', `Vous avez éveillé : [${s.name}] !`, 'skill');
          return { ...s, unlocked: true, level: Math.max(1, s.level) };
        }
        return s;
      })
    );
  };

  // Records & PRs
  const addRecord = (
    exercise: string,
    value: number,
    unit: string,
    category: PersonalRecord['category'],
    notes?: string
  ) => {
    const todayStr = 'Aujourd\'hui';
    sounds.playLevelUp();

    setRecords((prev) => {
      const existingIdx = prev.findIndex((r) => r.exercise.toLowerCase() === exercise.toLowerCase());
      if (existingIdx !== -1) {
        const old = prev[existingIdx];
        const isBetter = value > old.value;
        const updatedList = [...prev];
        updatedList[existingIdx] = {
          ...old,
          value: isBetter ? value : old.value,
          date: todayStr,
          notes: notes || old.notes,
          history: [...old.history, { date: todayStr, value }],
        };
        showNotification(
          isBetter ? 'NOUVEAU RECORD PERSONNEL !' : 'ENTRÉE ENREGISTRÉE',
          `${exercise} : ${value} ${unit} enregistré ! (+150 XP)`,
          'reward'
        );
        addXp(150);
        return updatedList;
      } else {
        const newRecord: PersonalRecord = {
          id: `pr-${Date.now()}`,
          exercise,
          value,
          unit,
          category,
          date: todayStr,
          notes,
          history: [{ date: todayStr, value }],
        };
        showNotification('NOUVEAU RECORD AJOUTÉ', `${exercise} : ${value} ${unit} ! (+200 XP)`, 'reward');
        addXp(200);
        return [newRecord, ...prev];
      }
    });
  };

  // Workout Session Logs
  const addWorkoutLog = (title: string, reps: number, minutes: number, statsAffected: StatType[]) => {
    const newLog: WorkoutSessionLog = {
      id: `log-${Date.now()}`,
      date: 'Aujourd\'hui',
      title,
      summary: `${reps} répétitions totales en ${minutes} minutes`,
      totalReps: reps,
      durationMinutes: minutes,
      xpGained: reps * 4,
      statsAffected,
    };
    setWorkoutLogs((prev) => [newLog, ...prev]);
    addXp(reps * 4);
    showNotification('SÉANCE ENREGISTRÉE', `Entraînement "${title}" consigné. +${reps * 4} XP !`, 'system');
  };

  const resetAllData = () => {
    localStorage.clear();
    setProfile(INITIAL_HUNTER_PROFILE);
    setQuests(getInitialDailyQuests());
    setGates(INITIAL_GATES);
    setSkills(INITIAL_SKILLS);
    setRecords(INITIAL_RECORDS);
    setWorkoutLogs(INITIAL_WORKOUT_LOGS);
    showNotification('DONNÉES RÉINITIALISÉES', 'Le Système a réinitialisé votre matrice temporelle.', 'system');
  };

  return (
    <SystemContext.Provider
      value={{
        profile,
        quests,
        gates,
        skills,
        records,
        workoutLogs,
        activeNotification,
        soundEnabled,
        isRewardModalOpen,
        isPenaltyModalOpen,
        setSoundEnabled,
        updateProfileName,
        updateProfileTitle,
        allocateStatPoint,
        resetStats,
        recoverFatigue,
        addQuestProgress,
        claimQuestRewards,
        openRewardModal,
        closeRewardModal,
        openPenaltyModal,
        closePenaltyModal,
        completeGate,
        addCustomGate,
        updateGate,
        deleteGate,
        upgradeSkill,
        unlockSkill,
        addRecord,
        addWorkoutLog,
        showNotification,
        dismissNotification,
        resetAllData,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
