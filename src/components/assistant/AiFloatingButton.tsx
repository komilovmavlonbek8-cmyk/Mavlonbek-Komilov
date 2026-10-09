import React from 'react';
import { Sparkles, Bot } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

interface AiFloatingButtonProps {
  onClick: () => void;
}

export const AiFloatingButton: React.FC<AiFloatingButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={() => {
        triggerHaptic('medium');
        onClick();
      }}
      className="fixed bottom-20 right-4 z-40 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 text-white font-bold text-xs shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border border-cyan-300/40 backdrop-blur-sm group"
      aria-label="AI Sayohat Maslahatchisi"
    >
      <div className="relative">
        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-white group-hover:rotate-12 transition-transform" />
        </div>
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
      </div>
      <span className="tracking-tight flex items-center gap-1 drop-shadow-sm">
        <span>AI Yordamchi</span>
        <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
      </span>
    </button>
  );
};
