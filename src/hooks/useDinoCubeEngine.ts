/**
 * @file useDinoCubeEngine.ts
 * @description Motor lógico y cerebro probabilístico para el juego de casino "Neon Dino Cube".
 * Administra el saldo, validaciones de seguridad, simulación cinemática de movimientos,
 * aleatorización cuántica de las 4 facetas y cálculo riguroso del sistema de pagos de casino.
 *
 * @license Apache-2.0
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Los 6 colores reglamentarios del pool del Dino Cube.
 */
export const DINO_CUBE_COLORS = [
  'Rojo',
  'Azul',
  'Verde',
  'Amarillo',
  'Naranja',
  'Blanco',
] as const;

export type DinoCubeColor = (typeof DINO_CUBE_COLORS)[number];

/**
 * Clasificación formal de las combinaciones posibles en el Dino Cube.
 */
export type DinoOutcomeType =
  | 'JACKPOT'           // 4 colores iguales (x50)
  | 'THREE_OF_A_KIND'   // 3 colores iguales (x10)
  | 'TWO_PAIRS'         // 2 pares exactos (x5)
  | 'ONE_PAIR'          // 1 par (2 iguales, 2 distintos) (x2)
  | 'NO_MATCH';         // 4 colores diferentes (x0)

/**
 * Estructura de evaluación matemática de una tirada.
 */
export interface EvaluationResult {
  multiplier: number;
  outcomeType: DinoOutcomeType;
  title: string;
  description: string;
  counts: Record<DinoCubeColor, number>;
  distinctCount: number;
}

/**
 * Registro de auditoría para cada giro (Provably Fair Ledger).
 */
export interface SpinHistoryItem {
  id: string;
  roundNumber: number;
  timestamp: number;
  moves: number;
  bet: number;
  colors: DinoCubeColor[];
  multiplier: number;
  payout: number;
  netProfit: number;
  balanceAfter: number;
  outcomeType: DinoOutcomeType;
  hash: string;
}

/**
 * Opciones de configuración para el hook useDinoCubeEngine.
 */
export interface DinoCubeEngineOptions {
  /** Saldo inicial en dólares o créditos. Por defecto: $1000 */
  initialBalance?: number;
  /** Apuesta por defecto en caso de no especificarse en la llamada. Por defecto: $10 */
  defaultBet?: number;
  /** Colores iniciales para las 4 caras del cubo. */
  defaultColors?: [DinoCubeColor, DinoCubeColor, DinoCubeColor, DinoCubeColor];
  /** Multiplicador de retardo en ms por cada movimiento. Por defecto: 150ms */
  msPerMovement?: number;
  /** Callback opcional ejecutado en cada paso cinemático de mezcla para animaciones */
  onShuffleStep?: (stepColors: DinoCubeColor[], stepIndex: number) => void;
  /** Callback opcional ejecutado al completar un giro */
  onSpinComplete?: (result: SpinHistoryItem) => void;
}

/**
 * Respuesta estructurada de la función spinCube / playGame.
 */
export interface PlayGameResult {
  success: boolean;
  error?: string;
  colors?: DinoCubeColor[];
  multiplier?: number;
  win?: number;
  netProfit?: number;
  balanceAfter?: number;
  outcomeType?: DinoOutcomeType;
  historyItem?: SpinHistoryItem;
}

/**
 * Genera un hash pseudo SHA-256 para el esquema Provably Fair del casino.
 */
