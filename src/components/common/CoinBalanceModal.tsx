import React from 'react';
import { X, Coins, Sparkles, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { CoinTransaction } from '../../types';
import { getUserLevel } from '../../lib/coins';

interface CoinBalanceModalProps {
  isOpen: boolean;
  coins: number;
  transactions: CoinTransaction[];
  onClose: () => void;
  onGoToGames: () => void;
}

export const CoinBalanceModal: React.FC<CoinBalanceModalProps> = ({
  isOpen,
  coins,
  transactions,
  onClose,
  onGoToGames,
}) => {
  if (!isOpen) return null;

  const levelInfo = getUserLevel(coins);
  const somValue = coins * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#131d2e] border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Coin glow */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mb-2 shadow-lg shadow-amber-500/10">
            <Coins className="w-10 h-10" />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {coins.toLocaleString()} <span className="text-amber-400 text-xl font-bold">Coin</span>
          </div>
          <p className="text-xs text-emerald-400 font-medium mt-1">
            ≈ {somValue.toLocaleString()} so'm chegirma balansi
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-2 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300">
            <span>{levelInfo.badge}</span>
            <span>Daraja: {levelInfo.name}</span>
          </div>
        </div>

        {/* How coins work */}
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2 mb-4">
          <div className="flex items-center gap-2 font-semibold text-white">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Coin qoidalari:</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>1 Coin = 100 so'm chegirma sifatida hisoblanadi.</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Istalgan tur paket narxining 20% gacha qismiga coin ishlatish mumkin.</span>
          </div>
        </div>

        {/* Action to earn */}
        <button
          onClick={() => {
            onClose();
            onGoToGames();
          }}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition mb-5"
        >
          <Trophy className="w-4 h-4" />
          <span>Coin yig'ish (O'yinlar & Spin)</span>
          <ArrowRight className="w-4 h-4 ml-auto" />
        </button>

        {/* Transactions list */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            Oxirgi harakatlar
          </h4>
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-850/70 border border-slate-800/80 text-xs"
              >
                <div>
                  <p className="font-medium text-slate-200">{tx.title}</p>
                  <p className="text-[10px] text-slate-400">{tx.date}</p>
                </div>
                <span className={`font-bold ${tx.type === 'earn' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {tx.type === 'earn' ? `+${tx.amount}` : `-${tx.amount}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
