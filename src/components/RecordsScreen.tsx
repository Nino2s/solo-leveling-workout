import React, { useState } from 'react';
import {
  Trophy,
  Plus,
  TrendingUp,
  Calendar,
  History,
  Clock,
  Sparkles,
  Dumbbell,
  CheckCircle,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { PersonalRecord, StatType } from '../types/system';

export const RecordsScreen: React.FC = () => {
  const { records, workoutLogs, addRecord, addWorkoutLog } = useSystem();

  const [activeTab, setActiveTab] = useState<'records' | 'logs'>('records');
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New Record Form State
  const [recExercise, setRecExercise] = useState('Tractions Strictes (Pronation)');
  const [recValue, setRecValue] = useState('');
  const [recUnit, setRecUnit] = useState('reps');
  const [recCategory, setRecCategory] = useState<PersonalRecord['category']>('max_reps');
  const [recNotes, setRecNotes] = useState('');

  // New Workout Log Form State
  const [logTitle, setLogTitle] = useState('Séance Calisthénie Explosive');
  const [logReps, setLogReps] = useState('120');
  const [logDuration, setLogDuration] = useState('45');

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(recValue);
    if (!isNaN(val) && val > 0 && recExercise.trim()) {
      addRecord(recExercise.trim(), val, recUnit, recCategory, recNotes.trim());
      setIsRecordModalOpen(false);
      setRecValue('');
      setRecNotes('');
    }
  };

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reps = parseInt(logReps, 10);
    const mins = parseInt(logDuration, 10);
    if (!isNaN(reps) && reps > 0 && logTitle.trim()) {
      addWorkoutLog(logTitle.trim(), reps, isNaN(mins) ? 30 : mins, ['strength', 'endurance']);
      setIsLogModalOpen(false);
    }
  };

  const totalRepsAllTime = workoutLogs.reduce((acc, log) => acc + log.totalReps, 0);

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="cyber-box rounded-xl p-4 bg-[#061224]/90 border border-cyan-500/30 hologram-scanline">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">
            [ ARCHIVES & PERFORMANCES ]
          </span>
          <span className="text-[11px] font-mono-tech text-cyan-300">
            {records.length} RECORDS · {workoutLogs.length} SÉANCES
          </span>
        </div>

        <h1 className="text-base font-system font-bold text-white text-glow-cyan uppercase tracking-wide">
          REGISTRE DES EXPLOITS
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          La trace de votre ascension. Chaque palier franchi grave votre nom dans les annales du Système.
        </p>

        {/* Global Stats bar */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-xs font-system">
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20">
            <span className="text-[10px] text-slate-400 block font-mono-tech">TOTAL RÉPÉTITIONS</span>
            <span className="text-base font-mono-tech font-bold text-cyan-300">
              {totalRepsAllTime.toLocaleString()} reps
            </span>
          </div>
          <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/20">
            <span className="text-[10px] text-slate-400 block font-mono-tech">RECORDS ÉTABLIS</span>
            <span className="text-base font-mono-tech font-bold text-white">
              {records.length} Max PRs
            </span>
          </div>
        </div>

        {/* Segmented Tab Bar */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-cyan-500/20 mt-3">
          <button
            onClick={() => setActiveTab('records')}
            className={`flex-1 py-1.5 text-xs font-system font-medium rounded transition-colors ${
              activeTab === 'records'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00d2ff]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Records Personnels (PR)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex-1 py-1.5 text-xs font-system font-medium rounded transition-colors ${
              activeTab === 'logs'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00d2ff]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Journal de Séances
          </button>
        </div>
      </div>

      {/* Tab 1: Personal Records List */}
      {activeTab === 'records' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-wider">
              RECORDS ACTUELS
            </span>
            <button
              onClick={() => setIsRecordModalOpen(true)}
              className="py-1 px-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_8px_#00d2ff] flex items-center gap-1"
            >
              <Plus size={13} /> Nouveau Record
            </button>
          </div>

          <div className="space-y-2.5">
            {records.length === 0 ? (
              <div className="cyber-box rounded-xl p-6 bg-[#061224]/70 border border-cyan-500/20 text-center space-y-2">
                <Trophy size={28} className="mx-auto text-cyan-400/60" />
                <h4 className="text-xs font-system font-bold text-white uppercase tracking-wider">
                  AUCUN RECORD ENREGISTRÉ
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Votre voyage commence ici au Niveau 1. Enregistrez votre premier exploit (tractions, pompes, dips) pour marquer l'Histoire du Système.
                </p>
                <button
                  onClick={() => setIsRecordModalOpen(true)}
                  className="mt-2 py-1.5 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 shadow-[0_0_10px_#00d2ff]"
                >
                  <Plus size={12} /> Premier Record
                </button>
              </div>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="cyber-box rounded-xl p-3.5 bg-[#061224]/85 border border-cyan-500/25 hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <h3 className="text-xs font-system font-bold text-white uppercase tracking-wide">
                        {record.exercise}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono-tech">
                        Établi : {record.date}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-mono-tech font-bold text-cyan-300 text-glow-cyan">
                        {record.value} {record.unit}
                      </span>
                    </div>
                  </div>

                  {record.notes && (
                    <p className="text-[11px] text-slate-400 italic mb-2">
                      "{record.notes}"
                    </p>
                  )}

                  {/* Progress history pills */}
                  {record.history && record.history.length > 1 && (
                    <div className="pt-2 border-t border-cyan-500/15 flex items-center gap-2 overflow-x-auto text-[10px] font-mono-tech text-slate-400">
                      <TrendingUp size={11} className="text-cyan-400 shrink-0" />
                      <span>Progression :</span>
                      {record.history.map((h, i) => (
                        <span key={i} className="text-slate-300 whitespace-nowrap">
                          {h.value} {record.unit}
                          {i < record.history.length - 1 && <span className="text-cyan-400 mx-1">→</span>}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Workout Logs List */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-wider">
              HISTORIQUE DES ENTRAÎNEMENTS
            </span>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="py-1 px-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_8px_#00d2ff] flex items-center gap-1"
            >
              <Plus size={13} /> Enregistrer
            </button>
          </div>

          <div className="space-y-2.5">
            {workoutLogs.length === 0 ? (
              <div className="cyber-box rounded-xl p-6 bg-[#061224]/70 border border-cyan-500/20 text-center space-y-2">
                <History size={28} className="mx-auto text-cyan-400/60" />
                <h4 className="text-xs font-system font-bold text-white uppercase tracking-wider">
                  AUCUNE SÉANCE CONSIGNÉE
                </h4>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Votre journal d'entraînement est vierge. Enregistrez vos séances d'entraînement ou terminez un portail pour débuter votre ascension.
                </p>
                <button
                  onClick={() => setIsLogModalOpen(true)}
                  className="mt-2 py-1.5 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 shadow-[0_0_10px_#00d2ff]"
                >
                  <Plus size={12} /> Première Séance
                </button>
              </div>
            ) : (
              workoutLogs.map((log) => (
                <div
                  key={log.id}
                  className="cyber-box rounded-xl p-3.5 bg-[#061224]/85 border border-cyan-500/25 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-system font-bold text-white uppercase tracking-wide">
                        {log.title}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-tech mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> {log.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock size={10} /> {log.durationMinutes} min
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono-tech text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                      +{log.xpGained} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {log.summary}
                  </p>

                  <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono-tech text-slate-400">
                    <span>Impact :</span>
                    {log.statsAffected.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-slate-900 border border-cyan-500/20 text-cyan-400 uppercase">
                        +{s}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Record */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="cyber-box rounded-xl p-5 max-w-sm w-full bg-[#061224] border border-cyan-400 shadow-[0_0_30px_rgba(0,210,255,0.3)] hologram-scanline">
            <div className="text-center mb-3">
              <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">
                [ NOUVEL EXPLOIT DU MONARQUE ]
              </span>
              <h3 className="text-sm font-system font-bold text-white uppercase mt-0.5">
                ENREGISTRER UN RECORD
              </h3>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-3 text-xs font-system">
              <div>
                <label className="text-slate-300 block mb-1">Mouvement de Calisthénie :</label>
                <input
                  type="text"
                  value={recExercise}
                  onChange={(e) => setRecExercise(e.target.value)}
                  className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-cyan-500/40 text-white"
                  placeholder="ex: Tractions Strictes, Dips, Muscle-up..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Score / Valeur :</label>
                  <input
                    type="number"
                    step="any"
                    value={recValue}
                    onChange={(e) => setRecValue(e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono-tech font-bold"
                    placeholder="ex: 22"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Unité :</label>
                  <select
                    value={recUnit}
                    onChange={(e) => setRecUnit(e.target.value)}
                    className="w-full py-1.5 px-2 rounded bg-slate-900 border border-cyan-500/40 text-slate-200"
                  >
                    <option value="reps">Reps</option>
                    <option value="sec">Secondes (isométrique)</option>
                    <option value="kg">kg (lesté)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Notes sur la forme (optionnel) :</label>
                <input
                  type="text"
                  value={recNotes}
                  onChange={(e) => setRecNotes(e.target.value)}
                  className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-cyan-500/40 text-slate-300"
                  placeholder="ex: Amplitude complète, pause 1s en haut"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="py-2 rounded border border-slate-700 text-slate-400 text-xs font-system hover:bg-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider shadow-[0_0_10px_#00d2ff]"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Workout Log */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="cyber-box rounded-xl p-5 max-w-sm w-full bg-[#061224] border border-cyan-400 shadow-[0_0_30px_rgba(0,210,255,0.3)] hologram-scanline">
            <div className="text-center mb-3">
              <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">
                [ JOURNAL D'ENTRAÎNEMENT ]
              </span>
              <h3 className="text-sm font-system font-bold text-white uppercase mt-0.5">
                NOUVELLE SÉANCE
              </h3>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-3 text-xs font-system">
              <div>
                <label className="text-slate-300 block mb-1">Titre de la Séance :</label>
                <input
                  type="text"
                  value={logTitle}
                  onChange={(e) => setLogTitle(e.target.value)}
                  className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-cyan-500/40 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Répétitions totales :</label>
                  <input
                    type="number"
                    value={logReps}
                    onChange={(e) => setLogReps(e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-cyan-500/40 text-cyan-300 font-mono-tech font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Durée (minutes) :</label>
                  <input
                    type="number"
                    value={logDuration}
                    onChange={(e) => setLogDuration(e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded bg-slate-900 border border-cyan-500/40 text-slate-200 font-mono-tech"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="py-2 rounded border border-slate-700 text-slate-400 text-xs font-system hover:bg-slate-900"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider shadow-[0_0_10px_#00d2ff]"
                >
                  Enregistrer Séance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