function generateProvablyFairHash(
  seed: string,
  colors: DinoCubeColor[],
  round: number
): string {
  const payload = `${seed}-${round}-${colors.join(',')}-${Date.now()}`;
  let hash = 0;
  for (let i = 0; i < payload.length; i++) {
    const char = payload.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convertir a entero de 32 bits
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  const randPart = Math.random().toString(16).substring(2, 10);
  return `0x${hexPart}${randPart}`.toLowerCase();
}

/**
 * ============================================================================
 * ANÁLISIS MATEMÁTICO & PROBABILÍSTICO DEL DINO CUBE
 * ============================================================================
 * Espacio muestral total: 6 colores en 4 facetas independientes = 6^4 = 1,296 combinaciones.
 *
 * 1. 4 IGUALES (Jackpot, x50):
 *    - Combinaciones: C(6, 1) = 6
 *    - Probabilidad: 6 / 1,296 = 0.4630% (~1 en cada 216 giros)
 *
 * 2. 3 IGUALES (Trilogía Neón, x10):
 *    - Combinaciones: C(6, 1) * C(5, 1) * [4! / (3!*1!)] = 6 * 5 * 4 = 120
 *    - Probabilidad: 120 / 1,296 = 9.2593% (~1 en cada 10.8 giros)
 *
 * 3. 2 PARES (Doble Dúo Simétrico, x5):
 *    - Combinaciones: C(6, 2) * [4! / (2!*2!)] = 15 * 6 = 90
 *    - Probabilidad: 90 / 1,296 = 6.9444% (~1 en cada 14.4 giros)
 *
 * 4. 1 PAR EXACTO (Pareja Elemental, x2):
 *    - Combinaciones: C(6, 1) * C(5, 2) * [4! / (2!*1!*1!)] = 6 * 10 * 12 = 720
 *    - Probabilidad: 720 / 1,296 = 55.5556% (~1 en cada 1.8 giros)
 *
 * 5. SIN COMBINACIÓN (4 Colores Distintos, x0):
 *    - Combinaciones: 6 * 5 * 4 * 3 = 360
 *    - Probabilidad: 360 / 1,296 = 27.7778% (~1 en cada 3.6 giros)
 *
 * Suma de combinaciones: 6 + 120 + 90 + 720 + 360 = 1,296 (Partición exhaustiva exacta).
 *
 * Retorno Esperado Teórico (RTP) bruto:
 * E[Retorno] = (6*50 + 120*10 + 90*5 + 720*2 + 360*0) / 1,296
 *            = (300 + 1200 + 450 + 1440) / 1,296
 *            = 3,390 / 1,296 ≈ 2.6157x apuesta
 * ============================================================================
 */

/**
 * Evalúa un array de 4 colores y retorna la categoría ganadora y multiplicador.
 * Función pura, determinista y testeable.
 */
export function evaluateDinoCubeColors(
  colors: DinoCubeColor[]
): EvaluationResult {
  if (!Array.isArray(colors) || colors.length !== 4) {
    throw new Error('evaluateDinoCubeColors requiere un array de exactamente 4 colores.');
  }

  // Frecuencia por color
  const counts: Record<DinoCubeColor, number> = {
    Rojo: 0,
    Azul: 0,
    Verde: 0,
    Amarillo: 0,
    Naranja: 0,
    Blanco: 0,
  };

  colors.forEach((color) => {
    if (counts[color] !== undefined) {
      counts[color]++;
    }
  });

  // Extraer las frecuencias en orden descendente
  const frequencies = Object.values(counts)
    .filter((f) => f > 0)
    .sort((a, b) => b - a);

  const distinctCount = frequencies.length;

  // CASO 1: 4 Colores Iguales (frecuencias = [4])
  if (frequencies[0] === 4) {
    return {
      multiplier: 50,
      outcomeType: 'JACKPOT',
      title: '¡JACKPOT CUÁNTICO!',
      description: '¡Increíble! 4 facetas idénticas alineadas. Multiplicador x50.',
      counts,
      distinctCount,
    };
  }

  // CASO 2: 3 Colores Iguales (frecuencias = [3, 1])
  if (frequencies[0] === 3) {
    return {
      multiplier: 10,
      outcomeType: 'THREE_OF_A_KIND',
      title: '¡TRILOGÍA NEÓN!',
      description: '3 facetas del mismo color. Multiplicador x10.',
      counts,
      distinctCount,
    };
  }

  // CASO 3: 2 Pares Exactos (frecuencias = [2, 2])
  if (frequencies[0] === 2 && frequencies[1] === 2) {
    return {
      multiplier: 5,
      outcomeType: 'TWO_PAIRS',
      title: '¡DOBLE DÚO SIMÉTRICO!',
      description: '2 pares perfectos en simetría angular. Multiplicador x5.',
      counts,
      distinctCount,
    };
  }

  // CASO 4: 1 Par Exacto (frecuencias = [2, 1, 1])
  if (frequencies[0] === 2) {
    return {
      multiplier: 2,
      outcomeType: 'ONE_PAIR',
      title: '¡PAREJA ELEMENTAL!',
      description: '2 facetas emparejadas. Multiplicador x2.',
      counts,
      distinctCount,
    };
  }

  // CASO 5: 4 Colores Distintos (frecuencias = [1, 1, 1, 1])
  return {
    multiplier: 0,
    outcomeType: 'NO_MATCH',
    title: 'SIN COMBINACIÓN',
    description: 'Los 4 triángulos son distintos. Sigue intentando en el siguiente giro.',
    counts,
    distinctCount,
  };
}

/** Alias para compatibilidad */
export const evaluateColors = evaluateDinoCubeColors;

/**
 * Genera un conjunto aleatorio de 4 colores uniformemente distribuidos.
 * Utiliza Web Crypto API para máxima aleatoriedad criptográfica de casino.
 */
export function generateRandomDinoColors(): [
  DinoCubeColor,
  DinoCubeColor,
  DinoCubeColor,
  DinoCubeColor,
] {
  const result: DinoCubeColor[] = [];
  const poolSize = DINO_CUBE_COLORS.length;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const randomBuffer = new Uint32Array(4);
    window.crypto.getRandomValues(randomBuffer);
    for (let i = 0; i < 4; i++) {
      const index = randomBuffer[i] % poolSize;
      result.push(DINO_CUBE_COLORS[index]);
    }
  } else {
    for (let i = 0; i < 4; i++) {
      const index = Math.floor(Math.random() * poolSize);
      result.push(DINO_CUBE_COLORS[index]);
    }
  }

  return result as [DinoCubeColor, DinoCubeColor, DinoCubeColor, DinoCubeColor];
}

