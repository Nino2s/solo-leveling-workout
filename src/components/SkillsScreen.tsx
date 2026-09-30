import React, { useState } from 'react';
import {
  Zap,
  Shield,
  Sparkles,
  Lock,
  Unlock,
  ChevronUp,
  Flame,
  Info,
  CheckCircle,
} from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { SystemSkill } from '../types/system';

export const SkillsScreen: React.FC = () => {
  const { skills, profile, upgradeSkill, unlockSkill } = useSystem();
  const [filter, setFilter] = useState<'all' | 'passive' | 'active'>('all');

  const filteredSkills = skills.filter((s) => {
    if (filter === 'all') return true;
    return s.type === filter;
  });

  const unlockedCount = skills.filter((s) => s.unlocked).length;

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="cyber-box rounded-xl p-4 bg-[#061224]/90 border border-cyan-500/30 hologram-scanline">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">
            [ ARBRE DE COMPÉTENCES DU MONARQUE ]
          </span>
          <span className="text-[11px] font-mono-tech text-cyan-300">
            {unlockedCount} / {skills.length} ÉVEILLÉES
          </span>
        </div>

        <h1 className="text-base font-system font-bold text-white text-glow-cyan uppercase tracking-wide">
          POUVOIRS & MAÎTRISES CORPORELLES
        </h1>
        <p className="text-xs text-slate-300 mt-1">
          Capacités passives et techniques de calisthénie débloquées à travers votre entraînement et les portails.
        </p>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-950/80 rounded-lg border border-cyan-500/20 mt-3">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-1.5 text-xs font-system font-medium rounded transition-colors ${
              filter === 'all'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00d2ff]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setFilter('passive')}
            className={`flex-1 py-1.5 text-xs font-system font-medium rounded transition-colors ${
              filter === 'passive'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00d2ff]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Passives
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-1.5 text-xs font-system font-medium rounded transition-colors ${
              filter === 'active'
                ? 'bg-cyan-500 text-black font-bold shadow-[0_0_8px_#00d2ff]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Actives
          </button>
        </div>
      </div>

      {/* Skills List */}
      <div className="space-y-3">
        {filteredSkills.map((skill) => {
          const canUnlock = !skill.unlocked && profile.level >= skill.requiredLevel;
          const canUpgrade = skill.unlocked && skill.level < skill.maxLevel;

          return (
            <div
              key={skill.id}
              className={`cyber-box rounded-xl p-3.5 transition-all ${
                skill.unlocked
                  ? 'bg-[#061224]/85 border-cyan-500/30 hover:border-cyan-400'
                  : 'bg-slate-950/80 border-slate-800 opacity-70'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border ${
                      skill.unlocked
                        ? 'bg-cyan-950 border-cyan-400/50 text-cyan-300'
                        : 'bg-slate-900 border-slate-700 text-slate-600'
                    }`}
                  >
                    {skill.type === 'passive' ? <Shield size={16} /> : <Zap size={16} />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-system font-bold text-white uppercase tracking-wide">
                        {skill.name}
                      </h3>
                      <span className="text-[9px] font-mono-tech uppercase text-cyan-400 px-1 py-0.2 rounded border border-cyan-500/30">
                        {skill.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-tech mt-0.5">
                      <span>RANG {skill.rank}</span>
                      <span>·</span>
                      <span className="text-cyan-300">
                        {skill.unlocked ? `NIV. ${skill.level} / ${skill.maxLevel}` : 'VERROUILLÉ'}
                      </span>
                    </div>
                  </div>
                </div>

                {skill.unlocked && skill.level >= skill.maxLevel && (
                  <span className="text-[10px] font-mono-tech text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    MAX
                  </span>
                )}
              </div>

              {/* Lore description */}
              <p className="text-xs text-slate-300 mb-2 leading-relaxed">
                {skill.description}
              </p>

              {/* System Buff */}
              <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 mb-2.5">
                <strong className="text-white">Effet du Système : </strong>
                {skill.bonus}
              </div>

              {/* Calisthenics execution cue */}
              <div className="p-2 rounded bg-slate-900/60 border border-slate-700/40 text-[11px] text-slate-300 mb-3">
                <strong className="text-cyan-400 font-mono-tech">CONSEIL CALISTHÉNIE : </strong>
                {skill.calisthenicsCue}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1 border-t border-cyan-500/15">
                <span className="text-[10px] text-slate-500 font-mono-tech">
                  {skill.unlocked
                    ? skill.level < skill.maxLevel
                      ? `Coût d'évolution : Niv. Chasseur ${profile.level}`
                      : 'Niveau d\'éveil maximum atteint'
                    : `Déblocage : Niveau ${skill.requiredLevel} requis`}
                </span>

                {skill.unlocked && canUpgrade && (
                  <button
                    onClick={() => upgradeSkill(skill.id)}
                    className="py-1 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_8px_#00d2ff] flex items-center gap-1"
                  >
                    <ChevronUp size={13} />
                    <span>Améliorer</span>
                  </button>
                )}

                {canUnlock && (
                  <button
                    onClick={() => unlockSkill(skill.id)}
                    className="py-1 px-3 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-colors shadow-[0_0_8px_#10b981] flex items-center gap-1"
                  >
                    <Unlock size={12} />
                    <span>Éveiller</span>
                  </button>
                )}

                {!skill.unlocked && !canUnlock && (
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 font-mono-tech">
                    <Lock size={12} />
                    <span>Niveau {skill.requiredLevel}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
