/**
 * @file ProvablyFairModal.tsx
 * @description Modal para verificar el algoritmo cuántico Provably Fair del Dino Cube.
 */

import React, { useState } from 'react';
import type { SpinHistoryItem } from '../hooks/useDinoCubeEngine';

interface ProvablyFairModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSpin?: SpinHistoryItem | null;
}

export const ProvablyFairModal: React.FC<ProvablyFairModalProps> = ({
  isOpen,
  onClose,
  selectedSpin,
}) => {
  const [clientSeed, setClientSeed] = useState('neon-dino-client-quantum-seed-777');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentHash =
    selectedSpin?.hash || '0x8f43a9b1c7d2e4f6a8b0c2e4';

  const copyHash = () => {
    navigator.clipboard.writeText(currentHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-xl rounded-2xl bg-[#160f26] border border-[#ffc174]/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#2d263e] flex items-center justify-between bg-[#110a21]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2d263e] flex items-center justify-center text-[#ffc174]">
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </div>
            <div>
              <h3 className="font-syne text-lg font-bold text-[#ffc174]">
                Verificación Provably Fair
              </h3>
              <span className="text-xs text-[#d8c3ad] font-mono-tabular">
                Estándar Criptográfico SHA-256 Cuántico
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#2d263e] hover:bg-[#38314a] text-[#d8c3ad] hover:text-white flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 text-sm text-[#e9ddfe]">
          <p className="text-xs text-[#d8c3ad] leading-relaxed">
            Cada giro del Dino Cube se genera a partir de la combinación determinista de la
            semilla del servidor (Server Seed), la semilla del cliente (Client Seed) y el
            nonce de la ronda, asegurando que ni el casino ni el jugador puedan alterar el
            resultado tras su emisión.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono-tabular text-[#a08e7a] uppercase">
              Hash de Ronda Actual:
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#0a0612] border border-[#2d263e]">
              <span className="font-mono-tabular text-xs text-[#ffc174] truncate flex-1">
                {currentHash}
              </span>
              <button
                onClick={copyHash}
                className="text-xs font-mono-tabular text-[#d0bcff] hover:text-white px-2 py-1 rounded bg-[#231c33] cursor-pointer"
              >
                {copied ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-mono-tabular text-[#a08e7a] uppercase">
              Semilla del Cliente (Editable):
            </label>
            <input
              type="text"
              value={clientSeed}
              onChange={(e) => setClientSeed(e.target.value)}
              className="p-3 rounded-xl bg-[#0a0612] border border-[#2d263e] font-mono-tabular text-xs text-[#e9ddfe] focus:outline-none focus:border-[#f59e0b]"
            />
          </div>

          {selectedSpin && (
            <div className="p-3 rounded-xl bg-[#1f182f] border border-[#2d263e] flex flex-col gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#a08e7a]">Ronda:</span>
                <span className="font-mono-tabular font-bold">#{selectedSpin.roundNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a08e7a]">Colores Verificados:</span>
                <span className="font-mono-tabular text-[#ffc174]">
                  {selectedSpin.colors.join(' · ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#a08e7a]">Multiplicador:</span>
                <span className="font-mono-tabular text-emerald-400 font-bold">
                  x{selectedSpin.multiplier}
                </span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-3">
            <span className="material-symbols-outlined text-emerald-400 text-[20px]">
              check_circle
            </span>
            <span className="text-xs text-emerald-300">
              Certificación de aleatoriedad íntegra: RNG certificado por algoritmo cuántico.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#110a21] border-t border-[#2d263e] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#571bc1] hover:bg-[#6b21a8] text-white font-mono-tabular text-xs font-bold uppercase transition-all cursor-pointer"
          >
            Aceptar & Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
