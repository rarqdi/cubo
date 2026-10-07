/**
 * @file HighRollerTab.tsx
 * @description Salón VIP Obsidian para apuestas de alto calibre y multiplicadores especiales.
 */

import React, { useState } from 'react';
import type { DinoCubeColor } from '../hooks/useDinoCubeEngine';
import { DinoCubeVisualizer } from './DinoCubeVisualizer';
import { soundFx } from '../utils/audio';

interface HighRollerTabProps {
  balance: number;
  isSpinning: boolean;
  currentColors: [DinoCubeColor, DinoCubeColor, DinoCubeColor, DinoCubeColor];
  onSpin: (moves: number, bet: number) => Promise<unknown>;
}

export const HighRollerTab: React.FC<HighRollerTabProps> = ({
  balance,
  isSpinning,
  currentColors,
  onSpin,
}) => {
  const [moves, setMoves] = useState(15);
  const [vipBet, setVipBet] = useState(100);

  const vipBetTiers = [100, 250, 500, 1000];

  const handleHighStakesSpin = () => {
    soundFx.playStartShuffle();
    onSpin(moves, vipBet);
  };

  return (
    <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto py-4">
      <div className="glass-card rounded-2xl p-6 lg:p-8 border border-[#f59e0b]/50 bg-gradient-to-r from-[#231c33] via-[#1f182f] to-[#110a21]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc174] text-[22px]">
                workspace_premium
              </span>
              <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#ffc174] font-bold">
                Salón Privado VIP Obsidian
              </span>
            </div>
            <h2 className="font-syne text-3xl font-bold text-[#e9ddfe] mt-1">
              High Roller Suite
            </h2>
            <p className="text-sm text-[#d8c3ad] max-w-lg mt-1">
              Mesa exclusiva reservada para jugadas de alta liquidez. Multiplicador Jackpot x50 con
              pagos de hasta $50,000 en un solo giro.
            </p>
          </div>
          <div className="px-5 py-3 rounded-xl bg-[#0a0612] border border-[#ffc174]/40 text-right">
            <span className="text-[11px] text-[#a08e7a] font-mono-tabular uppercase block">
              Saldo Disponible
            </span>
            <span className="font-mono-tabular text-2xl font-bold text-[#ffc174]">
              ${balance.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visualizador central */}
        <div className="lg:col-span-7 glass-card rounded-2xl p-6 flex flex-col items-center justify-center">
          <DinoCubeVisualizer
            colors={currentColors}
            isSpinning={isSpinning}
            moves={moves}
          />
        </div>

        {/* Consola de apuestas VIP */}
        <div className="lg:col-span-5 flex flex-col gap-5 glass-card rounded-2xl p-6">
          <span className="font-syne text-lg font-bold text-[#ffc174] uppercase">
            Control de Alta Apuesta
          </span>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono-tabular">
              <span className="text-[#a08e7a]">Apuesta High Roller:</span>
              <span className="text-lg font-bold text-[#ffc174]">${vipBet}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {vipBetTiers.map((tier) => (
                <button
                  key={tier}
                  onClick={() => {
                    soundFx.playClick();
                    setVipBet(tier);
                  }}
                  className={`py-3 rounded-xl font-mono-tabular text-sm font-bold transition-all cursor-pointer ${
                    vipBet === tier
                      ? 'bg-[#f59e0b] text-[#110a21] shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-[#231c33] text-[#e9ddfe] hover:bg-[#2d263e] border border-[#38314a]'
                  }`}
                >
                  ${tier}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-xs font-mono-tabular">
              <span className="text-[#a08e7a]">Movimientos Cuánticos:</span>
              <span className="text-sm font-bold text-[#ffc174]">{moves}</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={moves}
              disabled={isSpinning}
              onChange={(e) => setMoves(Number(e.target.value))}
              className="accent-[#f59e0b] h-2 bg-[#110a21] rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#0a0612] border border-[#38314a] text-xs font-mono-tabular flex justify-between">
            <span className="text-[#a08e7a]">Premio Jackpot Potencial:</span>
            <span className="text-emerald-400 font-bold text-sm">
              ${(vipBet * 50).toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleHighStakesSpin}
            disabled={isSpinning || balance < vipBet}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 via-[#f59e0b] to-amber-600 text-[#110a21] font-syne text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_35px_rgba(245,158,11,0.45)] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[24px]">casino</span>
            <span>{isSpinning ? 'Mezclando...' : 'Giro High Roller'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
