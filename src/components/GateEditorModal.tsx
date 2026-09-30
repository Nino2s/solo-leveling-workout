import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Dumbbell,
  Shield,
  Layers,
  Wand2,
} from 'lucide-react';
import { DungeonGate, HunterRank } from '../types/system';
import { sounds } from '../utils/audio';

interface GateEditorModalProps {
  initialGate?: DungeonGate | null;
  onSave: (gateData: Omit<DungeonGate, 'id' | 'completed'>) => void;
  onClose: () => void;
}

interface ExerciseInput {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  tip: string;
}

const PRESET_PROGRAMS = [
  {
    name: 'Mon Entraînement Upper Body Express',
    description: 'Séance rapide et intense (-1h) : échauffement, handstand, supersets tractions/dips PDC et lestés (+12kg), bûcheron et pompes déclinées.',
    rank: 'D' as HunterRank,
    exercises: [
      { id: '1', name: 'Échauffement Articulaire & Cardio', sets: 1, reps: '5 min', restSec: 30, tip: 'Rotations poignets, coudes, épaules, activation scapulaire' },
      { id: '2', name: 'Pratique Handstand & Équilibre', sets: 4, reps: '10 min total', restSec: 60, tip: 'Doigts ancrés au sol, corps droit et gainé' },
      { id: '3', name: 'Superset : Tractions Strictes + Dips (PDC)', sets: 1, reps: '19 reps (Superset)', restSec: 120, tip: 'Tirage menton barre + dips 90° sans pause' },
      { id: '4', name: 'Superset Lesté : Tractions + Dips (+12kg)', sets: 2, reps: '9 reps (+12kg)', restSec: 120, tip: 'Lest de 12kg bien calé, tempo contrôlé' },
      { id: '5', name: 'Tirage Bûcheron (Haltère 10kg)', sets: 2, reps: '10 reps / côté', restSec: 60, tip: 'Dos plat, coude tiré vers la hanche' },
      { id: '6', name: 'Pompes Déclinées (Pieds surélevés)', sets: 2, reps: 'S1: 20 reps · S2: 16 reps', restSec: 60, tip: 'Pieds sur banc ou support, amplitude max' },
    ],
  },
  {
    name: 'Routine Calisthénie Explosive & Compétences',
    description: 'Routine axée sur le muscle-up, l\'explosivité et l\'équilibre en handstand.',
    rank: 'C' as HunterRank,
    exercises: [
      { id: '1', name: 'Tractions Explosives Poitrine-Barre', sets: 5, reps: '4-5 reps', restSec: 120, tip: 'Tirer violemment vers le bas' },
      { id: '2', name: 'Tentatives / Maintien Handstand libre', sets: 5, reps: '30 sec', restSec: 90, tip: 'Épaules poussées vers le haut, regard entre les mains' },
      { id: '3', name: 'Dips sur Barre Droite (Straight Bar)', sets: 4, reps: '8 reps', restSec: 90, tip: 'Pencher le buste au-dessus de la barre' },
      { id: '4', name: 'Relevés de Jambes à la Barre (Toes to Bar)', sets: 4, reps: '10 reps', restSec: 60, tip: 'Pieds à la barre sans élan' },
    ],
  },
  {
    name: 'Circuit Entraînement au Poids du Corps',
    description: 'Volume intense pour forger une endurance d\'acier et une densité musculaire sans faille.',
    rank: 'E' as HunterRank,
    exercises: [
      { id: '1', name: 'Pompes Standard', sets: 4, reps: '20 reps', restSec: 60, tip: 'Amplitude complète sol à verrouillage' },
      { id: '2', name: 'Squats Poids de Corps', sets: 4, reps: '25 reps', restSec: 60, tip: 'Sous la parallèle' },
      { id: '3', name: 'Tractions Supination (Chin-ups)', sets: 4, reps: '8 reps', restSec: 60, tip: 'Focus biceps et grands dorsaux' },
      { id: '4', name: 'Gainage Planche Actif', sets: 3, reps: '60 sec', restSec: 45, tip: 'Protraction des omoplates' },
    ],
  },
];

