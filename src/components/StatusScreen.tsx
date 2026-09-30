import React, { useState } from 'react';
import {
  Flame,
  Zap,
  Plus,
  RotateCcw,
  Sparkles,
  Heart,
  BatteryCharging,
  Info,
  Edit2,
  Check,
} from 'lucide-react';
import hunterAvatarImg from '../assets/images/hunter_avatar_solo_1790358847156.jpg';
import { useSystem } from '../context/SystemContext';
import { StatType } from '../types/system';

interface StatMeta {
  key: StatType;
  abbr: string;
  name: string;
  desc: string;
  calisthenicsEffect: string;
  color: string;
}

const STAT_METAS: StatMeta[] = [
  {
    key: 'strength',
    abbr: 'STR',
    name: 'FORCE',
    desc: 'Puissance de poussée et de tirage',
    calisthenicsEffect: 'Pompes, tractions strictes, dips profonds, force brute sur barre',
    color: '#38bdf8', // sky-400
  },
  {
    key: 'agility',
    abbr: 'AGI',
    name: 'AGILITÉ',
    desc: 'Équilibre, coordination et tempo explosif',
    calisthenicsEffect: 'Handstand libre, muscle-ups dynamiques, transitions propres',
    color: '#00d2ff', // cyan-400
  },
  {
    key: 'endurance',
    abbr: 'END',
    name: 'ENDURANCE',
    desc: 'Résistance à l\'acide lactique et volume',
    calisthenicsEffect: 'Max reps consécutives, séries géantes, gainage prolongé',
    color: '#818cf8', // indigo-400
  },
  {
    key: 'vitality',
    abbr: 'VIT',
    name: 'VITALITÉ',
    desc: 'Récupération rapide et résistance aux blessures',
    calisthenicsEffect: 'Réduction de la fatigue résiduelle, réparation des tissus tendineux',
    color: '#34d399', // emerald-400
  },
  {
    key: 'intelligence',
    abbr: 'TEC',
    name: 'TECHNIQUE',
    desc: 'Maîtrise de la forme et contrôle scapulaire',
    calisthenicsEffect: 'Verrouillage articulaire, rétroversion pelvienne, tension sous contrôle',
    color: '#c084fc', // purple-400
  },
];

