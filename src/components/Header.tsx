import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Smartphone } from 'lucide-react';
import { useSystem } from '../context/SystemContext';
import { PWAInstallModal } from './PWAInstallModal';

export const Header: React.FC = () => {
  const { profile, soundEnabled, setSoundEnabled, openPenaltyModal } = useSystem();
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#040914]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 py-2.5">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Brand Zone: Clean wordmark with holographic aesthetic */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff] animate-pulse" />
            <span className="font-system font-bold text-base tracking-wider text-cyan-400 text-glow-cyan uppercase">
              LE SYSTÈME
            </span>
            <span className="text-xs text-slate-500 font-mono-tech">
              · RANG {profile.rank}
            </span>
          </div>

          {/* Quick controls: Install App, Sound toggle, penalty warning trigger, level badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="py-1 px-2 rounded border border-cyan-400/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/40 text-[10px] font-system font-bold uppercase tracking-wider flex items-center gap-1 transition-colors shadow-[0_0_8px_rgba(0,210,255,0.2)]"
              title="Installer sur téléphone"
              aria-label="Installer l'Application"
            >
              <Smartphone size={13} className="text-cyan-400" />
              <span>App</span>
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="w-8 h-8 rounded border border-cyan-500/30 flex items-center justify-center text-cyan-400 hover:bg-cyan-950/40 transition-colors"
              title={soundEnabled ? 'Désactiver les effets sonores' : 'Activer les effets sonores'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} className="text-slate-500" />}
            </button>

            <button
              onClick={openPenaltyModal}
              className="w-8 h-8 rounded border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-950/40 transition-colors"
              title="Alerte de Pénalité"
              aria-label="Zone de Pénalité"
            >
              <ShieldAlert size={15} />
            </button>

            <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-cyan-500/30 bg-cyan-950/30">
              <Sparkles size={11} className="text-cyan-400" />
              <span className="text-[11px] font-system font-bold text-cyan-300">
                NIV.{profile.level}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </>
  );
};

