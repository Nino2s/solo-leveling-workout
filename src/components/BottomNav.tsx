import React from 'react';
import { User, CheckSquare, Swords, Zap, Trophy } from 'lucide-react';
import { sounds } from '../utils/audio';

export type NavTab = 'status' | 'quests' | 'gates' | 'skills' | 'records';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unclaimedQuests: boolean;
  availablePoints: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unclaimedQuests,
  availablePoints,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: boolean }[] = [
    {
      id: 'status',
      label: 'STATUT',
      icon: <User size={19} />,
      badge: availablePoints > 0,
    },
    {
      id: 'quests',
      label: 'QUÊTES',
      icon: <CheckSquare size={19} />,
      badge: unclaimedQuests,
    },
    {
      id: 'gates',
      label: 'PORTAILS',
      icon: <Swords size={19} />,
    },
    {
      id: 'skills',
      label: 'POUVOIRS',
      icon: <Zap size={19} />,
    },
    {
      id: 'records',
      label: 'RECORDS',
      icon: <Trophy size={19} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#040914]/95 backdrop-blur-md border-t border-cyan-500/25">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (currentTab !== tab.id) {
                  sounds.playCountBeep();
                  onTabChange(tab.id);
                }
              }}
              className={`relative min-h-[48px] flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active top indicator line */}
              {isActive && (
                <div className="absolute top-0 w-8 h-[2px] bg-cyan-400 shadow-[0_0_8px_#00d2ff]" />
              )}

              {/* Icon with potential notification badge */}
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 border border-[#040914] shadow-[0_0_6px_#00d2ff] animate-pulse" />
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-wider mt-1 font-system ${
                  isActive ? 'text-cyan-300 text-glow-cyan' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