export const StatusScreen: React.FC = () => {
  const {
    profile,
    allocateStatPoint,
    resetStats,
    recoverFatigue,
    updateProfileName,
    updateProfileTitle,
  } = useSystem();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(profile.name);
  const [tempTitle, setTempTitle] = useState(profile.title);
  const [showStatHelp, setShowStatHelp] = useState(false);

  const handleSaveProfile = () => {
    updateProfileName(tempName.trim() || 'Chasseur');
    updateProfileTitle(tempTitle.trim() || 'Éveilleur Calisthénie');
    setIsEditingProfile(false);
  };

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.xpToNextLevel) * 100));

  // Determine rank color
  const rankColors: Record<string, string> = {
    E: 'text-slate-400 border-slate-500/40 bg-slate-900/40',
    D: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40',
    C: 'text-blue-400 border-blue-500/40 bg-blue-950/40',
    B: 'text-purple-400 border-purple-500/40 bg-purple-950/40',
    A: 'text-amber-400 border-amber-500/40 bg-amber-950/40',
    S: 'text-rose-400 border-rose-500/40 bg-rose-950/40',
  };

  return (
    <div className="space-y-4 pb-4 animate-in fade-in duration-300">
      {/* Top Holographic Header Banner */}
      <div className="cyber-box rounded-xl p-4 hologram-scanline border border-cyan-500/30">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-widest">
              [ FENÊTRE D'ÉTAT : STATUT ]
            </span>
          </div>
          <button
            onClick={() => setShowStatHelp(!showStatHelp)}
            className="w-7 h-7 rounded border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-950/50 transition-colors"
            title="Guide des Caractéristiques"
          >
            <Info size={14} />
          </button>
        </div>

        {/* Hunter Identity Lockup */}
        <div className="flex items-center gap-3.5">
          {/* Avatar with cyan aura wisp */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.4)] shrink-0">
            <img
              src={hunterAvatarImg}
              alt="Portrait du Chasseur"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 text-center bg-black/60 py-0.5">
              <span className="text-[9px] font-mono-tech text-cyan-300 font-bold">
                RANG {profile.rank}
              </span>
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex-1 min-w-0">
            {isEditingProfile ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded bg-slate-900 border border-cyan-500/50 text-white font-system"
                  placeholder="Nom du Chasseur"
                />
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  className="w-full px-2 py-1 text-[11px] rounded bg-slate-900 border border-cyan-500/50 text-cyan-300 font-system"
                  placeholder="Titre"
                />
                <button
                  onClick={handleSaveProfile}
                  className="px-2 py-0.5 rounded bg-cyan-500 text-black text-[10px] font-system font-bold flex items-center gap-1"
                >
                  <Check size={11} /> Sauvegarder
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-base font-system font-bold text-white text-glow-cyan uppercase tracking-wide truncate">
                    {profile.name}
                  </h1>
                  <button
                    onClick={() => {
                      setTempName(profile.name);
                      setTempTitle(profile.title);
                      setIsEditingProfile(true);
                    }}
                    className="text-slate-400 hover:text-cyan-400 p-1"
                    title="Modifier le nom"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
                <div className="text-xs text-cyan-400 font-system tracking-wide">
                  {profile.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono-tech">
                  Job : {profile.job}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Level and XP progress */}
        <div className="mt-4 pt-3 border-t border-cyan-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-system">
            <span className="text-white font-bold tracking-wide flex items-center gap-1.5">
              <Sparkles size={13} className="text-cyan-400" />
              NIVEAU {profile.level}
            </span>
            <span className="text-cyan-300 font-mono-tech text-[11px]">
              {profile.xp.toLocaleString()} / {profile.xpToNextLevel.toLocaleString()} XP ({xpPercent}%)
            </span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-cyan-300 transition-all duration-500 shadow-[0_0_10px_#00d2ff]"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>

        {/* Dual Energy Bars (HP & MP) + Fatigue */}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-system">
          {/* HP */}
          <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Heart size={11} /> HP
              </span>
              <span className="font-mono-tech">{profile.hp} / {profile.maxHp}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${(profile.hp / profile.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* MP */}
          <div className="p-2 rounded bg-cyan-950/30 border border-cyan-500/20">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                <Zap size={11} /> MP
              </span>
              <span className="font-mono-tech">{profile.mp} / {profile.maxMp}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400"
                style={{ width: `${(profile.mp / profile.maxMp) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fatigue Meter with Recovery */}
        <div className="mt-2.5 p-2 rounded bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame
              size={14}
              className={profile.fatigue > 60 ? 'text-red-400 animate-pulse' : 'text-amber-400'}
            />
            <span className="text-xs font-system text-slate-300">Fatigue :</span>
            <span
              className={`text-xs font-mono-tech font-bold ${
                profile.fatigue > 75
                  ? 'text-red-400'
                  : profile.fatigue > 40
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {profile.fatigue}%
            </span>
          </div>

          <button
            onClick={recoverFatigue}
            className="px-2.5 py-1 rounded border border-cyan-400/40 bg-cyan-950/50 hover:bg-cyan-900/50 text-[10px] font-system font-semibold text-cyan-300 transition-colors flex items-center gap-1"
          >
            <BatteryCharging size={12} />
            Récupération
          </button>
        </div>
      </div>

      {/* Available Points Announcement Banner */}
      {profile.availablePoints > 0 ? (
        <div className="cyber-box rounded-xl p-3 bg-cyan-950/60 border border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.25)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-cyan-500 text-black font-system font-bold flex items-center justify-center text-sm shadow-[0_0_10px_#00d2ff]">
              +{profile.availablePoints}
            </div>
            <div>
              <div className="text-xs font-system font-bold text-white uppercase tracking-wider">
                Points Disponibles
              </div>
              <div className="text-[10px] text-cyan-300">
                Augmentez vos caractéristiques de calisthénie
              </div>
            </div>
          </div>
          <button
            onClick={resetStats}
            className="px-2 py-1 rounded border border-cyan-500/30 text-[10px] font-system text-slate-300 hover:text-white flex items-center gap-1"
            title="Réinitialiser les points attribués"
          >
            <RotateCcw size={10} /> Reset
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 font-mono-tech">
          <span>Points disponibles : 0</span>
          <button
            onClick={resetStats}
            className="hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={11} /> Réinitialiser
          </button>
        </div>
      )}

      {/* Calisthenics Help Drawer */}
      {showStatHelp && (
        <div className="cyber-box rounded-xl p-3.5 bg-[#08152b] border border-cyan-400/40 text-xs space-y-2 animate-in fade-in duration-200">
          <div className="font-system font-bold text-cyan-300 uppercase tracking-wide">
            GUIDE DES CARACTÉRISTIQUES DE CALISTHÉNIE
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Chaque répétition d'exercice alimente la <strong>progression cyclique</strong> de vos stats.
            Lorsque le cercle atteint 100%, la caractéristique gagne +1 point naturel en plus de ceux attribués !
          </p>
          <div className="space-y-1 text-[11px]">
            <div><strong className="text-sky-300">STR (Force) :</strong> Pompes, dips, tractions et lesté.</div>
            <div><strong className="text-cyan-300">AGI (Agilité) :</strong> Handstand, équilibre, vitesse d'exécution.</div>
            <div><strong className="text-indigo-300">END (Endurance) :</strong> Volume de répétitions et résistance.</div>
            <div><strong className="text-emerald-300">VIT (Vitalité) :</strong> Vitesse de récupération physique.</div>
            <div><strong className="text-purple-300">TEC (Technique) :</strong> Verrouillage scapulaire et forme parfaite.</div>
          </div>
        </div>
      )}

      {/* Main 5 Calisthenics Stats with Cyclic Progress Bars */}
      <div className="space-y-2.5">
        <div className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-wider px-1">
          CARACTÉRISTIQUES D'ÉVEILLÉ & PROGRESSION CYCLIQUE
        </div>

        {STAT_METAS.map((meta) => {
          const val = profile.stats[meta.key];
          const cyclicProgress = profile.statCyclicProgress[meta.key] || 0;
          const canAdd = profile.availablePoints > 0;

          // SVG cyclic circular radius math
          const radius = 18;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (cyclicProgress / 100) * circumference;

          return (
            <div
              key={meta.key}
              className="cyber-box rounded-xl p-3 bg-[#061224]/85 border border-cyan-500/25 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-3"
            >
              {/* Left: Cyclic Progress Ring + Stat Name */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Cyclic Circular Progress Meter */}
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                  <svg className="w-12 h-12 -rotate-90">
                    {/* Background track */}
                    <circle
                      cx="24"
                      cy="24"
                      r={radius}
                      stroke="rgba(0, 210, 255, 0.15)"
                      strokeWidth="3"
                      fill="transparent"
                    />
                    {/* Cyclic active progress bar */}
                    <circle
                      cx="24"
                      cy="24"
                      r={radius}
                      stroke={meta.color}
                      strokeWidth="3.5"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-mono-tech font-bold text-slate-200">
                    {cyclicProgress}%
                  </span>
                </div>

                {/* Stat metadata */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono-tech text-cyan-400 font-bold">
                      [{meta.abbr}]
                    </span>
                    <span className="text-xs font-system font-bold text-white tracking-wide">
                      {meta.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {meta.calisthenicsEffect}
                  </p>
                </div>
              </div>

              {/* Right: Value & Allocation Button */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-base font-mono-tech font-bold text-cyan-300 min-w-[28px] text-right">
                  {val}
                </span>

                <button
                  onClick={() => allocateStatPoint(meta.key)}
                  disabled={!canAdd}
                  className={`w-8 h-8 rounded flex items-center justify-center transition-all ${
                    canAdd
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_10px_#00d2ff] active:scale-95 cursor-pointer'
                      : 'bg-slate-900/60 border border-slate-700/50 text-slate-600 cursor-not-allowed'
                  }`}
                  aria-label={`Augmenter ${meta.name}`}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
