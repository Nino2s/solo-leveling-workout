import React, { useState } from 'react';
import {
  Timer,
  Play,
  Pause,
  Plus,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Flame,
  Zap,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';

export const RestTimerBar: React.FC = () => {
  const {
    restSecondsLeft,
    restTotalSeconds,
    isRestActive,
    isRestPaused,
    restExerciseName,
    pauseRestTimer,
    resumeRestTimer,
    stopRestTimer,
    addRestSeconds,
    voiceEnabled,
    setVoiceEnabled,
  } = useSystem();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!isRestActive) return null;

  const percentLeft = restTotalSeconds > 0
    ? Math.max(0, Math.min(100, Math.round((restSecondsLeft / restTotalSeconds) * 100)))
    : 0;

  const mins = Math.floor(restSecondsLeft / 60);
  const secs = restSecondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const isLowTime = restSecondsLeft <= 3 && restSecondsLeft > 0;

  return (
    <>
      {/* Floating Compact Bar (Fixed above Bottom Navigation) */}
      {!isExpanded && (
        <aside aria-label="Minuteur de repos flottant" className="fixed bottom-[74px] left-0 right-0 z-40 px-3 max-w-md mx-auto pointer-events-none animate-in slide-in-from-bottom-4 duration-300">
          <div className="pointer-events-auto cyber-box rounded-xl p-2.5 bg-slate-950/95 border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.4)] backdrop-blur-md">
            {/* Top progress line */}
            <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
              <div
                className={`h-full transition-all duration-300 ${
                  isLowTime
                    ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                    : 'bg-gradient-to-r from-cyan-500 to-sky-400 shadow-[0_0_10px_#00d2ff]'
                }`}
                style={{ width: `${percentLeft}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* Left: Info & Big Timer */}
              <div
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono-tech font-bold text-black shrink-0 transition-transform ${
                    isLowTime
                      ? 'bg-amber-400 scale-105 shadow-[0_0_12px_#f59e0b] animate-pulse'
                      : 'bg-cyan-400 shadow-[0_0_10px_#00d2ff]'
                  }`}
                >
                  <Timer size={18} />
                </div>
                <div className="truncate">
                  <div className="text-[10px] font-system font-bold text-slate-400 uppercase tracking-wider truncate flex items-center gap-1">
                    <span>REPOS DU CHASSEUR</span>
                    {restExerciseName && (
                      <span className="text-cyan-400 truncate">• {restExerciseName}</span>
                    )}
                  </div>
                  <div
                    className={`font-mono-tech font-bold text-lg leading-tight tracking-wider ${
                      isLowTime ? 'text-amber-400 text-glow-red animate-pulse' : 'text-cyan-300 text-glow-cyan'
                    }`}
                  >
                    {formattedTime}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* +15s quick add */}
                <button
                  onClick={() => addRestSeconds(15)}
                  className="px-2 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 hover:bg-cyan-900/80 text-cyan-300 font-mono-tech text-xs font-bold transition-all active:scale-95 flex items-center gap-0.5"
                  title="Ajouter 15 secondes"
                >
                  <Plus size={11} /> 15s
                </button>

                {/* Pause / Resume */}
                <button
                  onClick={isRestPaused ? resumeRestTimer : pauseRestTimer}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-cyan-300 flex items-center justify-center transition-all active:scale-95"
                  title={isRestPaused ? 'Reprendre' : 'Pause'}
                >
                  {isRestPaused ? <Play size={14} className="fill-cyan-400" /> : <Pause size={14} />}
                </button>

                {/* Expand */}
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 flex items-center justify-center transition-all active:scale-95"
                  title="Plein écran"
                >
                  <Maximize2 size={13} />
                </button>

                {/* Skip */}
                <button
                  onClick={stopRestTimer}
                  className="px-2 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 hover:bg-rose-900/60 text-rose-300 font-system text-xs font-semibold transition-all active:scale-95 flex items-center gap-1"
                  title="Passer le repos"
                >
                  <SkipForward size={12} />
                  <span>Passer</span>
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Fullscreen Focus Rest Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 animate-in fade-in duration-200 max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                [ MATRICE DE RÉCUPÉRATION DU SYSTÈME ]
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Central Giant Countdown */}
          <div className="text-center my-auto space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-system font-bold text-white uppercase tracking-wider text-glow-cyan">
                {restExerciseName || 'REPOS ENTRE LES SÉRIES'}
              </h2>
              <p className="text-xs text-slate-400 font-system">
                Respirez profondément. Le Système prépare votre corps pour le prochain assaut.
              </p>
            </div>

            {/* Giant Circular / Radial Box */}
            <div className="relative w-56 h-56 mx-auto flex items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full border-4 ${
                  isLowTime ? 'border-amber-400 animate-pulse' : 'border-cyan-400/40'
                } transition-all duration-300`}
                style={{
                  boxShadow: isLowTime
                    ? '0 0 35px rgba(245, 158, 11, 0.4)'
                    : '0 0 35px rgba(0, 210, 255, 0.25)',
                }}
              />
              <div className="text-center space-y-1 z-10">
                <div
                  className={`font-mono-tech font-bold text-6xl tracking-wider ${
                    isLowTime ? 'text-amber-400 text-glow-red animate-bounce' : 'text-cyan-300 text-glow-cyan'
                  }`}
                >
                  {formattedTime}
                </div>
                <div className="text-[11px] font-system uppercase tracking-widest text-slate-400">
                  {isRestPaused ? 'EN PAUSE' : `${percentLeft}% RESTANT`}
                </div>
              </div>
            </div>

            {/* Voice assistant toggle */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`px-3 py-1.5 rounded-full text-xs font-system font-semibold flex items-center gap-2 transition-all border ${
                  voiceEnabled
                    ? 'bg-cyan-950/70 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,210,255,0.2)]'
                    : 'bg-slate-900 border-slate-700 text-slate-400'
                }`}
              >
                {voiceEnabled ? <Volume2 size={14} className="text-cyan-400" /> : <VolumeX size={14} />}
                <span>Voix du Système : {voiceEnabled ? 'ACTIVE (3, 2, 1...)' : 'DÉSACTIVÉE'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Big Action Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => addRestSeconds(15)}
                className="py-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono-tech font-bold text-sm hover:bg-cyan-900/60 active:scale-95 transition-all"
              >
                +15s
              </button>
              <button
                onClick={() => addRestSeconds(30)}
                className="py-3 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono-tech font-bold text-sm hover:bg-cyan-900/60 active:scale-95 transition-all"
              >
                +30s
              </button>
              <button
                onClick={isRestPaused ? resumeRestTimer : pauseRestTimer}
                className="py-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-white font-system font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {isRestPaused ? (
                  <>
                    <Play size={16} className="fill-cyan-400 text-cyan-400" /> Reprendre
                  </>
                ) : (
                  <>
                    <Pause size={16} /> Pause
                  </>
                )}
              </button>
            </div>

            <button
              onClick={stopRestTimer}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-system font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-98 transition-all cursor-pointer"
            >
              <SkipForward size={16} />
              Passer le repos & Reprendre l'entraînement
            </button>
          </div>
        </div>
      )}
    </>
  );
};
