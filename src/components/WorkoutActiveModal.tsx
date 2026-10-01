import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  RotateCcw,
  Timer,
  CheckCircle2,
  Dumbbell,
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  Flame,
} from 'lucide-react';
import { DailyQuestItem } from '../types/system';
import { useSystem } from '../context/SystemContext';
import { sounds, triggerHaptic, speakSystem } from '../utils/audio';

interface WorkoutActiveModalProps {
  item: DailyQuestItem;
  onClose: () => void;
}

export const WorkoutActiveModal: React.FC<WorkoutActiveModalProps> = ({ item, onClose }) => {
  const {
    addQuestProgress,
    startRestTimer,
    autoRestDuration,
    setAutoRestDuration,
    isAutoRestEnabled,
    setIsAutoRestEnabled,
    voiceEnabled,
    setVoiceEnabled,
    restSecondsLeft,
    isRestActive,
  } = useSystem();

  const [currentSetReps, setCurrentSetReps] = useState<number>(10);
  const [setsCompletedCount, setSetsCompletedCount] = useState<number>(0);
  const [selectedRest, setSelectedRest] = useState<number>(autoRestDuration);

  const isDone = item.current >= item.target;
  const progressPercent = Math.min(100, Math.round((item.current / item.target) * 100));
  const newTotalAfterSet = item.current + currentSetReps;
  const newPercentAfterSet = Math.min(100, Math.round((newTotalAfterSet / item.target) * 100));

  const handleAddReps = (amount: number) => {
    setCurrentSetReps((prev) => {
      const next = Math.max(0, prev + amount);
      if (amount > 0) {
        triggerHaptic(amount >= 10 ? 'medium' : 'light');
        sounds.playStatUp();
      } else {
        triggerHaptic('light');
      }
      return next;
    });
  };

  const handleValidateSet = () => {
    if (currentSetReps <= 0) return;

    // Add progress to quest
    addQuestProgress(item.id, currentSetReps);
    setSetsCompletedCount((prev) => prev + 1);

    sounds.playLevelUp();
    triggerHaptic('success');

    // Launch rest timer if enabled
    if (isAutoRestEnabled && selectedRest > 0) {
      startRestTimer(selectedRest, item.title);
    } else {
      sounds.playHoloChime();
    }

    // Reset set reps for the next round
    setCurrentSetReps(10);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 max-w-md mx-auto animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-950 border border-cyan-400 text-cyan-300 flex items-center justify-center font-bold shadow-[0_0_10px_#00d2ff]">
            <Dumbbell size={16} />
          </div>
          <div>
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest block">
              [ SÉANCE ACTIVE • COMPTEUR DU MONARQUE ]
            </span>
            <h2 className="text-sm font-system font-bold text-white uppercase truncate">
              {item.title}
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Target Progress Bar */}
      <div className="my-2 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-system">
          <span className="text-slate-300 flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-400" />
            Progression Quête
          </span>
          <span className="font-mono-tech font-bold text-cyan-300">
            {item.current} / {item.target} {item.unit} ({progressPercent}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30 relative">
          {/* Base current */}
          <div
            className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_8px_#00d2ff]"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Projected preview after current set */}
          {currentSetReps > 0 && !isDone && (
            <div
              className="absolute top-0 bottom-0 bg-sky-400/40 border-r border-sky-300 transition-all duration-200"
              style={{
                left: `${progressPercent}%`,
                width: `${Math.max(0, newPercentAfterSet - progressPercent)}%`,
              }}
            />
          )}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono-tech">
          <span>Séries validées : {setsCompletedCount}</span>
          {currentSetReps > 0 && (
            <span className="text-sky-300">
              ➔ Total après série : {newTotalAfterSet} {item.unit}
            </span>
          )}
        </div>
      </div>

      {/* Active Rest Countdown Warning (if currently resting) */}
      {isRestActive && (
        <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.25)] flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <Timer size={16} className="text-cyan-400" />
            <span className="text-xs font-system font-bold text-cyan-300">
              Repos en cours : {restSecondsLeft}s
            </span>
          </div>
          <span className="text-[10px] font-mono-tech text-slate-300">
            Préparez-vous pour la prochaine série
          </span>
        </div>
      )}

      {/* Giant Central Tap Zone */}
      <div className="my-auto py-2 flex flex-col items-center">
        <div className="text-center mb-2">
          <span className="text-[11px] font-system font-semibold text-slate-400 uppercase tracking-wider">
            Répétitions de la série en cours
          </span>
        </div>

        {/* Large Circular Interactive Touch Pad */}
        <div
          onClick={() => handleAddReps(1)}
          className="w-44 h-44 rounded-full bg-gradient-to-b from-cyan-950/60 to-slate-950 border-3 border-cyan-400/80 shadow-[0_0_35px_rgba(0,210,255,0.35)] flex flex-col items-center justify-center cursor-pointer select-none active:scale-95 transition-all hover:border-cyan-300 relative group"
        >
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-25 pointer-events-none" />

          <span className="font-mono-tech font-extrabold text-6xl text-white text-glow-cyan tracking-wider">
            {currentSetReps}
          </span>
          <span className="text-[11px] font-mono-tech font-bold text-cyan-400 uppercase mt-1 tracking-widest flex items-center gap-1">
            <Plus size={12} /> TAP POUR +1
          </span>
        </div>

        <p className="text-[10px] font-system text-slate-400 mt-2 text-center">
          Touchez le centre ou utilisez les gros boutons tactiles ci-dessous
        </p>
      </div>

      {/* Big High-Visibility Tactile Buttons (+1, +5, +10, -1, 0) */}
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-2">
          {/* -1 Button */}
          <button
            onClick={() => handleAddReps(-1)}
            disabled={currentSetReps <= 0}
            className="py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono-tech font-bold text-base flex items-center justify-center active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Enlever 1 répétition"
          >
            <Minus size={18} />
          </button>

          {/* +1 Button (Giant) */}
          <button
            onClick={() => handleAddReps(1)}
            className="py-3 rounded-xl bg-cyan-950/80 border-2 border-cyan-500 hover:border-cyan-300 text-cyan-300 font-mono-tech font-bold text-xl flex items-center justify-center active:scale-95 transition-all shadow-[0_0_12px_rgba(0,210,255,0.2)]"
          >
            +1
          </button>

          {/* +5 Button */}
          <button
            onClick={() => handleAddReps(5)}
            className="py-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono-tech font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
          >
            +5
          </button>

          {/* +10 Button */}
          <button
            onClick={() => handleAddReps(10)}
            className="py-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 hover:border-cyan-400 text-cyan-300 font-mono-tech font-bold text-lg flex items-center justify-center active:scale-95 transition-all"
          >
            +10
          </button>
        </div>

        {/* Rest Duration Selector & Auto-Rest Settings */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-system font-bold text-slate-300 flex items-center gap-1.5">
              <Timer size={13} className="text-cyan-400" />
              Temps de Repos :
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const nextVal = !isAutoRestEnabled;
                  setIsAutoRestEnabled(nextVal);
                  triggerHaptic('light');
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-system font-semibold transition-all border ${
                  isAutoRestEnabled
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                    : 'bg-slate-950 border-slate-700 text-slate-500'
                }`}
              >
                Auto-Repos : {isAutoRestEnabled ? 'OUI' : 'NON'}
              </button>

              <button
                onClick={() => {
                  setVoiceEnabled(!voiceEnabled);
                  triggerHaptic('light');
                }}
                className="text-slate-400 hover:text-cyan-300 p-0.5"
                title="Voix du Système"
              >
                {voiceEnabled ? <Volume2 size={14} className="text-cyan-400" /> : <VolumeX size={14} />}
              </button>
            </div>
          </div>

          {/* Rest Duration Presets */}
          <div className="grid grid-cols-5 gap-1.5">
            {[30, 45, 60, 90, 120].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setSelectedRest(sec);
                  setAutoRestDuration(sec);
                  triggerHaptic('light');
                  sounds.playTimerTick(false);
                }}
                className={`py-1.5 rounded-lg text-xs font-mono-tech font-bold transition-all border ${
                  selectedRest === sec
                    ? 'bg-cyan-500 text-black border-cyan-300 shadow-[0_0_8px_#00d2ff]'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {sec}s
              </button>
            ))}
          </div>
        </div>

        {/* Primary Epic Validation Button */}
        <button
          onClick={handleValidateSet}
          disabled={currentSetReps <= 0}
          className={`w-full py-4 rounded-xl font-system font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(0,210,255,0.4)] active:scale-98 transition-all cursor-pointer ${
            currentSetReps > 0
              ? 'bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 text-black hover:from-cyan-300 hover:to-blue-400'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <CheckCircle2 size={18} className="text-black" />
          <span>VALIDER LA SÉRIE (+{currentSetReps} REPS)</span>
          {isAutoRestEnabled && selectedRest > 0 && (
            <span className="text-[11px] font-mono-tech bg-black/20 px-2 py-0.5 rounded-full ml-1">
              & REPOS {selectedRest}s
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
