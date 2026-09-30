import React from 'react';
import { Bell, X, ShieldAlert, Award, Zap, Sparkles } from 'lucide-react';
import { useSystem } from '../context/SystemContext';

export const NotificationOverlay: React.FC = () => {
  const { activeNotification, dismissNotification } = useSystem();

  if (!activeNotification) return null;

  const isWarning = activeNotification.type === 'warning';
  const isLevelUp = activeNotification.type === 'levelup';
  const isReward = activeNotification.type === 'reward';
  const isSkill = activeNotification.type === 'skill';

  const borderColor = isWarning
    ? 'border-red-500/70 shadow-[0_0_25px_rgba(239,68,68,0.3)]'
    : isLevelUp || isReward
    ? 'border-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.35)]'
    : 'border-cyan-500/50 shadow-[0_0_20px_rgba(0,210,255,0.2)]';

  const titleColor = isWarning
    ? 'text-red-400 text-glow-red'
    : 'text-cyan-300 text-glow-cyan';

  return (
    <div className="fixed top-14 left-4 right-4 z-50 max-w-md mx-auto pointer-events-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`pointer-events-auto cyber-box rounded-lg p-3.5 bg-[#061224]/95 backdrop-blur-xl border ${borderColor} hologram-scanline transition-all`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={`w-9 h-9 rounded flex items-center justify-center shrink-0 border ${
              isWarning
                ? 'bg-red-950/60 border-red-500/40 text-red-400'
                : 'bg-cyan-950/60 border-cyan-400/40 text-cyan-300'
            }`}
          >
            {isWarning && <ShieldAlert size={18} className="animate-pulse" />}
            {isLevelUp && <Sparkles size={18} className="animate-spin" />}
            {isReward && <Award size={18} />}
            {isSkill && <Zap size={18} />}
            {!isWarning && !isLevelUp && !isReward && !isSkill && <Bell size={18} />}
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] uppercase font-mono-tech text-cyan-400 tracking-wider">
                [ ALERTE SYSTÈME ]
              </span>
            </div>
            <h4 className={`text-sm font-system font-bold uppercase tracking-wide truncate ${titleColor}`}>
              {activeNotification.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {activeNotification.message}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={dismissNotification}
            className="w-7 h-7 rounded border border-cyan-500/30 flex items-center justify-center text-slate-400 hover:text-white hover:bg-cyan-900/30 transition-colors shrink-0"
            aria-label="Fermer"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
