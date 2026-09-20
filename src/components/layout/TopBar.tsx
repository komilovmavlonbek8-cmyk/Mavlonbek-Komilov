import React from 'react';
import { Menu, Search, Coins, Info, Sun, Moon } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

interface TopBarProps {
  coins: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenMenu: () => void;
  onOpenSearch: () => void;
  onOpenDemoInfo: () => void;
  onOpenCoinsModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  coins,
  theme = 'dark',
  onToggleTheme,
  onOpenMenu,
  onOpenSearch,
  onOpenDemoInfo,
  onOpenCoinsModal,
}) => {
  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-3 sm:px-4 py-2.5 sm:py-3 transition-colors ${
      theme === 'light' 
        ? 'bg-white/90 border-slate-200 shadow-sm' 
        : 'bg-[#0b111e]/90 border-slate-800/80'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Hamburger & Logo & DEMO Badge */}
        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenMenu();
            }}
            className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl transition-all active:scale-95 shrink-0 ${
              theme === 'light'
                ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="Menyu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 min-w-0">
            <span className={`text-lg sm:text-xl font-black tracking-tight shrink-0 ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}>
              Guzasht
            </span>

            {/* DEMO Badge */}
            <button
              onClick={() => {
                triggerHaptic('light');
                onOpenDemoInfo();
              }}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-amber-500/15 text-amber-500 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 active:scale-95 transition-all shrink-0"
            >
              DEMO
              <Info className="w-2.5 h-2.5 ml-0.5" />
            </button>
          </div>
        </div>

        {/* Right: Theme Toggle & Coins pill & Search icon */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {/* Quick theme toggle */}
          {onToggleTheme && (
            <button
              onClick={() => {
                triggerHaptic('light');
                onToggleTheme();
              }}
              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-xl transition active:scale-95 shrink-0 ${
                theme === 'light'
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                  : 'text-sky-400 bg-slate-800/80 hover:bg-slate-700 border border-slate-700'
              }`}
              title={theme === 'light' ? 'Tungi rejimga o‘tish' : 'Kunduzgi rejimga o‘tish'}
              aria-label="Rejimni almashtirish"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          )}

          {/* Coin pill */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenCoinsModal();
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold active:scale-95 transition-all border shrink-0 ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300 shadow-sm'
                : 'bg-slate-800/90 hover:bg-slate-700/80 border-slate-700/70 text-amber-400'
            }`}
          >
            <Coins className="w-3 h-3 text-amber-500 shrink-0" />
            <span>{coins.toLocaleString()}</span>
          </button>

          {/* Search button */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenSearch();
            }}
            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-xl active:scale-95 transition-all shrink-0 ${
              theme === 'light'
                ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            aria-label="Qidiruv"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
