/**
 * @file PaytableTab.tsx
 * @description Vista detallada de la tabla de pagos, probabilidades exactas, combinatoria
 * y simulador Monte Carlo de verificación de RNG para Neon Dino Cube.
 */

import React, { useState } from 'react';
import { evaluateDinoCubeColors, DINO_CUBE_COLORS } from '../hooks/useDinoCubeEngine';

interface MonteCarloStats {
  totalSpins: number;
  jackpot: number;
  threeOfAKind: number;
  twoPairs: number;
  onePair: number;
  noMatch: number;
  totalBet: number;
  totalWon: number;
}

export const PaytableTab: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [stats, setStats] = useState<MonteCarloStats | null>(null);

  const runSimulation = (spinsCount: number = 2000) => {
    setIsSimulating(true);
    setTimeout(() => {
      let jackpot = 0;
      let threeOfAKind = 0;
      let twoPairs = 0;
      let onePair = 0;
      let noMatch = 0;
      const bet = 10;
      let totalWon = 0;

      for (let i = 0; i < spinsCount; i++) {
        const c1 = DINO_CUBE_COLORS[Math.floor(Math.random() * 6)];
        const c2 = DINO_CUBE_COLORS[Math.floor(Math.random() * 6)];
        const c3 = DINO_CUBE_COLORS[Math.floor(Math.random() * 6)];
        const c4 = DINO_CUBE_COLORS[Math.floor(Math.random() * 6)];
        const evalRes = evaluateDinoCubeColors([c1, c2, c3, c4]);

        if (evalRes.outcomeType === 'JACKPOT') jackpot++;
        else if (evalRes.outcomeType === 'THREE_OF_A_KIND') threeOfAKind++;
        else if (evalRes.outcomeType === 'TWO_PAIRS') twoPairs++;
        else if (evalRes.outcomeType === 'ONE_PAIR') onePair++;
        else noMatch++;

        totalWon += bet * evalRes.multiplier;
      }

      setStats({
        totalSpins: spinsCount,
        jackpot,
        threeOfAKind,
        twoPairs,
        onePair,
        noMatch,
        totalBet: spinsCount * bet,
        totalWon,
      });
      setIsSimulating(false);
    }, 100);
  };

  return (
    <div className="w-full flex flex-col gap-8 max-w-5xl mx-auto py-4">
      {/* Header Banner */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#d0bcff]">
            Arquitectura Probabilística Certificada
          </span>
          <h2 className="font-syne text-3xl font-bold text-[#ffc174] mt-1">
            Matemática & Tabla de Pagos
          </h2>
          <p className="text-sm text-[#d8c3ad] max-w-xl mt-2">
            El espacio muestral del Dino Cube consta de 6 colores en 4 triángulos
            independientes, originando exactamente 6⁴ = 1,296 combinaciones equiprobables.
          </p>
        </div>
        <div className="px-5 py-3 rounded-xl bg-[#110a21] border border-[#ffc174]/30 text-center">
          <span className="text-xs uppercase tracking-widest text-[#d8c3ad] block font-mono-tabular">
            RTP Teórico
          </span>
          <span className="font-mono-tabular text-2xl font-bold text-[#ffc174]">
            261.5%
          </span>
          <span className="text-[11px] text-emerald-400 block mt-0.5">
            Alta volatilidad VIP
          </span>
        </div>
      </div>

      {/* Grid de Reglas y Combinatoria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Jackpot */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[#f59e0b] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-syne text-lg font-bold text-[#ffc174]">
                👑 4 IGUALES (JACKPOT)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f59e0b] text-[#110a21] font-mono-tabular text-sm font-bold">
                x50
              </span>
            </div>
            <p className="text-xs text-[#d8c3ad] mt-2">
              Todas las facetas adoptan el mismo color. La máxima recompensa del salón cuántico.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#38314a] grid grid-cols-3 text-xs font-mono-tabular">
            <div>
              <span className="text-[#a08e7a] block">Combinaciones:</span>
              <span className="text-[#e9ddfe] font-bold">6 / 1,296</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Probabilidad:</span>
              <span className="text-[#ffc174] font-bold">0.463%</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Frecuencia:</span>
              <span className="text-[#e9ddfe]">1 de 216 giros</span>
            </div>
          </div>
        </div>

        {/* Card 2: 3 Iguales */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[#0ea5e9] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-syne text-lg font-bold text-[#38bdf8]">
                💎 3 IGUALES (TRILOGÍA NEÓN)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0284c7] text-white font-mono-tabular text-sm font-bold">
                x10
              </span>
            </div>
            <p className="text-xs text-[#d8c3ad] mt-2">
              Tres triángulos de color idéntico y un triángulo divergente.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#38314a] grid grid-cols-3 text-xs font-mono-tabular">
            <div>
              <span className="text-[#a08e7a] block">Combinaciones:</span>
              <span className="text-[#e9ddfe] font-bold">120 / 1,296</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Probabilidad:</span>
              <span className="text-[#38bdf8] font-bold">9.259%</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Frecuencia:</span>
              <span className="text-[#e9ddfe]">1 de 10.8 giros</span>
            </div>
          </div>
        </div>

        {/* Card 3: 2 Pares */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[#8b5cf6] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-syne text-lg font-bold text-[#c084fc]">
                🎲 2 PARES (DOBLE DÚO)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#6d28d9] text-white font-mono-tabular text-sm font-bold">
                x5
              </span>
            </div>
            <p className="text-xs text-[#d8c3ad] mt-2">
              Dos pares exactos de dos colores diferentes (ej. 2 Rojos y 2 Azules).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#38314a] grid grid-cols-3 text-xs font-mono-tabular">
            <div>
              <span className="text-[#a08e7a] block">Combinaciones:</span>
              <span className="text-[#e9ddfe] font-bold">90 / 1,296</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Probabilidad:</span>
              <span className="text-[#c084fc] font-bold">6.944%</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Frecuencia:</span>
              <span className="text-[#e9ddfe]">1 de 14.4 giros</span>
            </div>
          </div>
        </div>

        {/* Card 4: 1 Par */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[#f43f5e] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-syne text-lg font-bold text-[#fb7185]">
                🍒 1 PAR (PAREJA ELEMENTAL)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#be123c] text-white font-mono-tabular text-sm font-bold">
                x2
              </span>
            </div>
            <p className="text-xs text-[#d8c3ad] mt-2">
              Exactamente dos triángulos del mismo color y los otros dos diferentes entre sí.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#38314a] grid grid-cols-3 text-xs font-mono-tabular">
            <div>
              <span className="text-[#a08e7a] block">Combinaciones:</span>
              <span className="text-[#e9ddfe] font-bold">720 / 1,296</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Probabilidad:</span>
              <span className="text-[#fb7185] font-bold">55.556%</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Frecuencia:</span>
              <span className="text-[#e9ddfe]">1 de 1.8 giros</span>
            </div>
          </div>
        </div>

        {/* Card 5: 4 Colores Distintos */}
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-[#534434] md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-syne text-lg font-bold text-[#a08e7a]">
                ✖ 4 COLORES DISTINTOS (SIN COMBINACIÓN)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#2d263e] text-[#a08e7a] font-mono-tabular text-sm font-bold">
                x0 (PIERDE)
              </span>
            </div>
            <p className="text-xs text-[#d8c3ad] mt-2">
              Los 4 triángulos muestran colores distintos entre sí. No genera premio.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#38314a] grid grid-cols-3 text-xs font-mono-tabular">
            <div>
              <span className="text-[#a08e7a] block">Combinaciones:</span>
              <span className="text-[#e9ddfe] font-bold">360 / 1,296</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Probabilidad:</span>
              <span className="text-[#a08e7a] font-bold">27.778%</span>
            </div>
            <div>
              <span className="text-[#a08e7a] block">Frecuencia:</span>
              <span className="text-[#e9ddfe]">1 de 3.6 giros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulador Monte Carlo en Vivo */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono-tabular text-xs uppercase tracking-widest text-[#ffc174]">
              Verificación Empírica Cuántica
            </span>
            <h3 className="font-syne text-2xl font-bold text-[#e9ddfe]">
              Simulador Monte Carlo de RNG
            </h3>
            <p className="text-xs text-[#d8c3ad]">
              Ejecuta miles de giros automáticos instantáneos para contrastar la convergencia
              de la Ley de los Grandes Números con las probabilidades teóricas.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => runSimulation(1000)}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-[#571bc1] hover:bg-[#6b21a8] text-white font-mono-tabular text-xs font-bold uppercase transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Simular 1,000 Giros
            </button>
            <button
              onClick={() => runSimulation(5000)}
              disabled={isSimulating}
              className="px-4 py-2 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#110a21] font-mono-tabular text-xs font-bold uppercase transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              Simular 5,000 Giros
            </button>
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-4 border-t border-[#38314a]">
            <div className="p-3 rounded-lg bg-[#110a21] border border-[#2d263e]">
              <span className="text-[10px] text-[#a08e7a] uppercase font-mono-tabular block">
                Jackpot (x50)
              </span>
              <span className="font-mono-tabular text-lg font-bold text-[#ffc174]">
                {stats.jackpot}
              </span>
              <span className="text-[11px] text-[#d8c3ad] block font-mono-tabular">
                {((stats.jackpot / stats.totalSpins) * 100).toFixed(2)}% (Teo 0.46%)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#110a21] border border-[#2d263e]">
              <span className="text-[10px] text-[#a08e7a] uppercase font-mono-tabular block">
                3 Iguales (x10)
              </span>
              <span className="font-mono-tabular text-lg font-bold text-[#38bdf8]">
                {stats.threeOfAKind}
              </span>
              <span className="text-[11px] text-[#d8c3ad] block font-mono-tabular">
                {((stats.threeOfAKind / stats.totalSpins) * 100).toFixed(2)}% (Teo 9.26%)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#110a21] border border-[#2d263e]">
              <span className="text-[10px] text-[#a08e7a] uppercase font-mono-tabular block">
                2 Pares (x5)
              </span>
              <span className="font-mono-tabular text-lg font-bold text-[#c084fc]">
                {stats.twoPairs}
              </span>
              <span className="text-[11px] text-[#d8c3ad] block font-mono-tabular">
                {((stats.twoPairs / stats.totalSpins) * 100).toFixed(2)}% (Teo 6.94%)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#110a21] border border-[#2d263e]">
              <span className="text-[10px] text-[#a08e7a] uppercase font-mono-tabular block">
                1 Par (x2)
              </span>
              <span className="font-mono-tabular text-lg font-bold text-[#fb7185]">
                {stats.onePair}
              </span>
              <span className="text-[11px] text-[#d8c3ad] block font-mono-tabular">
                {((stats.onePair / stats.totalSpins) * 100).toFixed(2)}% (Teo 55.56%)
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#110a21] border border-[#2d263e]">
              <span className="text-[10px] text-[#a08e7a] uppercase font-mono-tabular block">
                Sin Premio (x0)
              </span>
              <span className="font-mono-tabular text-lg font-bold text-[#a08e7a]">
                {stats.noMatch}
              </span>
              <span className="text-[11px] text-[#d8c3ad] block font-mono-tabular">
                {((stats.noMatch / stats.totalSpins) * 100).toFixed(2)}% (Teo 27.78%)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
