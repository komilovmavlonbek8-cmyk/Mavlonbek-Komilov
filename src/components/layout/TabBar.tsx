import React from 'react';
import { Compass, ShoppingBag, Sparkles, Gamepad2, User } from 'lucide-react';
import { TabType } from '../../types';
import { triggerHaptic } from '../../lib/twa';

interface TabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  theme?: 'dark' | 'light';
}

export const TabBar: React.FC<TabBarProps> = ({ currentTab, onSelectTab, theme = 'dark' }) => {
  const tabs = [
    { id: 'explore' as TabType, label: 'Explore', icon: Compass },
    { id: 'market' as TabType, label: 'Market', icon: ShoppingBag },
    { id: 'recommend' as TabType, label: 'Tavsiya', icon: Sparkles },
    { id: 'games' as TabType, label: "O‘yinlar", icon: Gamepad2 },
    { id: 'profile' as TabType, label: 'Profil', icon: User },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t safe-area-pb transition-colors ${
      theme === 'light'
        ? 'bg-white/95 border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.04)]'
        : 'bg-[#0b111e]/95 border-slate-800/80'
    }`}>
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                onSelectTab(tab.id);
              }}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'text-sky-500 font-bold'
                  : theme === 'light'
                    ? 'text-slate-600 hover:text-slate-800 font-medium'
                    : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-sky-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight whitespace-nowrap">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
