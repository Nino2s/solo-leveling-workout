import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  Gift,
  Plus,
  CheckCircle2,
  ChevronRight,
  Flame,
  Dumbbell,
  ShieldAlert,
  Timer,
  Zap,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { DailyQuestItem } from '../types/system';
import { WorkoutActiveModal } from './WorkoutActiveModal';

export const QuestsScreen: React.FC = () => {
  const {
    quests,
    addQuestProgress,
    claimQuestRewards,
    openRewardModal,
    openPenaltyModal,
    startRestTimer,
    isRestActive,
    restSecondsLeft,
  } = useSystem();

  const [activeItemModal, setActiveItemModal] = useState<DailyQuestItem | null>(null);
  const [activeWorkoutItem, setActiveWorkoutItem] = useState<DailyQuestItem | null>(null);
  const [customRepInput, setCustomRepInput] = useState<string>('10');
  const [timeLeftStr, setTimeLeftStr] = useState<string>('12h 45m 20s');

  // Real-time countdown to next midnight (reset penalty cycle)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeftStr('00h 00m 00s');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeftStr(
        `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalObjectives = quests.items.length;
  const completedObjectives = quests.items.filter((i) => i.current >= i.target).length;
  const overallProgressPercent = Math.round(
    (quests.items.reduce((acc, it) => acc + Math.min(100, (it.current / it.target) * 100), 0) /
      (totalObjectives * 100)) *
      100
  );

  const handleQuickAdd = (itemId: string, amount: number) => {
    addQuestProgress(itemId, amount);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeItemModal) return;
    const num = parseInt(customRepInput, 10);
    if (!isNaN(num) && num > 0) {
      addQuestProgress(activeItemModal.id, num);
      setActiveItemModal(null);
    }
  };

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Top Quest Announcement Window */}
      <div className="cyber-box rounded-xl p-4 bg-[#061224]/90 border border-cyan-500/40 hologram-scanline">
        <div className="flex items-center justify-between mb-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">
              [ QUÊTE QUOTIDIENNE ]
            </span>
          </div>
          <span className="text-[11px] font-mono-tech text-slate-400">
            {completedObjectives}/{totalObjectives} VALIDÉES
          </span>
        </div>

        <h1 className="text-base font-system font-bold text-white text-glow-cyan uppercase tracking-wide">
          RENFORCEMENT DU CORPS MORTEL
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          La routine ancestrale du Monarque. Forgez votre carcasse physique pour accueillir l'aura de l'ombre.
        </p>

        {/* Penalty Deadline Countdown */}
        <div className="mt-3 p-2.5 rounded bg-slate-900/80 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs font-system text-slate-300">Temps avant pénalité :</span>
          </div>
          <span className="text-xs font-mono-tech font-bold text-amber-400 text-glow-blue tracking-wider">
            {timeLeftStr}
          </span>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-3 space-y-1">
          <div className="flex items-center justify-between text-xs font-system">
            <span className="text-slate-300">Progression Totale</span>
            <span className="font-mono-tech text-cyan-300 font-bold">{overallProgressPercent}%</span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-300 shadow-[0_0_8px_#00d2ff]"
              style={{ width: `${overallProgressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rewards Ready Banner */}
      {quests.completed && (
        <div className="cyber-box rounded-xl p-3.5 bg-cyan-950/70 border border-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.3)] animate-hologram">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded bg-cyan-500 text-black flex items-center justify-center font-bold shadow-[0_0_12px_#00d2ff]">
                <Gift size={18} />
              </div>
              <div>
                <div className="text-xs font-system font-bold text-white uppercase tracking-wider text-glow-cyan">
                  QUÊTE QUOTIDIENNE ACCOMPLIE !
                </div>
                <div className="text-[11px] text-cyan-300">
                  {quests.rewardsClaimed ? 'Récompenses déjà réclamées aujourd\'hui.' : 'Ouvrez votre coffre de récompenses du Système.'}
                </div>
              </div>
            </div>

            <button
              onClick={quests.rewardsClaimed ? openRewardModal : claimQuestRewards}
              className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_10px_#00d2ff] active:scale-95 shrink-0"
            >
              {quests.rewardsClaimed ? 'Revoir' : 'Ouvrir'}
            </button>
          </div>
        </div>
      )}

      {/* Warning callout for penalty */}
      <div className="px-3 py-2 rounded-lg bg-red-950/30 border border-red-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] text-red-300">
          <AlertTriangle size={13} className="text-red-400 shrink-0" />
          <span>Non-complétion = Téléportation en Zone de Pénalité.</span>
        </div>
        <button
          onClick={openPenaltyModal}
          className="text-[10px] font-system font-semibold text-red-400 hover:text-red-300 underline"
        >
          Tester la zone
        </button>
      </div>

      {/* Active Workout Session Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/80 via-[#071b30] to-cyan-950/80 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)] flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 text-black flex items-center justify-center font-bold shadow-[0_0_10px_#00d2ff]">
              <Timer size={18} />
            </div>
            <div>
              <div className="text-xs font-system font-bold text-white uppercase tracking-wider text-glow-cyan">
                MODE SÉANCE ACTIVE & REPOS
              </div>
              <div className="text-[10px] text-cyan-300 font-system">
                Compteur tactile géant, bips sonores et voix du Système
              </div>
            </div>
          </div>
          {isRestActive && (
            <div className="px-2 py-1 rounded bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-mono-tech font-bold animate-pulse">
              REPOS: {restSecondsLeft}s
            </div>
          )}
        </div>

        {/* Quick Launch Buttons */}
        <div className="flex items-center gap-2 pt-1 border-t border-cyan-500/20">
          <button
            onClick={() => {
              const target = quests.items.find((i) => i.current < i.target) || quests.items[0];
              setActiveWorkoutItem(target);
            }}
            className="flex-1 py-2 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_#00d2ff] active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Zap size={14} className="fill-black" />
            <span>Lancer la Séance Interactive</span>
          </button>

          <button
            onClick={() => startRestTimer(60, 'Récupération libre')}
            className="py-2 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-system text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            title="Lancer un chrono de repos libre de 60s"
          >
            <Timer size={13} className="text-cyan-400" />
            <span>+60s Repos</span>
          </button>
        </div>
      </div>

      {/* 4 Exercise Quest Items */}
      <div className="space-y-3">
        {quests.items.map((item) => {
          const isDone = item.current >= item.target;
          const percent = Math.min(100, Math.round((item.current / item.target) * 100));

          return (
            <div
              key={item.id}
              className={`cyber-box rounded-xl p-3.5 transition-all ${
                isDone
                  ? 'bg-cyan-950/40 border-cyan-400/50 shadow-[0_0_15px_rgba(0,210,255,0.15)]'
                  : 'bg-[#061224]/80 border-cyan-500/20 hover:border-cyan-500/40'
              }`}
            >
              {/* Header: Title + Status */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Dumbbell
                    size={15}
                    className={isDone ? 'text-cyan-400' : 'text-slate-400'}
                  />
                  <h3 className="text-xs font-system font-bold text-white tracking-wide uppercase">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 font-mono-tech text-xs">
                  <span className={isDone ? 'text-cyan-300 font-bold' : 'text-slate-300'}>
                    {item.current} / {item.target} {item.unit}
                  </span>
                  {isDone && <CheckCircle2 size={15} className="text-cyan-400" />}
                </div>
              </div>

              {/* Technical execution tip */}
              <p className="text-[11px] text-slate-400 mb-2">
                {item.subtitle}
              </p>

              {/* Progress bar */}
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden mb-3 border border-cyan-500/20">
                <div
                  className={`h-full transition-all duration-300 ${
                    isDone
                      ? 'bg-cyan-400 shadow-[0_0_8px_#00d2ff]'
                      : 'bg-gradient-to-r from-sky-600 to-cyan-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Interactive Rep Logging Buttons */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                <div className="flex items-center gap-1.5 flex-1">
                  <button
                    onClick={() => handleQuickAdd(item.id, 5)}
                    className="py-1 px-2.5 rounded bg-cyan-950/50 border border-cyan-500/30 hover:bg-cyan-900/50 text-cyan-300 font-mono-tech text-xs transition-colors"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleQuickAdd(item.id, 10)}
                    className="py-1 px-2.5 rounded bg-cyan-950/50 border border-cyan-500/30 hover:bg-cyan-900/50 text-cyan-300 font-mono-tech text-xs transition-colors"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => handleQuickAdd(item.id, 25)}
                    className="py-1 px-2.5 rounded bg-cyan-950/50 border border-cyan-500/30 hover:bg-cyan-900/50 text-cyan-300 font-mono-tech text-xs transition-colors"
                  >
                    +25
                  </button>
                </div>

                <button
                  onClick={() => {
                    setActiveItemModal(item);
                    setCustomRepInput('10');
                  }}
                  className="py-1 px-2.5 rounded border border-cyan-500/40 text-[11px] font-system text-slate-300 hover:text-white hover:bg-cyan-950/60 transition-colors flex items-center gap-1"
                >
                  <Plus size={11} /> Saisie
                </button>
              </div>

              {/* Big Touch Active Workout Button */}
              <button
                onClick={() => setActiveWorkoutItem(item)}
                className="w-full mt-2.5 py-2 px-3 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/90 border border-cyan-400/50 hover:border-cyan-300 text-cyan-300 font-system font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_12px_rgba(0,210,255,0.15)] active:scale-98"
              >
                <Flame size={14} className="text-cyan-400" />
                <span>Mode Séance (Compteur Géant + Repos)</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Workout Active Full-Screen Modal */}
      {activeWorkoutItem && (
        <WorkoutActiveModal
          item={activeWorkoutItem}
          onClose={() => setActiveWorkoutItem(null)}
        />
      )}

      {/* Custom Rep Logger Bottom Modal */}
      {activeItemModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="cyber-box rounded-t-2xl p-5 w-full max-w-sm bg-[#061224] border border-cyan-400 shadow-[0_0_30px_rgba(0,210,255,0.3)] hologram-scanline">
            <div className="w-10 h-1 rounded-full bg-cyan-500/40 mx-auto mb-3" />
            <div className="text-center mb-3">
              <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">
                [ JOURNAL DU CHASSEUR ]
              </span>
              <h3 className="text-sm font-system font-bold text-white uppercase mt-0.5">
                {activeItemModal.title}
              </h3>
            </div>

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 font-system block mb-1">
                  Nombre de répétitions effectuées :
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={customRepInput}
                  onChange={(e) => setCustomRepInput(e.target.value)}
                  className="w-full py-2 px-3 rounded bg-slate-900 border border-cyan-500/50 text-cyan-300 font-mono-tech text-lg text-center font-bold focus:outline-none focus:border-cyan-400"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveItemModal(null)}
                  className="py-2.5 rounded border border-slate-700 text-slate-400 text-xs font-system hover:bg-slate-900 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_10px_#00d2ff]"
                >
                  Valider les Reps
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
