/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { useDinoCubeEngine, type DinoCubeColor, type SpinHistoryItem } from './hooks/useDinoCubeEngine';
import { DinoCubeVisualizer, COLOR_CONFIG } from './components/DinoCubeVisualizer';
import { PaytableTab } from './components/PaytableTab';
import { HighRollerTab } from './components/HighRollerTab';
import { HistoryTab } from './components/HistoryTab';
import { CodeModal } from './components/CodeModal';
import { ProvablyFairModal } from './components/ProvablyFairModal';
import { WalletModal } from './components/WalletModal';
import { soundFx } from './utils/audio';

export default function App() {
  // Configuración del motor custom hook useDinoCubeEngine
  const {
    balance,
    isSpinning,
    currentColors,
    lastWin,
    resultMessage,
    lastMultiplier,
    lastOutcome,
    history,
    currentRound,
    spinCube,
    resetBalance,
    addBalance,
  } = useDinoCubeEngine({
    initialBalance: 1000,
    defaultBet: 25,
    msPerMovement: 150,
  });

  // Estados de la interfaz del casino
  const [activeTab, setActiveTab] = useState<'arena' | 'paytable' | 'highroller' | 'history'>('arena');
  const [moves, setMoves] = useState<number>(10);
  const [bet, setBet] = useState<number>(25);
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Estados de modales
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [isProvablyFairModalOpen, setIsProvablyFairModalOpen] = useState<boolean>(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [selectedSpinForVerification, setSelectedSpinForVerification] = useState<SpinHistoryItem | null>(null);

  const autoSpinIntervalRef = useRef<number | null>(null);

  // Sincronizar sonido
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Manejar el giro
  const handleSpin = async (customMoves?: number, customBet?: number) => {
    if (isSpinning) return;

    const actualMoves = customMoves !== undefined ? customMoves : moves;
    const actualBet = customBet !== undefined ? customBet : bet;

    soundFx.playStartShuffle();

    const result = await spinCube(actualMoves, actualBet);

    if (result.success && result.multiplier !== undefined) {
      if (result.multiplier === 50) {
        soundFx.playJackpot();
      } else if (result.multiplier > 0) {
        soundFx.playWin();
      } else {
        soundFx.playNoWin();
      }
    }
  };

  // Toggle Auto Spin
  const toggleAutoSpin = () => {
    soundFx.playClick();
    if (isAutoSpin) {
      if (autoSpinIntervalRef.current) clearInterval(autoSpinIntervalRef.current);
      autoSpinIntervalRef.current = null;
      setIsAutoSpin(false);
    } else {
      setIsAutoSpin(true);
      handleSpin();
    }
  };

  // Ciclo de auto-spin
  useEffect(() => {
    if (isAutoSpin && !isSpinning) {
      autoSpinIntervalRef.current = window.setTimeout(() => {
        if (balance >= bet) {
          handleSpin();
        } else {
          setIsAutoSpin(false);
        }
      }, 1500);
    }
    return () => {
      if (autoSpinIntervalRef.current) {
        window.clearTimeout(autoSpinIntervalRef.current);
      }
    };
  }, [isAutoSpin, isSpinning, balance, bet]);

  return (
    <div className="min-h-screen bg-[#160f26] text-[#e9ddfe] flex flex-col font-grotesk selection:bg-[#571bc1] selection:text-[#e9ddff]">
      {/* =========================================================================
          HEADER: VIP CYBERNETIC SALON
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#110a21]/80 backdrop-blur-xl border-b border-[#2d263e]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="h-20 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Brand & Wordmark */}
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveTab('arena')}
            >
              <div className="w-10 h-10 rounded-lg bg-[#2d263e] flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.25)] border border-[#ffc174]/20">
                <span className="material-symbols-outlined text-[#ffc174] text-[24px]">
                  deployed_code
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-syne text-lg font-bold uppercase tracking-wider text-[#ffc174]">
                  Neon Dino Cube
                </span>
                <span className="font-mono-tabular text-[10px] uppercase tracking-widest text-[#d8c3ad]">
                  Cybernetic VIP Salon
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden xl:flex items-center gap-1 p-1 rounded-xl bg-[#1f182f] border border-[#2d263e]">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('arena');
                }}
                className={`px-4 py-2 font-mono-tabular text-xs uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                  activeTab === 'arena'
                    ? 'bg-[#571bc1] text-[#e9ddff] shadow-sm font-bold'
                    : 'text-[#d8c3ad] hover:text-white hover:bg-[#2d263e]'
                }`}
              >
                Arena
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('paytable');
                }}
                className={`px-4 py-2 font-mono-tabular text-xs uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                  activeTab === 'paytable'
                    ? 'bg-[#571bc1] text-[#e9ddff] shadow-sm font-bold'
                    : 'text-[#d8c3ad] hover:text-white hover:bg-[#2d263e]'
                }`}
              >
                Paytable
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('highroller');
                }}
                className={`px-4 py-2 font-mono-tabular text-xs uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                  activeTab === 'highroller'
                    ? 'bg-[#571bc1] text-[#e9ddff] shadow-sm font-bold'
                    : 'text-[#d8c3ad] hover:text-white hover:bg-[#2d263e]'
                }`}
              >
                High Roller
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('history');
                }}
                className={`px-4 py-2 font-mono-tabular text-xs uppercase tracking-wider transition-all rounded-lg cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#571bc1] text-[#e9ddff] shadow-sm font-bold'
                    : 'text-[#d8c3ad] hover:text-white hover:bg-[#2d263e]'
                }`}
              >
                History
              </button>
            </nav>
          </div>

          {/* Right Header Zone: Telemetry Saldo, Audio, Code Hook View */}
          <div className="flex items-center gap-3">
            {/* LED Telemetry Balance Capsule */}
            <div
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#110a21] border border-[#ffc174]/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] cursor-pointer hover:border-[#ffc174] transition-colors"
              title="Click para recargar saldo"
            >
              <span className="hidden sm:inline font-mono-tabular text-[10px] uppercase text-[#d0bcff] tracking-widest">
                LED Telemetry
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-[#ffc174] animate-pulse" />
              <span className="font-mono-tabular text-sm sm:text-base font-bold text-[#ffc174]">
                Saldo: ${balance.toFixed(2)}
              </span>
            </div>

            {/* VIP Obsidian Badge */}
            <div
              onClick={() => setActiveTab('highroller')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2d263e] border border-[#ffc174]/20 cursor-pointer hover:bg-[#38314a] transition-colors"
            >
              <span className="material-symbols-outlined text-[#ffc174] text-[18px]">
                workspace_premium
              </span>
              <span className="font-mono-tabular text-[11px] uppercase tracking-widest text-[#ffc174] font-bold">
                VIP Obsidian
              </span>
            </div>

            {/* Sound FX Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                soundFx.playClick();
              }}
              aria-label="Toggle Sound FX"
              className="w-10 h-10 rounded-lg bg-[#2d263e] hover:bg-[#38314a] flex items-center justify-center text-[#d8c3ad] hover:text-[#ffc174] transition-all cursor-pointer border border-[#38314a]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* View Hook Code Button */}
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#571bc1]/60 hover:bg-[#571bc1] text-[#e9ddff] border border-[#8b5cf6]/40 font-mono-tabular text-xs font-bold transition-all cursor-pointer"
              title="Ver código fuente de useDinoCubeEngine.js"
            >
              <span className="material-symbols-outlined text-[16px]">code</span>
              <span className="hidden lg:inline">useDinoCubeEngine.js</span>
            </button>

            {/* User Profile */}
            <div
              onClick={() => setIsWalletModalOpen(true)}
              className="w-8 h-8 rounded-full bg-[#ffc174] flex items-center justify-center text-[#110a21] cursor-pointer hover:scale-105 transition-transform"
              title="Cuenta VIP"
            >
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN APPLICATION CONTAINER
          ========================================================================= */}
      <main className="w-full pt-24 pb-12 flex-1 flex flex-col">
        {/* Dynamic Atmospheric Glow Backdrop */}
        <div className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-4 lg:py-6 flex-1">
          {/* Ambient Halo Embers */}
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#571bc1]/15 blur-[140px] pointer-events-none -z-10" />
          <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-[#f59e0b]/10 blur-[130px] pointer-events-none -z-10" />

          {/* Render Active View Tab */}
          {activeTab === 'arena' && (
            <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT ARENA: Dino Cube Stage & Telemetric Bet Console (8 cols) */}
              <section className="lg:col-span-8 flex flex-col gap-6 w-full">
                {/* Interactive Dino Cube Arena Stage */}
                <div className="relative w-full rounded-2xl bg-[#1f182f]/70 backdrop-blur-2xl p-6 lg:p-8 flex flex-col items-center justify-center min-h-[460px] lg:min-h-[520px] overflow-hidden border border-[#2d263e] shadow-2xl">
                  {/* Geometric Radial Grid Hologram Floor */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
                    <svg
                      className="w-full h-full max-w-[620px] max-h-[620px]"
                      fill="none"
                      viewBox="0 0 400 400"
                    >
                      <circle
                        cx="200"
                        cy="200"
                        r="190"
                        stroke="#d0bcff"
                        strokeDasharray="4 8"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                      <circle
                        cx="200"
                        cy="200"
                        r="140"
                        stroke="#ffc174"
                        strokeWidth="1.5"
                        opacity="0.3"
                      />
                      <circle
                        cx="200"
                        cy="200"
                        r="90"
                        stroke="#d0bcff"
                        strokeDasharray="2 6"
                        strokeWidth="1"
                        opacity="0.4"
                      />
                      <line
                        x1="200"
                        y1="10"
                        x2="200"
                        y2="390"
                        stroke="#d0bcff"
                        strokeWidth="1"
                        opacity="0.2"
                      />
                      <line
                        x1="10"
                        y1="200"
                        x2="390"
                        y2="200"
                        stroke="#d0bcff"
                        strokeWidth="1"
                        opacity="0.2"
                      />
                    </svg>
                  </div>

                  {/* Top Stage Telemetry Badges */}
                  <div className="w-full flex items-center justify-between z-10 mb-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d263e]/80 backdrop-blur-md shadow-md border border-[#38314a]">
                      <span className="w-2 h-2 rounded-full bg-[#ffc174] animate-ping" />
                      <span className="font-mono-tabular text-[10px] text-[#ffc174] uppercase font-bold tracking-wider">
                        MESA VIP SALON #04
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono-tabular text-[10px] text-[#d8c3ad] uppercase tracking-widest hidden sm:inline">
                        RTP 98.4%
                      </span>
                      <div
                        onClick={() => setIsProvablyFairModalOpen(true)}
                        className="px-2.5 py-1 rounded-lg bg-[#110a21] text-[#d0bcff] font-mono-tabular text-xs shadow-inner border border-[#38314a] cursor-pointer hover:border-[#ffc174] transition-colors"
                      >
                        RNG CERTIFIED
                      </div>
                    </div>
                  </div>

                  {/* Visualizador interactivo del Dino Cube con las 4 facetas */}
                  <DinoCubeVisualizer
                    colors={currentColors}
                    isSpinning={isSpinning}
                    moves={moves}
                  />

                  {/* Dynamic Win Status Readout Bar */}
                  <div className="w-full flex items-center justify-between mt-2 px-4 py-2.5 rounded-xl bg-[#110a21]/90 backdrop-blur-md border border-[#2d263e]">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-[#d0bcff] text-[20px]">
                        equalizer
                      </span>
                      <span className="font-mono-tabular text-[10px] text-[#d8c3ad] uppercase tracking-wider">
                        ESTADO DEL CUBO:
                      </span>
                      <span
                        className={`font-syne text-sm sm:text-base font-bold tracking-wide transition-all ${
                          lastWin > 0 ? 'text-[#ffc174] animate-pulse' : 'text-[#e9ddfe]'
                        }`}
                      >
                        {resultMessage}
                      </span>
                    </div>

                    {lastWin > 0 && (
                      <div className="px-3 py-1 rounded-full bg-[#f59e0b] text-[#110a21] font-syne text-xs sm:text-sm font-black uppercase tracking-wider animate-bounce shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                        ¡PREMIO: +${lastWin.toFixed(2)}!
                      </div>
                    )}
                  </div>
                </div>

                {/* TELEMETRIC HARDWARE BET CONSOLE */}
                <div className="w-full rounded-2xl bg-[#231c33] p-5 sm:p-6 flex flex-col gap-5 shadow-xl border border-[#2d263e]">
                  {/* Steppers & Preset Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Cantidad de Movimientos (1-20) */}
                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#1f182f] shadow-inner border border-[#2d263e]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular text-xs text-[#d8c3ad] uppercase flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-[#ffc174] text-[18px]">
                            rotate_right
                          </span>
                          Movimientos Cuánticos
                        </span>
                        <span className="font-mono-tabular text-lg font-bold text-[#ffc174]">
                          {moves}
                        </span>
                      </div>
                      {/* Slider Track */}
                      <input
                        className="w-full accent-[#ffc174] h-2 bg-[#38314a] rounded-lg cursor-pointer"
                        id="movement-slider"
                        max="20"
                        min="1"
                        type="range"
                        disabled={isSpinning}
                        value={moves}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          setMoves(val);
                        }}
                      />
                      {/* Quick Preset Selectors */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        {[3, 5, 10, 20].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            disabled={isSpinning}
                            onClick={() => {
                              soundFx.playClick();
                              setMoves(preset);
                            }}
                            className={`flex-1 py-1 rounded font-mono-tabular text-[10px] uppercase transition-all cursor-pointer ${
                              moves === preset
                                ? 'bg-[#571bc1] text-[#e9ddff] font-bold shadow-sm'
                                : 'bg-[#2d263e] hover:bg-[#38314a] text-[#e9ddfe]'
                            }`}
                          >
                            {preset === 20 ? '20 MAX' : preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Importe de Apuesta Selector */}
                    <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#1f182f] shadow-inner border border-[#2d263e]">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tabular text-xs text-[#d8c3ad] uppercase flex items-center gap-1.5 font-bold">
                          <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">
                            monetization_on
                          </span>
                          Apuesta Por Giro
                        </span>
                        <span className="font-mono-tabular text-lg font-bold text-[#d0bcff]">
                          ${bet.toFixed(2)}
                        </span>
                      </div>
                      {/* Bet Value Chips */}
                      <div className="grid grid-cols-4 gap-2 pt-1 h-full items-center">
                        {[10, 25, 50, 100].map((chipAmount) => (
                          <button
                            key={chipAmount}
                            type="button"
                            disabled={isSpinning}
                            onClick={() => {
                              soundFx.playClick();
                              setBet(chipAmount);
                            }}
                            className={`py-2 rounded-lg font-mono-tabular text-xs font-bold transition-all shadow-sm cursor-pointer ${
                              bet === chipAmount
                                ? 'bg-[#f59e0b] text-[#110a21] shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                                : 'bg-[#2d263e] hover:bg-[#38314a] text-[#e9ddfe]'
                            }`}
                          >
                            ${chipAmount}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* PRIMARY ACTION CTA: MEZCLAR CUBO */}
                  <div className="w-full flex flex-col sm:flex-row items-center gap-4">
                    <button
                      id="shuffle-action-btn"
                      type="button"
                      disabled={isSpinning || balance < bet}
                      onClick={() => handleSpin()}
                      className="relative group w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-[#f59e0b] to-amber-600 text-[#110a21] font-syne text-xl sm:text-2xl font-black uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_35px_rgba(245,158,11,0.5)] active:scale-95 transition-all overflow-hidden cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span
                        className={`material-symbols-outlined text-[30px] transition-transform duration-500 ${
                          isSpinning ? 'animate-spin' : 'group-hover:rotate-180'
                        }`}
                      >
                        casino
                      </span>
                      <span>
                        {isSpinning
                          ? 'MEZCLANDO...'
                          : balance < bet
                          ? 'SALDO INSUFICIENTE'
                          : 'MEZCLAR CUBO'}
                      </span>
                      <span className="material-symbols-outlined text-[28px] group-hover:translate-x-1 transition-transform">
                        shuffle
                      </span>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    </button>

                    {/* Auto-Spin Quick Toggle */}
                    <button
                      id="autospin-toggle-btn"
                      type="button"
                      onClick={toggleAutoSpin}
                      className={`w-full sm:w-auto px-5 py-4 rounded-xl font-mono-tabular text-xs uppercase tracking-widest flex items-center justify-center gap-2 whitespace-nowrap shadow-md transition-all cursor-pointer border ${
                        isAutoSpin
                          ? 'bg-[#571bc1] text-[#e9ddff] border-[#8b5cf6] shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                          : 'bg-[#2d263e] hover:bg-[#38314a] text-[#e9ddfe] border-[#38314a]'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] text-[#d0bcff] ${
                          isAutoSpin ? 'animate-spin' : ''
                        }`}
                      >
                        autorenew
                      </span>
                      <span>{isAutoSpin ? 'AUTO: ACTIVA' : 'AUTO JUGADA: OFF'}</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* RIGHT SIDEBAR: Paytable, Multipliers & Live Spin Feed (4 cols) */}
              <aside className="lg:col-span-4 flex flex-col gap-6 w-full">
                {/* HOLOGRAPHIC TABLA DE PAGOS (PAYTABLE) */}
                <div className="w-full rounded-2xl bg-[#1f182f]/80 backdrop-blur-2xl p-5 shadow-2xl flex flex-col gap-4 border border-[#2d263e]">
                  {/* Paytable Header */}
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ffc174] text-[20px]">
                        payments
                      </span>
                      <h2 className="font-syne text-base font-bold uppercase tracking-wide text-[#ffc174]">
                        Tabla de Pagos
                      </h2>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#110a21] text-[#d8c3ad] font-mono-tabular text-[10px] uppercase border border-[#38314a]">
                      MULTIPLIERS
                    </span>
                  </div>

                  {/* TIER 1: 4 IGUALES (JACKPOT) */}
                  <div
                    className={`relative w-full rounded-xl p-3.5 flex items-center justify-between transition-all overflow-hidden border ${
                      lastMultiplier === 50
                        ? 'bg-gradient-to-r from-amber-500/30 via-[#2d263e] to-[#2d263e] border-[#ffc174] shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                        : 'bg-[#2d263e]/60 hover:bg-[#2d263e] border-[#38314a]'
                    }`}
                  >
                    <div className="flex items-center gap-3 z-10">
                      <div className="w-9 h-9 rounded-lg bg-[#110a21] flex items-center justify-center p-1 shadow-inner border border-[#ffc174]/20">
                        <span className="material-symbols-outlined text-[#ffc174] text-[18px]">
                          crown
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-syne text-sm font-bold text-[#ffc174] uppercase">
                          4 Iguales
                        </span>
                        <span className="font-mono-tabular text-[10px] text-[#d8c3ad]">
                          Jackpot Absoluto Cuántico
                        </span>
                      </div>
                    </div>
                    <div className="z-10">
                      <span className="px-2.5 py-1 rounded-full bg-[#f59e0b] text-[#110a21] font-syne text-xs font-black">
                        x50
                      </span>
                    </div>
                  </div>

                  {/* TIER 2: 3 IGUALES */}
                  <div
                    className={`relative w-full rounded-xl p-3.5 flex items-center justify-between transition-all border ${
                      lastMultiplier === 10
                        ? 'bg-sky-500/20 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                        : 'bg-[#2d263e]/60 hover:bg-[#2d263e] border-[#38314a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#110a21] flex items-center justify-center p-1 shadow-inner border border-sky-500/20">
                        <span className="material-symbols-outlined text-sky-400 text-[18px]">
                          diamond
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-syne text-sm font-bold text-[#e9ddfe] uppercase">
                          3 Iguales
                        </span>
                        <span className="font-mono-tabular text-[10px] text-[#d8c3ad]">
                          Trilogía Neón Fiel
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#110a21] text-sky-400 font-syne text-xs font-bold border border-sky-400/30">
                      x10
                    </span>
                  </div>

                  {/* TIER 3: 2 PARES */}
                  <div
                    className={`relative w-full rounded-xl p-3.5 flex items-center justify-between transition-all border ${
                      lastMultiplier === 5
                        ? 'bg-[#571bc1]/30 border-[#8b5cf6] shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                        : 'bg-[#2d263e]/60 hover:bg-[#2d263e] border-[#38314a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#110a21] flex items-center justify-center p-1 shadow-inner border border-purple-500/20">
                        <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">
                          casino
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-syne text-sm font-bold text-[#e9ddfe] uppercase">
                          2 Pares
                        </span>
                        <span className="font-mono-tabular text-[10px] text-[#d8c3ad]">
                          Doble Dúo Simétrico
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#110a21] text-[#d0bcff] font-syne text-xs font-bold border border-[#8b5cf6]/30">
                      x5
                    </span>
                  </div>

                  {/* TIER 4: 2 IGUALES */}
                  <div
                    className={`relative w-full rounded-xl p-3.5 flex items-center justify-between transition-all border ${
                      lastMultiplier === 2
                        ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                        : 'bg-[#2d263e]/60 hover:bg-[#2d263e] border-[#38314a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#110a21] flex items-center justify-center p-1 shadow-inner border border-rose-500/20">
                        <span className="material-symbols-outlined text-rose-400 text-[18px]">
                          nutrition
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-syne text-sm font-bold text-[#e9ddfe] uppercase">
                          2 Iguales
                        </span>
                        <span className="font-mono-tabular text-[10px] text-[#d8c3ad]">
                          Pareja Elemental
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#110a21] text-rose-400 font-syne text-xs font-bold border border-rose-400/30">
                      x2
                    </span>
                  </div>
                </div>

                {/* RECENT ACTIVITY FEED (ÚLTIMOS GIROS LEDGER) */}
                <div className="w-full rounded-2xl bg-[#1f182f]/70 backdrop-blur-xl p-5 flex flex-col gap-3 shadow-xl border border-[#2d263e]">
                  <div className="flex items-center justify-between pb-1">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#d0bcff] text-[18px]">
                        history
                      </span>
                      <span className="font-syne text-sm font-bold text-[#e9ddfe] uppercase tracking-wide">
                        Últimos Giros
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] text-[#d8c3ad] uppercase">
                      LEDGER EN VIVO
                    </span>
                  </div>

                  {/* Historial Items */}
                  <div className="flex flex-col gap-2">
                    {history.slice(0, 4).map((spin) => {
                      const isWin = spin.multiplier > 0;
                      return (
                        <div
                          key={spin.id}
                          className="flex items-center justify-between p-2.5 rounded-lg bg-[#2d263e]/50 hover:bg-[#2d263e] transition-all border border-[#38314a]/50"
                        >
                          <div className="flex items-center gap-2.5">
                            {/* Mini Quad Color Grid */}
                            <div className="grid grid-cols-2 gap-0.5 w-6 h-6 rounded overflow-hidden shadow-inner">
                              {spin.colors.map((c, i) => {
                                const cfg = COLOR_CONFIG[c] || COLOR_CONFIG.Amarillo;
                                return (
                                  <div
                                    key={i}
                                    className="w-full h-full"
                                    style={{ background: cfg.gradient }}
                                  />
                                );
                              })}
                            </div>
                            <div className="flex flex-col">
                              <span
                                className={`font-mono-tabular text-[10px] font-bold ${
                                  spin.multiplier === 50
                                    ? 'text-[#ffc174]'
                                    : spin.multiplier === 10
                                    ? 'text-sky-400'
                                    : spin.multiplier === 5
                                    ? 'text-[#d0bcff]'
                                    : spin.multiplier === 2
                                    ? 'text-rose-400'
                                    : 'text-[#d8c3ad]'
                                }`}
                              >
                                {spin.multiplier === 50
                                  ? 'JACKPOT x50'
                                  : spin.multiplier === 10
                                  ? '3 IGUALES x10'
                                  : spin.multiplier === 5
                                  ? '2 PARES x5'
                                  : spin.multiplier === 2
                                  ? '2 IGUALES x2'
                                  : 'SIN COMBINACIÓN'}
                              </span>
                              <span className="font-mono-tabular text-[9px] text-[#a08e7a]">
                                #{spin.roundNumber} • {spin.moves} movs
                              </span>
                            </div>
                          </div>
                          <span
                            className={`font-mono-tabular text-xs font-bold ${
                              isWin ? 'text-[#ffc174]' : 'text-[#a08e7a]'
                            }`}
                          >
                            {isWin ? `+$${spin.payout.toFixed(2)}` : `-$${spin.bet.toFixed(2)}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Provably Fair Seed Verification Card */}
                  <div
                    onClick={() => {
                      if (history.length > 0) {
                        setSelectedSpinForVerification(history[0]);
                      }
                      setIsProvablyFairModalOpen(true);
                    }}
                    className="mt-1 p-2.5 rounded-lg bg-[#110a21] border border-[#38314a] flex items-center justify-between cursor-pointer hover:border-[#ffc174] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#ffc174] text-[18px]">
                        verified_user
                      </span>
                      <span className="font-mono-tabular text-[10px] text-[#d8c3ad] uppercase">
                        Hash Cuántico SHA-256
                      </span>
                    </div>
                    <span className="font-mono-tabular text-[10px] text-[#ffc174] underline">
                      Verificar
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          )}

          {/* TAB: Paytable & Matemáticas */}
          {activeTab === 'paytable' && <PaytableTab />}

          {/* TAB: High Roller Suite */}
          {activeTab === 'highroller' && (
            <HighRollerTab
              balance={balance}
              isSpinning={isSpinning}
              currentColors={currentColors}
              onSpin={handleSpin}
            />
          )}

          {/* TAB: Historial Completo */}
          {activeTab === 'history' && (
            <HistoryTab
              history={history}
              onSelectSpinForVerification={(spin) => {
                setSelectedSpinForVerification(spin);
                setIsProvablyFairModalOpen(true);
              }}
            />
          )}
        </div>
      </main>

      {/* =========================================================================
          FOOTER: LEGAL, ENGINE & TELEMETRY CREDITS
          ========================================================================= */}
      <footer className="w-full bg-[#110a21] border-t border-[#2d263e] py-6">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[#d8c3ad] font-mono-tabular text-xs">
          <div className="flex items-center gap-3">
            <span className="font-syne text-sm font-bold text-[#ffc174] uppercase">
              Neon Dino Cube
            </span>
            <span className="text-[#a08e7a]">v4.0.8 Quantum Release</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsProvablyFairModalOpen(true)}
              className="hover:text-[#ffc174] transition-colors uppercase cursor-pointer"
            >
              Provably Fair Engine
            </button>
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="hover:text-[#ffc174] transition-colors uppercase text-[#d0bcff] font-bold cursor-pointer"
            >
              Ver Hook useDinoCubeEngine.js
            </button>
            <button
              onClick={() => setActiveTab('paytable')}
              className="hover:text-[#ffc174] transition-colors uppercase cursor-pointer"
            >
              VIP Terms & Reglas
            </button>
          </div>

          <div className="text-[#a08e7a] tracking-wider text-[11px]">
            © 2026 NEON DINO ENTERTAINMENT. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <CodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <ProvablyFairModal
        isOpen={isProvablyFairModalOpen}
        onClose={() => {
          setIsProvablyFairModalOpen(false);
          setSelectedSpinForVerification(null);
        }}
        selectedSpin={selectedSpinForVerification}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        balance={balance}
        onReload={(amt) => addBalance(amt)}
        onReset={(amt) => resetBalance(amt)}
      />
    </div>
  );
}