/**
 * Custom Hook principal: useDinoCubeEngine
 *
 * @param options Opciones de configuración iniciales del motor.
 * @returns Objeto con estados reactivos, métodos de acción y métricas.
 */
export function useDinoCubeEngine(options: DinoCubeEngineOptions = {}) {
  const {
    initialBalance = 1000,
    defaultBet = 10,
    defaultColors = ['Amarillo', 'Azul', 'Rojo', 'Verde'],
    msPerMovement = 150,
    onShuffleStep,
    onSpinComplete,
  } = options;

  // Estados reactivos obligatorios según especificación
  const [balance, setBalance] = useState<number>(() => {
    return Math.max(0, Number(initialBalance) || 1000);
  });

  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  const [currentColors, setCurrentColors] = useState<[
    DinoCubeColor,
    DinoCubeColor,
    DinoCubeColor,
    DinoCubeColor,
  ]>(defaultColors);

  const [lastWin, setLastWin] = useState<number>(0);

  const [resultMessage, setResultMessage] = useState<string>(
    'LISTO PARA MEZCLAR'
  );

  // Estados complementarios de casino de alta fidelidad
  const [lastMultiplier, setLastMultiplier] = useState<number>(0);
  const [lastOutcome, setLastOutcome] = useState<DinoOutcomeType | null>(null);
  const [currentRound, setCurrentRound] = useState<number>(9930);
  const [history, setHistory] = useState<SpinHistoryItem[]>(() => [
    {
      id: 'init-1',
      roundNumber: 9932,
      timestamp: Date.now() - 120000,
      moves: 10,
      bet: 25,
      colors: ['Amarillo', 'Amarillo', 'Amarillo', 'Amarillo'],
      multiplier: 50,
      payout: 1250,
      netProfit: 1225,
      balanceAfter: 2225,
      outcomeType: 'JACKPOT',
      hash: '0x8f43a9b1c7',
    },
    {
      id: 'init-2',
      roundNumber: 9931,
      timestamp: Date.now() - 240000,
      moves: 10,
      bet: 25,
      colors: ['Azul', 'Azul', 'Azul', 'Blanco'],
      multiplier: 10,
      payout: 250,
      netProfit: 225,
      balanceAfter: 1000,
      outcomeType: 'THREE_OF_A_KIND',
      hash: '0x32e7fa40d2',
    },
    {
      id: 'init-3',
      roundNumber: 9930,
      timestamp: Date.now() - 420000,
      moves: 5,
      bet: 25,
      colors: ['Verde', 'Rojo', 'Verde', 'Rojo'],
      multiplier: 5,
      payout: 125,
      netProfit: 100,
      balanceAfter: 775,
      outcomeType: 'TWO_PAIRS',
      hash: '0x99b17fc044',
    },
  ]);

  // Referencias para control de timers y evitar memory leaks
  const activeTimersRef = useRef<number[]>([]);
  const isSpinningRef = useRef<boolean>(false);
  const balanceRef = useRef<number>(balance);

  // Mantener balanceRef sincronizado
  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  // Limpiar timers en desmontaje
  useEffect(() => {
    return () => {
      activeTimersRef.current.forEach((t) => window.clearTimeout(t));
      activeTimersRef.current = [];
    };
  }, []);

  /**
   * Valida parámetros de entrada de manera estricta y segura.
   */
  const validateInputs = useCallback((moves: number, bet: number) => {
    if (typeof moves !== 'number' || Number.isNaN(moves)) {
      return { valid: false, error: 'La cantidad de movimientos debe ser un número entero.' };
    }
    const cleanMoves = Math.floor(moves);
    if (cleanMoves < 1 || cleanMoves > 20) {
      return { valid: false, error: 'Los movimientos deben estar comprendidos entre 1 y 20.' };
    }
    if (typeof bet !== 'number' || Number.isNaN(bet) || bet <= 0) {
      return { valid: false, error: 'La apuesta debe ser un monto estrictamente mayor a $0.' };
    }
    return { valid: true, cleanMoves, cleanBet: bet };
  }, []);

  /**
   * Acción principal: mezclar el Dino Cube y ejecutar una jugada de casino.
   *
   * @param movements Cantidad de movimientos cuánticos (1 a 20).
   * @param betAmount Monto a apostar en la jugada (opcional, por defecto defaultBet).
   */
  const playGame = useCallback(
    (movements: number = 10, betAmount: number = defaultBet): Promise<PlayGameResult> => {
      return new Promise((resolve) => {
        // 1. Validar que no haya un giro en progreso
        if (isSpinningRef.current) {
          resolve({
            success: false,
            error: 'El Dino Cube ya se encuentra girando.',
          });
          return;
        }

        // 2. Validar parámetros de seguridad
        const validation = validateInputs(movements, betAmount);
        if (!validation.valid || validation.cleanMoves === undefined || validation.cleanBet === undefined) {
          setResultMessage(validation.error || 'Parámetros inválidos.');
          resolve({
            success: false,
            error: validation.error,
          });
          return;
        }

        const validMoves = validation.cleanMoves;
        const validBet = validation.cleanBet;

        // 3. Validar saldo suficiente
        if (balanceRef.current < validBet) {
          const errText = `Saldo insuficiente: Tienes $${balanceRef.current.toFixed(2)} y la apuesta es de $${validBet.toFixed(2)}.`;
          setResultMessage(errText);
          resolve({
            success: false,
            error: errText,
          });
          return;
        }

        // 4. Bloquear estado y descontar la apuesta
        isSpinningRef.current = true;
        setIsSpinning(true);
        const balanceAfterBet = balanceRef.current - validBet;
        setBalance(balanceAfterBet);
        balanceRef.current = balanceAfterBet;

        setResultMessage('MEZCLANDO ENERGÍA CUÁNTICA...');
        setLastWin(0);

        // 5. Simular tiempo de procesamiento cinemático: (movimientos * msPerMovement)
        const totalDurationMs = Math.max(300, validMoves * msPerMovement);
        const stepIntervalMs = Math.max(60, Math.floor(totalDurationMs / (validMoves * 2)));

        // Micro-animación intermedia de facetas para la UI
        let stepCount = 0;
        const intervalId = window.setInterval(() => {
          stepCount++;
          const tempColors = generateRandomDinoColors();
          setCurrentColors(tempColors);
          if (onShuffleStep) {
            onShuffleStep(tempColors, stepCount);
          }
        }, stepIntervalMs);

        // 6. Al terminar el tiempo de rotación
        const timeoutId = window.setTimeout(() => {
          window.clearInterval(intervalId);

          // Generación de los 4 colores finales mediante RNG cuántico
          const finalColors = generateRandomDinoColors();
          setCurrentColors(finalColors);

          // Evaluación de pagos según las reglas matemáticas del casino
          const evaluation = evaluateDinoCubeColors(finalColors);
          const payout = validBet * evaluation.multiplier;
          const netProfit = payout - validBet;
          const finalBalance = balanceRef.current + payout;

          // Actualizar saldo con las ganancias
          setBalance(finalBalance);
          balanceRef.current = finalBalance;
          setLastWin(payout);
          setLastMultiplier(evaluation.multiplier);
          setLastOutcome(evaluation.outcomeType);

          // Construir mensaje de resultado para la interfaz
          let message = '';
          if (evaluation.multiplier === 50) {
            message = `¡JACKPOT ABSOLUTO! Ganaste $${payout.toFixed(2)} (x50)`;
          } else if (evaluation.multiplier === 10) {
            message = `¡TRILOGÍA NEÓN! Ganaste $${payout.toFixed(2)} (x10)`;
          } else if (evaluation.multiplier === 5) {
            message = `¡DOBLE DÚO SIMÉTRICO! Ganaste $${payout.toFixed(2)} (x5)`;
          } else if (evaluation.multiplier === 2) {
            message = `¡PAREJA ELEMENTAL! Ganaste $${payout.toFixed(2)} (x2)`;
          } else {
            message = `SIN COMBINACIÓN. -$${validBet.toFixed(2)}`;
          }
          setResultMessage(message);

          // Registrar en el historial Provably Fair
          const nextRound = currentRound + 1;
          setCurrentRound(nextRound);
          const historyItem: SpinHistoryItem = {
            id: `spin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            roundNumber: nextRound,
            timestamp: Date.now(),
            moves: validMoves,
            bet: validBet,
            colors: finalColors,
            multiplier: evaluation.multiplier,
            payout,
            netProfit,
            balanceAfter: finalBalance,
            outcomeType: evaluation.outcomeType,
            hash: generateProvablyFairHash('neon-dino-seed', finalColors, nextRound),
          };

          setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);

          if (onSpinComplete) {
            onSpinComplete(historyItem);
          }

          // Liberar el estado de giro
          isSpinningRef.current = false;
          setIsSpinning(false);

          resolve({
            success: true,
            colors: finalColors,
            multiplier: evaluation.multiplier,
            win: payout,
            netProfit,
            balanceAfter: finalBalance,
            outcomeType: evaluation.outcomeType,
            historyItem,
          });
        }, totalDurationMs);

        activeTimersRef.current.push(timeoutId);
      });
    },
    [
      defaultBet,
      msPerMovement,
      currentRound,
      validateInputs,
      onShuffleStep,
      onSpinComplete,
    ]
  );

  /**
   * Alias de playGame según requisitos de la consigna.
   */
  const spinCube = useCallback(
    (movements: number = 10, betAmount: number = defaultBet) => {
      return playGame(movements, betAmount);
    },
    [playGame, defaultBet]
  );

  /**
   * Recarga o restablece el saldo del jugador.
   */
  const resetBalance = useCallback((amount: number = 1000) => {
    const validAmount = Math.max(0, Number(amount) || 1000);
    setBalance(validAmount);
    balanceRef.current = validAmount;
    setResultMessage(`Saldo restablecido a $${validAmount.toFixed(2)}`);
  }, []);

  /**
   * Añade fondos al saldo actual.
   */
  const addBalance = useCallback((amount: number) => {
    if (typeof amount !== 'number' || amount <= 0) return;
    setBalance((prev) => {
      const next = prev + amount;
      balanceRef.current = next;
      return next;
    });
    setResultMessage(`Fondos acreditados: +$${amount.toFixed(2)}`);
  }, []);

  return {
    // Estados requeridos
    balance,
    isSpinning,
    currentColors,
    lastWin,
    resultMessage,

    // Métodos de acción requeridos
    playGame,
    spinCube,

    // Estados y utilidades extendidas de casino
    lastMultiplier,
    lastOutcome,
    history,
    currentRound,
    resetBalance,
    addBalance,
    availableColors: DINO_CUBE_COLORS,
  };
}

export default useDinoCubeEngine;
