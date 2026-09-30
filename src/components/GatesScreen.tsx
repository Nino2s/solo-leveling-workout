import React, { useState, useEffect } from 'react';
import {
  Swords,
  Shield,
  Clock,
  Sparkles,
  Award,
  CheckCircle2,
  Play,
  RotateCcw,
  ChevronRight,
  Flame,
  ArrowLeft,
  Timer,
  Check,
  Plus,
  Edit2,
  Trash2,
  Wand2,
} from 'lucide-react';
import dungeonGateImg from '../assets/images/dungeon_gate_monarch_1790358859298.jpg';
import { useSystem } from '../context/SystemContext';
import { DungeonGate, HunterRank } from '../types/system';
import { sounds } from '../utils/audio';
import { GateEditorModal } from './GateEditorModal';

export const GatesScreen: React.FC = () => {
  const { gates, profile, completeGate, addCustomGate, updateGate, deleteGate } = useSystem();
  const [activeGate, setActiveGate] = useState<DungeonGate | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [gateToEdit, setGateToEdit] = useState<DungeonGate | null>(null);

  // Active workout state
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);

  // Session elapsed timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeGate) {
      interval = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeGate]);

  // Rest countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (restSecondsLeft !== null && restSecondsLeft > 0) {
      interval = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            sounds.playTimerTick(true);
            return null;
          }
          if (prev <= 4) {
            sounds.playTimerTick(false);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [restSecondsLeft]);

  const handleStartGate = (gate: DungeonGate) => {
    if (profile.level < gate.requiredLevel) {
      sounds.playWarningDrone();
      return;
    }
    sounds.playRewardUnlock();
    setActiveGate(gate);
    setCurrentExerciseIdx(0);
    setCompletedSets({});
    setSessionSeconds(0);
    setRestSecondsLeft(null);
  };

  const handleExitGate = () => {
    setActiveGate(null);
    setRestSecondsLeft(null);
  };

  const handleCompleteSet = (exerciseId: string, totalSets: number, defaultRestSec: number) => {
    sounds.playCountBeep();
    const cur = completedSets[exerciseId] || 0;
    const nextVal = Math.min(totalSets, cur + 1);
    setCompletedSets((prev) => ({ ...prev, [exerciseId]: nextVal }));

    // Start rest timer if sets remain
    if (nextVal < totalSets) {
      setRestSecondsLeft(defaultRestSec);
    }
  };

  const handleFinishWorkout = () => {
    if (!activeGate) return;
    const minutes = Math.floor(sessionSeconds / 60);
    const secs = sessionSeconds % 60;
    const timeSpent = `${minutes} min ${String(secs).padStart(2, '0')}s`;
    completeGate(activeGate.id, timeSpent);
    setActiveGate(null);
  };

  const rankBadgeStyle: Record<HunterRank, { border: string; text: string; bg: string }> = {
    E: { border: 'border-slate-500/40', text: 'text-slate-400', bg: 'bg-slate-900/60' },
    D: { border: 'border-cyan-500/40', text: 'text-cyan-400', bg: 'bg-cyan-950/60' },
    C: { border: 'border-blue-500/40', text: 'text-blue-400', bg: 'bg-blue-950/60' },
    B: { border: 'border-purple-500/40', text: 'text-purple-400', bg: 'bg-purple-950/60' },
    A: { border: 'border-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-950/60' },
    S: { border: 'border-red-500/60', text: 'text-red-400', bg: 'bg-red-950/80' },
  };

  // ACTIVE DUNGEON WORKOUT RUNNER
  if (activeGate) {
    const curExercise = activeGate.exercises[currentExerciseIdx];
    const totalExercises = activeGate.exercises.length;
    const curSets = completedSets[curExercise.id] || 0;
    const isExerciseFinished = curSets >= curExercise.sets;

    // Check if entire dungeon is done
    const allFinished = activeGate.exercises.every(
      (ex) => (completedSets[ex.id] || 0) >= ex.sets
    );

    const elapsedMin = Math.floor(sessionSeconds / 60);
    const elapsedSec = sessionSeconds % 60;

    return (
      <div className="space-y-4 pb-4 animate-in fade-in duration-300">
        {/* Workout Top Bar */}
        <div className="cyber-box rounded-xl p-3.5 bg-[#061224] border border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)] flex items-center justify-between">
          <button
            onClick={handleExitGate}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white"
          >
            <ArrowLeft size={14} /> Quitter
          </button>

          <div className="text-center">
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest block">
              [ PORTAIL ACTIF : {activeGate.rank} ]
            </span>
            <span className="text-xs font-system font-bold text-white uppercase">
              {activeGate.title}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-mono-tech text-cyan-300">
            <Timer size={13} />
            {String(elapsedMin).padStart(2, '0')}:{String(elapsedSec).padStart(2, '0')}
          </div>
        </div>

        {/* Rest Timer Floating Bar */}
        {restSecondsLeft !== null && (
          <div className="cyber-box rounded-xl p-3 bg-cyan-950/90 border border-cyan-400 shadow-[0_0_25px_rgba(0,210,255,0.4)] flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" />
              <div>
                <span className="text-xs font-system font-bold text-white uppercase">
                  TEMPS DE REPOS
                </span>
                <span className="text-[10px] text-cyan-300 block">
                  Respirez profondément avant la prochaine série
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono-tech font-bold text-cyan-300">
                {restSecondsLeft}s
              </span>
              <button
                onClick={() => setRestSecondsLeft(null)}
                className="text-[10px] px-2 py-1 rounded bg-cyan-900/60 border border-cyan-500/40 text-slate-300 hover:text-white"
              >
                Passer
              </button>
            </div>
          </div>
        )}

        {/* Current Active Exercise Card */}
        <div className="cyber-box rounded-xl p-4 bg-[#08152b] border border-cyan-500/40 hologram-scanline">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono-tech">
            <span>EXERCICE {currentExerciseIdx + 1} SUR {totalExercises}</span>
            <span className="text-cyan-400 font-bold">{curExercise.reps}</span>
          </div>

          <h2 className="text-lg font-system font-bold text-white text-glow-cyan uppercase mb-1">
            {curExercise.name}
          </h2>

          <div className="p-2.5 rounded bg-slate-900/70 border border-cyan-500/20 text-xs text-slate-300 mb-4">
            <span className="text-cyan-400 font-bold">Consigne technique :</span> {curExercise.tip}
          </div>

          {/* Interactive Set Tracker Checkboxes */}
          <div className="space-y-2 mb-4">
            <div className="text-xs font-system text-slate-300 flex items-center justify-between">
              <span>SÉRIES REQUISES</span>
              <span className="font-mono-tech text-cyan-300 font-bold">
                {curSets} / {curExercise.sets}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: curExercise.sets }).map((_, idx) => {
                const isDone = idx < curSets;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === curSets) {
                        handleCompleteSet(curExercise.id, curExercise.sets, curExercise.restSec);
                      }
                    }}
                    className={`py-2.5 rounded flex flex-col items-center justify-center font-mono-tech text-xs transition-all ${
                      isDone
                        ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00d2ff]'
                        : idx === curSets
                        ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 animate-pulse cursor-pointer'
                        : 'bg-slate-900/80 border border-slate-700 text-slate-600'
                    }`}
                  >
                    <span>S{idx + 1}</span>
                    {isDone ? <Check size={12} /> : <span className="text-[10px] mt-0.5">{curExercise.reps}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Next / Prev Navigation */}
          <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20">
            <button
              onClick={() => setCurrentExerciseIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentExerciseIdx === 0}
              className="py-1.5 px-3 rounded border border-slate-700 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              Précédent
            </button>

            <button
              onClick={() =>
                setCurrentExerciseIdx((prev) => Math.min(totalExercises - 1, prev + 1))
              }
              disabled={currentExerciseIdx === totalExercises - 1}
              className="py-1.5 px-3 rounded border border-cyan-500/40 text-xs text-cyan-300 hover:bg-cyan-950/60 disabled:opacity-30 disabled:pointer-events-none"
            >
              Suivant
            </button>
          </div>
        </div>

        {/* Complete Dungeon Button */}
        {allFinished && (
          <div className="p-4 rounded-xl bg-cyan-950/80 border border-cyan-400 text-center space-y-3 animate-in fade-in shadow-[0_0_30px_rgba(0,210,255,0.4)]">
            <div className="w-12 h-12 rounded-full bg-cyan-500 text-black flex items-center justify-center mx-auto shadow-[0_0_15px_#00d2ff]">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-base font-system font-bold text-white text-glow-cyan uppercase">
                PORTAIL ENTIÈREMENT NETTOYÉ !
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Toutes les séries ont été validées selon les préceptes du Système.
              </p>
            </div>

            <button
              onClick={handleFinishWorkout}
              className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-sm uppercase tracking-wider transition-all shadow-[0_0_15px_#00d2ff]"
            >
              RÉCLAMER LA VICTOIRE & XP
            </button>
          </div>
        )}
      </div>
    );
  }

  // STANDARD PORTAL LIST VIEW
  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Dimensional Gate Hero Banner */}
      <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 shadow-[0_0_20px_rgba(0,210,255,0.2)]">
        <img
          src={dungeonGateImg}
          alt="Portails de Donjon"
          className="w-full h-36 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040914] via-[#040914]/60 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest block">
            [ FAILLE SPATIO-TEMPORELLE ]
          </span>
          <h1 className="text-base font-system font-bold text-white text-glow-cyan uppercase tracking-wide">
            PORTAILS DE CALISTHÉNIE
          </h1>
          <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">
            Défiez les boss de donjon ou forgez vos propres séances d'entraînement sur-mesure.
          </p>
        </div>
      </div>

      {/* Program Forge Trigger Button */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-wider">
          PORTAILS ACTIFS ({gates.length})
        </span>

        <button
          onClick={() => {
            setGateToEdit(null);
            setIsEditorOpen(true);
          }}
          className="py-1.5 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_#00d2ff] active:scale-95 flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Intégrer Mon Programme</span>
        </button>
      </div>

      {/* Gates List */}
      <div className="space-y-3">
        {gates.map((gate) => {
          const isUnlocked = profile.level >= gate.requiredLevel;
          const badge = rankBadgeStyle[gate.rank];

          return (
            <div
              key={gate.id}
              className={`cyber-box rounded-xl p-3.5 transition-all ${
                gate.isCustom
                  ? 'bg-[#091a33]/90 border-cyan-400/60 shadow-[0_0_18px_rgba(0,210,255,0.2)]'
                  : gate.completed
                  ? 'bg-cyan-950/20 border-cyan-500/30'
                  : isUnlocked
                  ? 'bg-[#061224]/85 border-cyan-500/30 hover:border-cyan-400'
                  : 'bg-slate-950/80 border-slate-800 opacity-60'
              }`}
            >
              {/* Header: Rank + Title + Best Time + Custom badge */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`px-2 py-0.5 rounded border text-[10px] font-mono-tech font-bold uppercase ${badge.border} ${badge.text} ${badge.bg}`}
                  >
                    RANG {gate.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-system font-bold text-white uppercase tracking-wide">
                        {gate.name}
                      </h3>
                      {gate.isCustom && (
                        <span className="text-[9px] font-mono-tech text-cyan-300 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-400/50">
                          MON PROGRAMME
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono-tech">
                      {gate.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Edit gate button */}
                  <button
                    onClick={() => {
                      setGateToEdit(gate);
                      setIsEditorOpen(true);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-950/50 transition-colors"
                    title="Modifier ce programme"
                  >
                    <Edit2 size={13} />
                  </button>

                  {/* Delete custom gate button */}
                  {gate.isCustom && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Dissiper le portail [${gate.name}] ?`)) {
                          deleteGate(gate.id);
                        }
                      }}
                      className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/50 transition-colors"
                      title="Supprimer ce portail"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}

                  {gate.completed && (
                    <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono-tech ml-1">
                      <CheckCircle2 size={13} /> Conquis
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-400 mb-3">
                {gate.description}
              </p>

              {/* Exercises Preview */}
              <div className="p-2 rounded bg-slate-900/60 border border-cyan-500/10 mb-3 space-y-1 text-[11px] text-slate-300">
                <div className="font-system text-slate-400 text-[10px] uppercase font-semibold flex items-center justify-between">
                  <span>Programme d'Entraînement :</span>
                  <span className="font-mono-tech text-cyan-400 font-normal">
                    {gate.exercises.length} exercices
                  </span>
                </div>
                {gate.exercises.map((ex) => (
                  <div key={ex.id} className="flex items-center justify-between">
                    <span className="text-slate-300">{ex.name}</span>
                    <span className="font-mono-tech text-cyan-400">{ex.sets} × {ex.reps}</span>
                  </div>
                ))}
              </div>

              {/* Rewards info */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-cyan-500/15">
                <span className="font-mono-tech text-cyan-300">
                  +{gate.rewards.xp} XP · +{gate.rewards.statPoints} Stats
                </span>

                {isUnlocked ? (
                  <button
                    onClick={() => handleStartGate(gate)}
                    className="py-1 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_8px_#00d2ff] active:scale-95 flex items-center gap-1"
                  >
                    <Play size={12} fill="currentColor" />
                    <span>{gate.completed ? 'Recommencer' : 'Entrer'}</span>
                  </button>
                ) : (
                  <span className="text-[10px] font-system text-slate-500">
                    Niveau {gate.requiredLevel} requis
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Forge Editor Modal */}
      {isEditorOpen && (
        <GateEditorModal
          initialGate={gateToEdit}
          onSave={(gateData) => {
            if (gateToEdit) {
              updateGate(gateToEdit.id, gateData);
            } else {
              addCustomGate(gateData);
            }
          }}
          onClose={() => {
            setIsEditorOpen(false);
            setGateToEdit(null);
          }}
        />
      )}
    </div>
  );
};
