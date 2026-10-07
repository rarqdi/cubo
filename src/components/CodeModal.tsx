/**
 * @file CodeModal.tsx
 * @description Modal interactivo para visualizar y copiar el código completo del hook
 * `useDinoCubeEngine.js` y el ejemplo de consumo por componentes UI.
 */

import React, { useState } from 'react';

const JS_ENGINE_CODE = `/**
 * @file useDinoCubeEngine.js
 * @description Custom Hook de React para el motor del juego de casino "Neon Dino Cube".
 *
 * REGLAS Y MATEMÁTICA DEL JUEGO:
 * 1. El Dino Cube tiene una cara frontal con 4 triángulos (Top, Right, Bottom, Left).
 * 2. Pool de 6 colores posibles: 'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Blanco'.
 * 3. Espacio Muestral Total = 6^4 = 1,296 combinaciones equiprobables.
 *
 * TABLA DE PAGOS Y DISTRIBUCIÓN PROBABILÍSTICA:
 * - 4 Colores Iguales (Jackpot):
 *     Combinaciones = 6 | Probabilidad = 0.463% | Multiplicador = x50
 * - 3 Colores Iguales:
 *     Combinaciones = 120 | Probabilidad = 9.259% | Multiplicador = x10
 * - 2 Pares Exactos (ej. 2 Rojos y 2 Azules):
 *     Combinaciones = 90 | Probabilidad = 6.944% | Multiplicador = x5
 * - 1 Par Exacto (2 iguales, 2 distintos):
 *     Combinaciones = 720 | Probabilidad = 55.556% | Multiplicador = x2
 * - 4 Colores Distintos (Sin combinación):
 *     Combinaciones = 360 | Probabilidad = 27.778% | Multiplicador = x0 (Pierde)
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export const DINO_CUBE_COLORS = [
  'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Blanco'
];

/** Genera un array de 4 colores aleatorios usando el pool de 6 colores posibles */
export function generateRandomColors() {
  const selected = [];
  const poolLength = DINO_CUBE_COLORS.length;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint32Array(4);
    window.crypto.getRandomValues(buffer);
    for (let i = 0; i < 4; i++) {
      selected.push(DINO_CUBE_COLORS[buffer[i] % poolLength]);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      selected.push(DINO_CUBE_COLORS[Math.floor(Math.random() * poolLength)]);
    }
  }
  return selected;
}

/** Algoritmo de Evaluación (Sistema de Pagos de Casino) */
export function evaluateColors(colors) {
  if (!Array.isArray(colors) || colors.length !== 4) {
    throw new Error('evaluateColors requiere exactamente 4 colores.');
  }

  const frequencyMap = {};
  for (const color of colors) {
    frequencyMap[color] = (frequencyMap[color] || 0) + 1;
  }

  const frequencies = Object.values(frequencyMap).sort((a, b) => b - a);

  // 4 iguales (Jackpot): x50
  if (frequencies[0] === 4) {
    return { multiplier: 50, type: 'JACKPOT', message: '¡Jackpot! Ganaste x50' };
  }
  // 3 iguales: x10
  if (frequencies[0] === 3) {
    return { multiplier: 10, type: 'THREE_OF_A_KIND', message: '¡3 Iguales! Ganaste x10' };
  }
  // 2 pares exactos: x5
  if (frequencies[0] === 2 && frequencies[1] === 2) {
    return { multiplier: 5, type: 'TWO_PAIRS', message: '¡2 Pares! Ganaste x5' };
  }
  // 1 par (2 iguales, 2 distintos): x2
  if (frequencies[0] === 2) {
    return { multiplier: 2, type: 'ONE_PAIR', message: '¡1 Par! Ganaste x2' };
  }
  // 4 colores distintos: x0 (Pierde)
  return { multiplier: 0, type: 'NO_MATCH', message: 'Sigue intentando.' };
}

/** Custom Hook principal */
export function useDinoCubeEngine(config = {}) {
  const { initialBalance = 1000, betCost = 10 } = config;

  // 1. GESTIÓN DE ESTADOS
  const [balance, setBalance] = useState(() => Math.max(0, Number(initialBalance) || 1000));
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentColors, setCurrentColors] = useState(['Amarillo', 'Azul', 'Rojo', 'Verde']);
  const [lastWin, setLastWin] = useState(0);
  const [resultMessage, setResultMessage] = useState('LISTO PARA MEZCLAR');

  const isSpinningRef = useRef(false);
  const balanceRef = useRef(balance);
  const timerRef = useRef(null);

  useEffect(() => { balanceRef.current = balance; }, [balance]);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // 4. FUNCIÓN PRINCIPAL DE ACCIÓN
  const playGame = useCallback((movements = 10, customBet = betCost) => {
    return new Promise((resolve) => {
      if (isSpinningRef.current) {
        resolve({ success: false, error: 'El cubo ya está girando.' });
        return;
      }

      // Validaciones de seguridad
      const movesNum = Number(movements);
      if (!Number.isInteger(movesNum) || movesNum < 1 || movesNum > 20) {
        setResultMessage('Los movimientos deben ser un entero entre 1 y 20.');
        resolve({ success: false, error: 'Movimientos inválidos.' });
        return;
      }

      const betNum = Number(customBet);
      if (Number.isNaN(betNum) || betNum <= 0) {
        setResultMessage('La apuesta debe ser mayor a 0.');
        resolve({ success: false, error: 'Apuesta inválida.' });
        return;
      }

      if (balanceRef.current < betNum) {
        setResultMessage(\`Saldo insuficiente: Tienes $\${balanceRef.current.toFixed(2)}\`);
        resolve({ success: false, error: 'Saldo insuficiente.' });
        return;
      }

      // Descontar la apuesta y activar bloqueo
      isSpinningRef.current = true;
      setIsSpinning(true);
      const newBal = balanceRef.current - betNum;
      setBalance(newBal);
      balanceRef.current = newBal;
      setLastWin(0);
      setResultMessage('MEZCLANDO ENERGÍA...');

      // Simular tiempo de procesamiento: movimientos * 150ms
      const durationMs = movesNum * 150;

      timerRef.current = setTimeout(() => {
        const finalColors = generateRandomColors();
        setCurrentColors(finalColors);

        const outcome = evaluateColors(finalColors);
        const winAmount = betNum * outcome.multiplier;
        const finalBalance = balanceRef.current + winAmount;

        setBalance(finalBalance);
        balanceRef.current = finalBalance;
        setLastWin(winAmount);

        if (outcome.multiplier > 0) {
          setResultMessage(\`¡\${outcome.type}! Ganaste $\${winAmount.toFixed(2)} (x\${outcome.multiplier})\`);
        } else {
          setResultMessage(\`Sigue intentando. - $\${betNum.toFixed(2)}\`);
        }

        isSpinningRef.current = false;
        setIsSpinning(false);

        resolve({
          success: true,
          colors: finalColors,
          multiplier: outcome.multiplier,
          win: winAmount,
          balance: finalBalance
        });
      }, durationMs);
    });
  }, [betCost]);

  const spinCube = useCallback((moves, bet) => playGame(moves, bet), [playGame]);

  return {
    balance,
    isSpinning,
    currentColors,
    lastWin,
    resultMessage,
    playGame,
    spinCube,
    setBalance,
  };
}

export default useDinoCubeEngine;
`;

