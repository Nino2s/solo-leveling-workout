import React, { useState } from 'react';
import { SystemProvider, useSystem } from './context/SystemContext';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { StatusScreen } from './components/StatusScreen';
import { QuestsScreen } from './components/QuestsScreen';
import { GatesScreen } from './components/GatesScreen';
import { SkillsScreen } from './components/SkillsScreen';
import { RecordsScreen } from './components/RecordsScreen';
import { NotificationOverlay } from './components/NotificationOverlay';
import { RewardModal } from './components/RewardModal';
import { PenaltyModal } from './components/PenaltyModal';
import { RestTimerBar } from './components/RestTimerBar';
import { RotateCcw } from 'lucide-react';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('status');
  const { profile, quests, resetAllData } = useSystem();

  const unclaimedQuests = quests.completed && !quests.rewardsClaimed;

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col items-center justify-start relative overflow-x-hidden">
      {/* Background Ambient Atmospheric Light Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
        <div className="absolute -bottom-20 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(rgba(0, 210, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Main Mobile Shell (max-w-md centered) */}
      <div className="w-full max-w-md flex flex-col min-h-screen relative z-10 border-x border-cyan-500/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Top App Header */}
        <Header />

        {/* Global Floating Notifications */}
        <NotificationOverlay />

        {/* Active Tab Screen Content */}
        <main className="flex-1 px-4 pt-3 pb-24 overflow-y-auto">
          {currentTab === 'status' && <StatusScreen />}
          {currentTab === 'quests' && <QuestsScreen />}
          {currentTab === 'gates' && <GatesScreen />}
          {currentTab === 'skills' && <SkillsScreen />}
          {currentTab === 'records' && <RecordsScreen />}

          {/* Quick Footer Options */}
          <div className="mt-8 pt-4 border-t border-cyan-500/10 flex items-center justify-between text-[11px] text-slate-500 font-mono-tech px-1">
            <span>SYSTÈME CALISTHÉNIE v2.0</span>
            <button
              onClick={() => {
                if (window.confirm('Voulez-vous réinitialiser toutes vos données de chasseur ?')) {
                  resetAllData();
                }
              }}
              className="hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={11} /> Réinitialiser le profil
            </button>
          </div>
        </main>

        {/* Modals & Overlays */}
        <RewardModal />
        <PenaltyModal />
        <RestTimerBar />

        {/* Fixed Mobile Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onTabChange={setCurrentTab}
          unclaimedQuests={unclaimedQuests}
          availablePoints={profile.availablePoints}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <SystemProvider>
      <AppContent />
    </SystemProvider>
  );
}
