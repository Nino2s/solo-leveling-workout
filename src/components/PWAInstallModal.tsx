import React, { useState } from 'react';
import {
  Download,
  Smartphone,
  Share,
  PlusSquare,
  CheckCircle,
  X,
  Sparkles,
  ExternalLink,
  Copy,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sounds } from '../utils/audio';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use the clean origin URL without internal iframe paths or subroutes
  const cleanAppUrl =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : 'https://ais-dev-vlgebk4kuihzz52row33qa-922827265731.europe-west2.run.app';

  const handleInstallClick = async () => {
    sounds.playLevelUp();
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cleanAppUrl);
      setCopied(true);
      sounds.playCountBeep();
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="cyber-box rounded-xl p-5 max-w-sm w-full bg-[#061224] border border-cyan-400 shadow-[0_0_35px_rgba(0,210,255,0.4)] hologram-scanline relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-3">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-cyan-400" />
            <span className="text-xs font-system font-bold text-white uppercase tracking-wider text-glow-cyan">
              INSTALLER L'APPLICATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded border border-cyan-500/30 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3.5 text-xs font-system">
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Vous pouvez installer le <strong>Système de Calisthénie</strong> directement sur votre téléphone (iOS & Android) pour l'utiliser comme une <strong>vraie application mobile</strong> : plein écran, icône sur l'écran d'accueil et fonctionnement hors-ligne.
          </p>

          {/* Android / Chrome Flow */}
          {isInstallable && (
            <div className="p-3 rounded-lg bg-cyan-950/50 border border-cyan-400/50 text-center space-y-2">
              <span className="text-[10px] font-mono-tech text-cyan-300 uppercase block">
                [ INSTALLATION RAPIDE DÉTECTÉE ]
              </span>
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 px-4 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-system font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_#00d2ff] flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>Installer sur mon Téléphone</span>
              </button>
            </div>
          )}

          {/* iOS Safari Guide */}
          <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20 space-y-2">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase text-[11px]">
              <Sparkles size={12} />
              <span>Sur iPhone / iPad (Safari) :</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-mono-tech text-[10px] flex items-center justify-center shrink-0 border border-cyan-500/40">
                  1
                </span>
                <span>
                  Ouvrez ce lien dans <strong>Safari</strong>.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-mono-tech text-[10px] flex items-center justify-center shrink-0 border border-cyan-500/40">
                  2
                </span>
                <span>
                  Touchez le bouton <strong>Partager</strong> <Share size={12} className="inline mx-1 text-cyan-400" /> en bas de l'écran.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-950 text-cyan-400 font-mono-tech text-[10px] flex items-center justify-center shrink-0 border border-cyan-500/40">
                  3
                </span>
                <span>
                  Faites défiler vers le bas et appuyez sur <strong>« Sur l'écran d'accueil »</strong> <PlusSquare size={12} className="inline mx-1 text-cyan-400" />.
                </span>
              </div>
            </div>
          </div>

          {/* Android Chrome Guide */}
          {!isInstallable && (
            <div className="p-3 rounded-lg bg-slate-900/80 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase text-[11px]">
                <Smartphone size={12} />
                <span>Sur Android (Chrome) :</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Touchez les <strong>3 petits points</strong> en haut à droite du navigateur, puis sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
              </p>
            </div>
          )}

          {/* Copy Link to Phone */}
          <div className="pt-2 border-t border-cyan-500/20">
            <span className="text-[10px] text-slate-400 block mb-1 font-mono-tech uppercase">
              Lien direct de votre application :
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={cleanAppUrl}
                className="flex-1 py-1 px-2 rounded bg-slate-950 border border-slate-700 text-slate-300 text-[10px] font-mono-tech truncate"
              />
              <button
                onClick={handleCopyLink}
                className="py-1 px-2.5 rounded bg-cyan-950 border border-cyan-500/40 hover:bg-cyan-900 text-cyan-300 text-[10px] font-system font-bold flex items-center gap-1 shrink-0"
              >
                {copied ? <CheckCircle size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>

          {/* Permanent Hosting & ZIP Download */}
          <div className="pt-2.5 border-t border-cyan-500/20 space-y-2">
            <span className="text-[10px] text-amber-400 font-mono-tech font-bold uppercase block flex items-center gap-1">
              <Sparkles size={11} />
              Accès 24h/24 permanent (Sans mise en veille) :
            </span>
            <p className="text-[10px] text-slate-400 leading-normal">
              Téléchargez le code complet (.zip) en 1 clic puis glissez-le sur <strong>Netlify Drop</strong> ou <strong>Vercel</strong> pour un lien définitif gratuit.
            </p>
            <a
              href="/solo-leveling-system.zip"
              download="solo-leveling-system.zip"
              className="w-full py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-300 font-system font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-2"
            >
              <Download size={13} className="text-cyan-400" />
              <span>Télécharger le Code Source (.ZIP)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
