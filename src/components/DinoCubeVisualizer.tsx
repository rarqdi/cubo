/**
 * @file DinoCubeVisualizer.tsx
 * @description Componente visual de la cara frontal del "Dino Cube" dividida en 4 triángulos.
 * Incluye animaciones cinemáticas, rotación cuántica, gradientes cyberpunk y centro holográfico.
 */

import React from 'react';
import type { DinoCubeColor } from '../hooks/useDinoCubeEngine';

interface FacetVisualConfig {
  displayName: string;
  themeColor: string;
  gradient: string;
  symbol: string;
  textColor: string;
}

export const COLOR_CONFIG: Record<DinoCubeColor, FacetVisualConfig> = {
  Amarillo: {
    displayName: 'AMBER',
    themeColor: '#f59e0b',
    gradient: 'linear-gradient(180deg, #f59e0b 0%, #b45309 85%, #160f26 100%)',
    symbol: 'local_fire_department',
    textColor: '#ffffff',
  },
  Azul: {
    displayName: 'CYAN',
    themeColor: '#0ea5e9',
    gradient: 'linear-gradient(270deg, #0ea5e9 0%, #0369a1 85%, #160f26 100%)',
    symbol: 'diamond',
    textColor: '#ffffff',
  },
  Verde: {
    displayName: 'DINO JADE',
    themeColor: '#10b981',
    gradient: 'linear-gradient(90deg, #10b981 0%, #047857 85%, #160f26 100%)',
    symbol: 'cruelty_free',
    textColor: '#ffffff',
  },
  Rojo: {
    displayName: 'RUBY',
    themeColor: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #991b1b 85%, #160f26 100%)',
    symbol: 'bolt',
    textColor: '#ffffff',
  },
  Naranja: {
    displayName: 'TANGERINE',
    themeColor: '#f97316',
    gradient: 'linear-gradient(180deg, #f97316 0%, #c2410c 85%, #160f26 100%)',
    symbol: 'flare',
    textColor: '#ffffff',
  },
  Blanco: {
    displayName: 'OPAL',
    themeColor: '#f8fafc',
    gradient: 'linear-gradient(45deg, #f8fafc 0%, #94a3b8 85%, #160f26 100%)',
    symbol: 'stars',
    textColor: '#0f172a',
  },
};

interface DinoCubeVisualizerProps {
  colors: [DinoCubeColor, DinoCubeColor, DinoCubeColor, DinoCubeColor];
  isSpinning: boolean;
  moves: number;
}

export const DinoCubeVisualizer: React.FC<DinoCubeVisualizerProps> = ({
  colors,
  isSpinning,
  moves,
}) => {
  // Calculamos rotación cinemática acumulativa según la cantidad de movimientos
  const rotationDegrees = isSpinning ? moves * 90 : 0;
  const topColor = COLOR_CONFIG[colors[0]] || COLOR_CONFIG.Amarillo;
  const rightColor = COLOR_CONFIG[colors[1]] || COLOR_CONFIG.Azul;
  const bottomColor = COLOR_CONFIG[colors[2]] || COLOR_CONFIG.Rojo;
  const leftColor = COLOR_CONFIG[colors[3]] || COLOR_CONFIG.Verde;

  return (
    <div className="relative py-6 flex flex-col items-center justify-center select-none">
      {/* EL DINO CUBE CORE CONTAINER */}
      <div
        className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl bg-[#110a21] p-2 shadow-[0_0_50px_rgba(245,158,11,0.25)] transition-transform ease-out"
        style={{
          transform: isSpinning
            ? `scale(0.92) rotate(${rotationDegrees}deg)`
            : 'scale(1) rotate(0deg)',
          transitionDuration: isSpinning ? `${moves * 150}ms` : '600ms',
        }}
      >
        {/* Outer High-Poly Bevel Rim */}
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#110a21] border border-[#2d263e]">
          {/* TOP FACET TRIANGLE (0) */}
          <div
            className="absolute inset-0 cursor-pointer transition-all duration-300 hover:brightness-110 facet-top-clip"
            style={{
              background: topColor.gradient,
            }}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none drop-shadow-md">
              <span className="material-symbols-outlined text-[26px] opacity-95">
                {topColor.symbol}
              </span>
              <span className="font-mono-tabular text-[11px] font-bold tracking-widest uppercase">
                {topColor.displayName}
              </span>
            </div>
          </div>

          {/* RIGHT FACET TRIANGLE (1) */}
          <div
            className="absolute inset-0 cursor-pointer transition-all duration-300 hover:brightness-110 facet-right-clip"
            style={{
              background: rightColor.gradient,
            }}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none drop-shadow-md">
              <span className="material-symbols-outlined text-[26px] opacity-95">
                {rightColor.symbol}
              </span>
              <span className="font-mono-tabular text-[11px] font-bold tracking-widest uppercase">
                {rightColor.displayName}
              </span>
            </div>
          </div>

          {/* BOTTOM FACET TRIANGLE (2) */}
          <div
            className="absolute inset-0 cursor-pointer transition-all duration-300 hover:brightness-110 facet-bottom-clip"
            style={{
              background: bottomColor.gradient,
            }}
          >
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none drop-shadow-md">
              <span className="material-symbols-outlined text-[26px] opacity-95">
                {bottomColor.symbol}
              </span>
              <span className="font-mono-tabular text-[11px] font-bold tracking-widest uppercase">
                {bottomColor.displayName}
              </span>
            </div>
          </div>

          {/* LEFT FACET TRIANGLE (3) */}
          <div
            className="absolute inset-0 cursor-pointer transition-all duration-300 hover:brightness-110 facet-left-clip"
            style={{
              background: leftColor.gradient,
            }}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none drop-shadow-md">
              <span className="material-symbols-outlined text-[26px] opacity-95">
                {leftColor.symbol}
              </span>
              <span className="font-mono-tabular text-[11px] font-bold tracking-widest uppercase">
                {leftColor.displayName}
              </span>
            </div>
          </div>

          {/* Mechanical 'X' Seam Divider Overlay */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="#110a21"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <line
              x1="100"
              y1="0"
              x2="0"
              y2="100"
              stroke="#110a21"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1="0"
              x2="100"
              y2="100"
              stroke="#2d263e"
              strokeWidth="1.5"
              opacity="0.7"
            />
            <line
              x1="100"
              y1="0"
              x2="0"
              y2="100"
              stroke="#2d263e"
              strokeWidth="1.5"
              opacity="0.7"
            />
          </svg>

          {/* Core Quantum Hub Center Cap */}
          <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-[#110a21] flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.9)] z-20 border border-[#38314a]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2d263e] to-[#38314a] flex items-center justify-center shadow-inner">
              <span
                className={`material-symbols-outlined text-[#ffc174] text-[20px] transition-transform ${
                  isSpinning ? 'animate-spin' : 'animate-pulse'
                }`}
              >
                {isSpinning ? 'autorenew' : 'lock_open'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Kinetic Ground Plasma Shadow */}
      <div
        className="w-56 sm:w-72 md:w-80 h-6 mt-4 rounded-full bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent blur-md transition-all duration-700"
        style={{
          transform: isSpinning ? 'scale(0.8)' : 'scale(1)',
          opacity: isSpinning ? 0.4 : 0.8,
        }}
      />
    </div>
  );
};
