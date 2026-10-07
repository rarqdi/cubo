/**
 * @file HistoryTab.tsx
 * @description Registro completo de auditoría en vivo del Dino Cube (Historial de giros).
 */

import React from 'react';
import type { SpinHistoryItem } from '../hooks/useDinoCubeEngine';
import { COLOR_CONFIG } from './DinoCubeVisualizer';

interface HistoryTabProps {
  history: SpinHistoryItem[];
  onSelectSpinForVerification: (spin: SpinHistoryItem) => void;
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
  onSelectSpinForVerification,
}) => {
  return (
    <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto py-4">
      <div className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#d0bcff]">
            Bóveda Criptográfica en Tiempo Real
          </span>
          <h2 className="font-syne text-3xl font-bold text-[#ffc174] mt-1">
            Historial de Giros & Auditoría
          </h2>
          <p className="text-sm text-[#d8c3ad] mt-1">
            Audita cada jugada con su combinación de 4 facetas, multiplicador y hash SHA-256.
          </p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-[#110a21] border border-[#38314a] font-mono-tabular text-xs text-[#d8c3ad]">
          Total Rondas Registradas: <span className="text-[#ffc174] font-bold">{history.length}</span>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-[#2d263e]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono-tabular">
            <thead className="bg-[#110a21] text-[#a08e7a] uppercase border-b border-[#2d263e]">
              <tr>
                <th className="py-3 px-4">Ronda</th>
                <th className="py-3 px-4">Facetas (4 Colores)</th>
                <th className="py-3 px-4">Movimientos</th>
                <th className="py-3 px-4">Apuesta</th>
                <th className="py-3 px-4">Multiplicador</th>
                <th className="py-3 px-4">Ganancia Bruta</th>
                <th className="py-3 px-4">Neto</th>
                <th className="py-3 px-4 text-right">Provably Fair</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2d263e]">
              {history.map((spin) => {
                const isWin = spin.multiplier > 0;
                return (
                  <tr
                    key={spin.id}
                    className="hover:bg-[#231c33]/60 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-[#e9ddfe]">
                      #{spin.roundNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {spin.colors.map((c, i) => {
                          const cfg = COLOR_CONFIG[c] || COLOR_CONFIG.Amarillo;
                          return (
                            <div
                              key={i}
                              title={`${i}: ${c}`}
                              className="w-5 h-5 rounded flex items-center justify-center text-[10px] text-white shadow-sm font-bold"
                              style={{ background: cfg.gradient }}
                            >
                              <span className="material-symbols-outlined text-[12px]">
                                {cfg.symbol}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#d8c3ad]">{spin.moves} movs</td>
                    <td className="py-3 px-4 text-[#e9ddfe]">${spin.bet.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          spin.multiplier === 50
                            ? 'bg-[#f59e0b] text-[#110a21]'
                            : spin.multiplier === 10
                            ? 'bg-[#0ea5e9] text-white'
                            : spin.multiplier === 5
                            ? 'bg-[#8b5cf6] text-white'
                            : spin.multiplier === 2
                            ? 'bg-rose-500 text-white'
                            : 'bg-[#2d263e] text-[#a08e7a]'
                        }`}
                      >
                        x{spin.multiplier}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#e9ddfe]">
                      ${spin.payout.toFixed(2)}
                    </td>
                    <td
                      className={`py-3 px-4 font-bold ${
                        isWin ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {spin.netProfit >= 0 ? `+$${spin.netProfit.toFixed(2)}` : `-$${Math.abs(spin.netProfit).toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onSelectSpinForVerification(spin)}
                        className="text-[#ffc174] hover:underline font-mono-tabular text-[11px] cursor-pointer"
                      >
                        {spin.hash.substring(0, 8)}...
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