const USAGE_EXAMPLE = `// Ejemplo de integración en componente UI de React:
import React, { useState } from 'react';
import { useDinoCubeEngine } from './hooks/useDinoCubeEngine.js';

export function DinoCasinoGame() {
  const [moves, setMoves] = useState(10);
  const [bet, setBet] = useState(10);

  const {
    balance,
    isSpinning,
    currentColors,
    lastWin,
    resultMessage,
    spinCube,
  } = useDinoCubeEngine({
    initialBalance: 1000,
    betCost: 10,
  });

  const handleSpin = async () => {
    const result = await spinCube(moves, bet);
    if (!result.success) {
      console.warn('Giro fallido:', result.error);
    }
  };

  return (
    <div className="casino-container">
      <h2>Saldo: \${balance.toFixed(2)}</h2>
      <p>{resultMessage}</p>

      {/* Visualizador de las 4 facetas */}
      <div className="dino-cube">
        <div className="facet-top">{currentColors[0]}</div>
        <div className="facet-right">{currentColors[1]}</div>
        <div className="facet-bottom">{currentColors[2]}</div>
        <div className="facet-left">{currentColors[3]}</div>
      </div>

      <input
        type="range"
        min="1"
        max="20"
        value={moves}
        disabled={isSpinning}
        onChange={(e) => setMoves(Number(e.target.value))}
      />

      <button onClick={handleSpin} disabled={isSpinning}>
        {isSpinning ? 'Mezclando...' : 'MEZCLAR CUBO'}
      </button>

      {lastWin > 0 && <div className="win-banner">¡Ganaste \${lastWin.toFixed(2)}!</div>}
    </div>
  );
}`;

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'hook' | 'example'>('hook');

  if (!isOpen) return null;

  const contentToCopy = tab === 'hook' ? JS_ENGINE_CODE : USAGE_EXAMPLE;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-4xl max-h-[85vh] rounded-2xl bg-[#160f26] border border-[#571bc1] shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#2d263e] flex items-center justify-between bg-[#110a21]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#ffc174] text-[24px]">
              code
            </span>
            <div>
              <h3 className="font-syne text-lg font-bold text-[#ffc174]">
                Entregable: `useDinoCubeEngine.js`
              </h3>
              <p className="text-xs text-[#d8c3ad]">
                Código completo, validaciones estrictas y arquitectura de probabilidad.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-[#571bc1] hover:bg-[#6b21a8] text-white font-mono-tabular text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? '¡Copiado!' : 'Copiar Código'}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#2d263e] hover:bg-[#38314a] text-[#d8c3ad] hover:text-white flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="px-5 py-2.5 bg-[#1f182f] flex gap-2 border-b border-[#2d263e]">
          <button
            onClick={() => setTab('hook')}
            className={`px-4 py-1.5 rounded-lg font-mono-tabular text-xs font-bold transition-all cursor-pointer ${
              tab === 'hook'
                ? 'bg-[#f59e0b] text-[#110a21]'
                : 'text-[#d8c3ad] hover:bg-[#2d263e]'
            }`}
          >
            useDinoCubeEngine.js (Hook Completo)
          </button>
          <button
            onClick={() => setTab('example')}
            className={`px-4 py-1.5 rounded-lg font-mono-tabular text-xs font-bold transition-all cursor-pointer ${
              tab === 'example'
                ? 'bg-[#f59e0b] text-[#110a21]'
                : 'text-[#d8c3ad] hover:bg-[#2d263e]'
            }`}
          >
            Ejemplo de Consumo UI (React)
          </button>
        </div>

        {/* Code Viewport */}
        <div className="flex-1 overflow-auto p-4 sm:p-5 bg-[#0a0612] text-xs font-mono-tabular text-[#e9ddfe] leading-relaxed">
          <pre className="whitespace-pre">
            <code>{tab === 'hook' ? JS_ENGINE_CODE : USAGE_EXAMPLE}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
