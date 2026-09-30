import React, { useState } from 'react';
import { AlertTriangle, Flame, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { sounds } from '../utils/audio';

export const PenaltyModal: React.FC = () => {
  const { isPenaltyModalOpen, closePenaltyModal, addWorkoutLog } = useSystem();
  const [penaltyReps, setPenaltyReps] = useState(0);
  const targetPenaltyReps = 30; // 30 emergency penalty burpees / pushups

  if (!isPenaltyModalOpen) return null;

  const handleAddRep = (amount: number) => {
    sounds.playCountBeep();
    setPenaltyReps((prev) => Math.min(targetPenaltyReps, prev + amount));
  };

  const handleSurvive = () => {
    sounds.playLevelUp();
    addWorkoutLog('Survie en Zone de Pénalité', penaltyReps, 10, ['endurance', 'vitality']);
    closePenaltyModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-box rounded-xl p-5 max-w-sm w-full bg-[#180509]/95 border border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] hologram-scanline relative overflow-hidden">
        {/* Top Warning header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-950/80 border border-red-500/50 mb-2">
            <ShieldAlert size={14} className="text-red-400 animate-pulse" />
            <span className="text-[11px] font-mono-tech text-red-300 tracking-widest uppercase">
              [ AVERTISSEMENT DU SYSTÈME ]
            </span>
          </div>
          <h2 className="text-lg font-system font-bold text-red-400 text-glow-red uppercase">
            ZONE DE PÉNALITÉ
          </h2>
          <p className="text-xs text-red-200/80 mt-1">
            Si la quête quotidienne n'est pas honorée, le Système vous inflige une punition de survie.
          </p>
        </div>

        {/* Penalty details */}
        <div className="p-3 rounded bg-red-950/40 border border-red-500/30 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-system">
            <span className="text-red-300">ÉPREUVE DE SURVIE</span>
            <span className="text-red-400 font-mono-tech font-bold">
              {penaltyReps} / {targetPenaltyReps} REPS
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 w-full bg-red-950/80 rounded-full overflow-hidden border border-red-500/30">
            <div
              className="h-full bg-red-500 transition-all duration-300 shadow-[0_0_10px_#ef4444]"
              style={{ width: `${(penaltyReps / targetPenaltyReps) * 100}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-300 italic">
            Exécutez 30 Burpees ou Pompes Spartiates immédiatement pour neutraliser le centipède du Système.
          </p>
        </div>

        {/* Rep counter buttons */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            onClick={() => handleAddRep(1)}
            className="py-2 rounded bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 font-system text-xs font-bold transition-colors"
          >
            +1 Rep
          </button>
          <button
            onClick={() => handleAddRep(5)}
            className="py-2 rounded bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 font-system text-xs font-bold transition-colors"
          >
            +5 Reps
          </button>
          <button
            onClick={() => handleAddRep(10)}
            className="py-2 rounded bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 font-system text-xs font-bold transition-colors"
          >
            +10 Reps
          </button>
        </div>

        {/* Action Button */}
        {penaltyReps >= targetPenaltyReps ? (
          <button
            onClick={handleSurvive}
            className="w-full py-3 px-4 rounded-lg bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-system font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            <span>PÉNALITÉ PURGÉE · RETOUR AU REPOS</span>
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setPenaltyReps(0)}
              className="px-3 py-2 rounded bg-red-950/60 border border-red-500/30 text-red-400 hover:text-white transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={closePenaltyModal}
              className="flex-1 py-2.5 px-3 rounded-lg border border-red-500/40 hover:bg-red-950/50 text-red-300 font-system text-xs uppercase transition-colors"
            >
              Fermer l'alerte d'urgence
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
