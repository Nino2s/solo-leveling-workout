import React, { useState } from 'react';
import { Gift, CheckCircle, Sparkles, HeartPulse, Award, Shield } from 'lucide-react';
import systemLootBoxImg from '../assets/images/system_loot_box_1790358868829.jpg';
import { useSystem } from '../context/SystemContext';

export const RewardModal: React.FC = () => {
  const { isRewardModalOpen, closeRewardModal } = useSystem();
  const [openedBox, setOpenedBox] = useState(false);

  if (!isRewardModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-box rounded-xl p-5 max-w-sm w-full bg-[#061224]/95 border border-cyan-400 shadow-[0_0_35px_rgba(0,210,255,0.4)] hologram-scanline relative overflow-hidden">
        {/* Top Header */}
        <div className="text-center mb-4">
          <span className="text-[11px] font-mono-tech text-cyan-400 tracking-widest uppercase">
            [ LE SYSTÈME A DÉCERNÉ UN PRIX ]
          </span>
          <h2 className="text-lg font-system font-bold text-white text-glow-cyan uppercase mt-1">
            QUÊTE QUOTIDIENNE TERMINÉE
          </h2>
          <div className="w-24 h-[1px] bg-cyan-400/60 mx-auto mt-2" />
        </div>

        {/* System Loot Box Artwork */}
        <div className="relative mb-5 flex justify-center">
          <div className="relative w-36 h-36 rounded-lg overflow-hidden border border-cyan-400/50 shadow-[0_0_20px_rgba(0,210,255,0.3)]">
            <img
              src={systemLootBoxImg}
              alt="Coffre Mystère du Système"
              className={`w-full h-full object-cover transition-transform duration-500 ${
                openedBox ? 'scale-110 brightness-125' : 'hover:scale-105'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-transparent to-transparent" />
            <div className="absolute bottom-2 left-2 right-2 text-center">
              <span className="text-[10px] font-system font-semibold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                COFFRE MYSTÈRE
              </span>
            </div>
          </div>
        </div>

        {/* 3 Iconic Rewards */}
        <div className="space-y-2.5 mb-5">
          {/* Reward 1 */}
          <div className="flex items-center gap-3 p-2.5 rounded bg-cyan-950/40 border border-cyan-500/30">
            <div className="w-8 h-8 rounded bg-cyan-900/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
              <HeartPulse size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-system font-bold text-white uppercase">
                Rétablissement Complet
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                Fatigue remise à 0% · HP & MP restaurés à 100%
              </div>
            </div>
            <CheckCircle size={15} className="text-cyan-400 shrink-0" />
          </div>

          {/* Reward 2 */}
          <div className="flex items-center gap-3 p-2.5 rounded bg-cyan-950/40 border border-cyan-500/30">
            <div className="w-8 h-8 rounded bg-cyan-900/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
              <Award size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-system font-bold text-white uppercase">
                +3 Points de Caractéristique
              </div>
              <div className="text-[11px] text-slate-300 truncate">
                À allouer dans la fenêtre de STATUT
              </div>
            </div>
            <CheckCircle size={15} className="text-cyan-400 shrink-0" />
          </div>

          {/* Reward 3 */}
          <div
            onClick={() => setOpenedBox(true)}
            className={`flex items-center gap-3 p-2.5 rounded border transition-all cursor-pointer ${
              openedBox
                ? 'bg-emerald-950/40 border-emerald-500/50'
                : 'bg-cyan-950/40 border-cyan-500/40 hover:border-cyan-300'
            }`}
          >
            <div className="w-8 h-8 rounded bg-cyan-900/60 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles size={16} className={openedBox ? 'text-emerald-400 animate-spin' : ''} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-system font-bold text-white uppercase flex items-center gap-1.5">
                <span>{openedBox ? 'Bénédiction Découverte !' : 'Coffre Aléatoire'}</span>
                {!openedBox && (
                  <span className="text-[9px] text-cyan-400 underline font-normal">(Toucher pour ouvrir)</span>
                )}
              </div>
              <div className="text-[11px] text-slate-300">
                {openedBox
                  ? '+850 XP Bonus · Buff "Endurance des Ombres" actif'
                  : 'Objet aléatoire ou bandage de régénération accélérée'}
              </div>
            </div>
            <Gift size={15} className={openedBox ? 'text-emerald-400' : 'text-cyan-400'} />
          </div>
        </div>

        {/* Claim Button */}
        <button
          onClick={closeRewardModal}
          className="w-full py-3 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 active:scale-[0.98] text-[#040914] font-system font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,210,255,0.4)] flex items-center justify-center gap-2"
        >
          <Shield size={16} />
          <span>RECEVOIR LES RÉCOMPENSES</span>
        </button>
      </div>
    </div>
  );
};