export const GateEditorModal: React.FC<GateEditorModalProps> = ({
  initialGate,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(initialGate?.name || 'Mon Programme de Calisthénie');
  const [title, setTitle] = useState(initialGate?.title || 'Portail Personnalisé');
  const [rank, setRank] = useState<HunterRank>(initialGate?.rank || 'D');
  const [description, setDescription] = useState(
    initialGate?.description || 'Entraînement sur-mesure forgé pour dépasser mes limites actuelles.'
  );
  const [requiredLevel, setRequiredLevel] = useState<number>(initialGate?.requiredLevel || 1);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(initialGate?.timeLimitMinutes || 30);
  const [xpReward, setXpReward] = useState<number>(initialGate?.rewards.xp || 1500);
  const [statPointsReward, setStatPointsReward] = useState<number>(initialGate?.rewards.statPoints || 3);

  const [exercises, setExercises] = useState<ExerciseInput[]>(() => {
    if (initialGate?.exercises && initialGate.exercises.length > 0) {
      return initialGate.exercises.map((e) => ({ ...e }));
    }
    return [
      {
        id: '1',
        name: 'Tractions Strictes (Pronation)',
        sets: 4,
        reps: '8-10 reps',
        restSec: 90,
        tip: 'Tirage complet jusqu\'au sternum, descente contrôlée',
      },
      {
        id: '2',
        name: 'Dips aux Barres Parallèles',
        sets: 4,
        reps: '12 reps',
        restSec: 90,
        tip: 'Coudes à 90°, verrouillage triceps complet',
      },
      {
        id: '3',
        name: 'Pompes Poitrine au Sol',
        sets: 4,
        reps: '15 reps',
        restSec: 60,
        tip: 'Corps gainé, coudes à 45°',
      },
      {
        id: '4',
        name: 'Relevés de Jambes Suspendu',
        sets: 3,
        reps: '10 reps',
        restSec: 60,
        tip: 'Pieds à la barre sans balancier',
      },
    ];
  });

  const handleAddExercise = () => {
    sounds.playCountBeep();
    const newEx: ExerciseInput = {
      id: String(Date.now()),
      name: 'Nouvel Exercice (ex: Pompes Piquées)',
      sets: 3,
      reps: '10 reps',
      restSec: 60,
      tip: 'Gainage strict et amplitude complète',
    };
    setExercises((prev) => [...prev, newEx]);
  };

  const handleRemoveExercise = (id: string) => {
    sounds.playCountBeep();
    setExercises((prev) => prev.filter((e) => e.id !== id));
  };

  const handleUpdateExercise = (id: string, field: keyof ExerciseInput, value: string | number) => {
    setExercises((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const handleApplyPreset = (preset: typeof PRESET_PROGRAMS[0]) => {
    sounds.playStatUp();
    setName(preset.name);
    setDescription(preset.description);
    setRank(preset.rank);
    setExercises(preset.exercises.map((e) => ({ ...e, id: String(Date.now() + Math.random()) })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (exercises.length === 0) {
      alert('Veuillez ajouter au moins un exercice à votre programme.');
      return;
    }

    onSave({
      name: name.trim(),
      title: title.trim(),
      rank,
      description: description.trim(),
      requiredLevel,
      timeLimitMinutes,
      exercises,
      rewards: {
        xp: xpReward,
        statPoints: statPointsReward,
        rewardText: `+${xpReward} XP, +${statPointsReward} Points de Caractéristique`,
      },
      isCustom: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="cyber-box rounded-xl p-4 sm:p-5 max-w-lg w-full bg-[#061224] border border-cyan-400 shadow-[0_0_35px_rgba(0,210,255,0.35)] hologram-scanline relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
          <div>
            <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest block">
              [ FORGE DU MONARQUE : MON PROGRAMME ]
            </span>
            <h2 className="text-sm sm:text-base font-system font-bold text-white uppercase text-glow-cyan">
              {initialGate ? 'Modifier Mon Portail' : 'Créer un Portail avec Mon Programme'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded border border-cyan-500/30 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-system">
          {/* Quick Presets Picker */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1.5">
              <Wand2 size={13} className="text-cyan-400" />
              <span>Modèles de programmes rapides :</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              {PRESET_PROGRAMS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-1.5 rounded bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-400 text-left transition-colors"
                >
                  <span className="text-[10px] font-system font-bold text-cyan-300 block truncate">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono-tech">
                    {preset.exercises.length} exercices · Rang {preset.rank}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Gate General Info */}
          <div className="space-y-2.5 p-3 rounded bg-slate-900/60 border border-cyan-500/20">
            <div>
              <label className="text-slate-300 block mb-1">Nom du Défi / Séance :</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded bg-slate-950 border border-cyan-500/40 text-white font-system"
                placeholder="ex: Mon Entraînement Quotidien de Calisthénie"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-300 block mb-1">Rang Portail :</label>
                <select
                  value={rank}
                  onChange={(e) => setRank(e.target.value as HunterRank)}
                  className="w-full py-1.5 px-2 rounded bg-slate-950 border border-cyan-500/40 text-cyan-300 font-mono-tech"
                >
                  <option value="E">Rang E</option>
                  <option value="D">Rang D</option>
                  <option value="C">Rang C</option>
                  <option value="B">Rang B</option>
                  <option value="A">Rang A</option>
                  <option value="S">Rang S</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Niveau Requis :</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={requiredLevel}
                  onChange={(e) => setRequiredLevel(parseInt(e.target.value, 10) || 1)}
                  className="w-full py-1.5 px-2.5 rounded bg-slate-950 border border-cyan-500/40 text-white font-mono-tech"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Durée (min) :</label>
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={timeLimitMinutes}
                  onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value, 10) || 30)}
                  className="w-full py-1.5 px-2.5 rounded bg-slate-950 border border-cyan-500/40 text-white font-mono-tech"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Description / Objectif :</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full py-1.5 px-2.5 rounded bg-slate-950 border border-cyan-500/40 text-slate-300 text-xs"
                placeholder="Décrivez les objectifs de votre séance..."
              />
            </div>
          </div>

          {/* Exercises List Builder */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-bold uppercase tracking-wide flex items-center gap-1.5">
                <Dumbbell size={13} className="text-cyan-400" />
                Exercices du Programme ({exercises.length})
              </span>
              <button
                type="button"
                onClick={handleAddExercise}
                className="px-2 py-1 rounded bg-cyan-950 border border-cyan-400/50 text-cyan-300 hover:bg-cyan-900/60 text-[11px] font-system font-semibold flex items-center gap-1"
              >
                <Plus size={11} /> Ajouter un Exercice
              </button>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {exercises.map((ex, index) => (
                <div
                  key={ex.id}
                  className="p-2.5 rounded bg-slate-950 border border-cyan-500/20 space-y-1.5 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono-tech text-cyan-400 font-bold">
                      #{index + 1}
                    </span>
                    <input
                      type="text"
                      value={ex.name}
                      onChange={(e) => handleUpdateExercise(ex.id, 'name', e.target.value)}
                      placeholder="Nom de l'exercice"
                      className="flex-1 py-1 px-2 rounded bg-slate-900 border border-slate-700 text-white font-system text-xs font-semibold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExercise(ex.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                      title="Supprimer cet exercice"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Séries :</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={ex.sets}
                        onChange={(e) =>
                          handleUpdateExercise(ex.id, 'sets', parseInt(e.target.value, 10) || 1)
                        }
                        className="w-full py-1 px-1.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono-tech text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Répétitions :</span>
                      <input
                        type="text"
                        value={ex.reps}
                        onChange={(e) => handleUpdateExercise(ex.id, 'reps', e.target.value)}
                        placeholder="ex: 10 reps"
                        className="w-full py-1 px-1.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono-tech text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Repos (sec) :</span>
                      <input
                        type="number"
                        min="10"
                        max="600"
                        step="5"
                        value={ex.restSec}
                        onChange={(e) =>
                          handleUpdateExercise(ex.id, 'restSec', parseInt(e.target.value, 10) || 60)
                        }
                        className="w-full py-1 px-1.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-mono-tech text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={ex.tip}
                      onChange={(e) => handleUpdateExercise(ex.id, 'tip', e.target.value)}
                      placeholder="Consigne technique / astuce pour cet exercice"
                      className="w-full py-0.5 px-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300 text-[11px]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards Configuration */}
          <div className="grid grid-cols-2 gap-2 p-2.5 rounded bg-cyan-950/20 border border-cyan-500/20">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">XP Récompensée :</label>
              <input
                type="number"
                min="100"
                step="50"
                value={xpReward}
                onChange={(e) => setXpReward(parseInt(e.target.value, 10) || 500)}
                className="w-full py-1 px-2 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 font-mono-tech text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Points de Stats :</label>
              <input
                type="number"
                min="0"
                max="20"
                value={statPointsReward}
                onChange={(e) => setStatPointsReward(parseInt(e.target.value, 10) || 1)}
                className="w-full py-1 px-2 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 font-mono-tech text-xs font-bold"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded border border-slate-700 text-slate-400 hover:text-white text-xs font-system"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="py-2.5 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_#00d2ff] transition-all"
            >
              {initialGate ? 'Sauvegarder les Changements' : 'Matérialiser Mon Portail'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
