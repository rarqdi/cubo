/**
 * @file WalletModal.tsx
 * @description Modal de bóveda cuántica y gestión de fondos/recargas para el jugador VIP.
 */

import React, { useState } from 'react';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onReload: (amount: number) => void;
  onReset: (amount: number) => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  balance,
  onReload,
  onReset,
}) => {
  const [customAmount, setCustomAmount] = useState('500');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl bg-[#160f26] border border-[#f59e0b]/40 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#2d263e] flex items-center justify-between bg-[#110a21]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2d263e] flex items-center justify-center text-[#ffc174]">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
            <div>
              <h3 className="font-syne text-lg font-bold text-[#ffc174]">
                Bóveda VIP Obsidian
              </h3>
              <span className="text-xs text-[#d8c3ad] font-mono-tabular">
                Gestión de Liquidez de Casino
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

        {/* Balance Card */}
        <div className="p-6 flex flex-col gap-5">
          <div className="p-4 rounded-xl bg-[#0a0612] border border-[#2d263e] text-center">
            <span className="text-xs text-[#a08e7a] uppercase font-mono-tabular tracking-wider block">
              Saldo Disponible en Mesa
            </span>
            <span className="font-mono-tabular text-3xl font-bold text-[#ffc174] mt-1 block">
              ${balance.toFixed(2)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono-tabular text-[#a08e7a] uppercase">
              Recarga Rápida de Créditos VIP:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  onReload(100);
                  onClose();
                }}
                className="py-2.5 rounded-lg bg-[#231c33] hover:bg-[#2d263e] border border-[#38314a] font-mono-tabular text-sm font-bold text-[#e9ddfe] hover:border-[#ffc174] transition-all cursor-pointer"
              >
                +$100
              </button>
              <button
                onClick={() => {
                  onReload(500);
                  onClose();
                }}
                className="py-2.5 rounded-lg bg-[#231c33] hover:bg-[#2d263e] border border-[#38314a] font-mono-tabular text-sm font-bold text-[#e9ddfe] hover:border-[#ffc174] transition-all cursor-pointer"
              >
                +$500
              </button>
              <button
                onClick={() => {
                  onReload(1000);
                  onClose();
                }}
                className="py-2.5 rounded-lg bg-[#231c33] hover:bg-[#2d263e] border border-[#38314a] font-mono-tabular text-sm font-bold text-[#ffc174] hover:border-[#ffc174] transition-all cursor-pointer"
              >
                +$1,000
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono-tabular text-[#a08e7a] uppercase">
              Recarga Personalizada:
            </span>
            <div className="flex gap-2">
              <input
                type="number"
                min="10"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="p-2.5 rounded-lg bg-[#0a0612] border border-[#2d263e] font-mono-tabular text-sm text-[#e9ddfe] flex-1 focus:outline-none focus:border-[#f59e0b]"
                placeholder="Monto"
              />
              <button
                onClick={() => {
                  const val = parseFloat(customAmount);
                  if (!isNaN(val) && val > 0) {
                    onReload(val);
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-[#110a21] font-mono-tabular text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Cargar
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-[#2d263e]">
            <button
              onClick={() => {
                onReset(1000);
                onClose();
              }}
              className="w-full py-2.5 rounded-lg bg-[#2d263e] hover:bg-[#38314a] text-[#d8c3ad] hover:text-white font-mono-tabular text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Restablecer a Saldo Inicial ($1,000.00)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
