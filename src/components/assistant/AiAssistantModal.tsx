import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Sparkles, Bot, User, RefreshCw, 
  HelpCircle, ChevronRight, Phone, ShieldCheck, MapPin, 
  Coins, MessageSquare 
} from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  time: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: 'explore' | 'market' | 'games') => void;
  theme?: 'dark' | 'light';
}

const INITIAL_GREETING: ChatMessage = {
  id: 'msg-welcome',
  role: 'model',
  text: `Assalomu alaykum! Men **Guzasht AI Sayohat Maslahatchisiman** 🚀✨\n\nMen sizga sayohatlarni tanlashda, **0% Halol Nasiya** shartlarini tushunishda, **2233** qisqa raqami xizmati va eng yaxshi turistik marshrutlar bo‘yicha yordam berishga tayyorman.\n\nQanday savolingiz bor?`,
  time: 'Hozir',
};

const SUGGESTED_QUESTIONS = [
  { icon: '💳', label: "0% Halol Nasiya tartibi qanday?", query: "Turlarni 0% halol nasiyaga qanday olsa bo'ladi?" },
  { icon: '🏛️', label: "Samarqand va Buxoro turlari", query: "Samarqand va Buxoro turlari haqida ma'lumot bering" },
  { icon: '📞', label: "2233 Call-markaz nima?", query: "2233 qisqa raqami kimlar uchun va qanday ishlaydi?" },
  { icon: '🪙', label: "Coinlarni chegirmaga ishlatish", query: "O'yindan yutgan coinlarimni qanday chegirmaga aylantiraman?" },
  { icon: '✈️', label: "Dubay va Antaliya paketlari", query: "Dubay va Antaliya sayohatlari narxi qancha?" },
];

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  theme = 'dark',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages, isLoading]);

  if (!isOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    triggerHaptic('light');
    const userMsgId = 'usr-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history
      const history = messages
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history,
        }),
      });

      const data = await res.json();
      const botReply = data?.reply || "Uzr, javobni shakllantirishda xatolik yuz berdi.";

      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'model',
          text: botReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      triggerHaptic('success');
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          role: 'model',
          text: "Tarmoq bilan aloqa vaqtincha sekinlashdi. 2233 raqamiga qo‘ng‘iroq qilib yoki «Explore» bo‘limidan turlarni to‘g‘ridan-to‘g‘ri ko‘rishingiz mumkin!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      triggerHaptic('warning');
    } finally {
      setIsLoading(false);
    }
  };

  const formatText = (text: string) => {
    // Basic Markdown bold & line break renderer
    return text.split('\n').map((line, lineIdx) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={lineIdx} className={lineIdx > 0 ? 'mt-1.5' : ''}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-white drop-shadow-sm">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return <span key={pIdx}>{part}</span>;
          })}
        </p>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className={`w-full max-w-lg h-[90vh] sm:h-[82vh] rounded-t-3xl sm:rounded-3xl border flex flex-col shadow-2xl overflow-hidden transition-all duration-200 ${
          theme === 'light'
            ? 'bg-slate-50 text-slate-800 border-slate-300'
            : 'bg-[#0f172a] text-slate-100 border-slate-800'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800/80 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25">
                <Bot className="w-5 h-5 text-white animate-pulse" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0f172a]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  Guzasht AI Sayohatchi
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Gemini 3.8 Flash bilan quvvatlangan</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Onlayn</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                triggerHaptic('light');
                setMessages([INITIAL_GREETING]);
              }}
              title="Chatni yangilash"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                triggerHaptic('light');
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 items-end ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-600 flex items-center justify-center shrink-0 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-md ${
                    isUser
                      ? 'bg-gradient-to-r from-sky-600 to-cyan-600 text-white rounded-br-none'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-bl-none'
                  }`}
                >
                  <div className="break-words">
                    {formatText(msg.text)}
                  </div>
                  <div className={`mt-1.5 text-[10px] flex items-center justify-end ${isUser ? 'text-sky-200' : 'text-slate-500'}`}>
                    <span>{msg.time}</span>
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-200" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-end justify-start">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-sky-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-slate-800/90 border border-slate-700/60 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-slate-400 ml-1.5">AI maslahat yozmoqda...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompt Chips */}
        <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800/60 overflow-x-auto no-scrollbar flex items-center gap-2">
          {SUGGESTED_QUESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              disabled={isLoading}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-medium transition active:scale-95 disabled:opacity-50"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Bottom Input Form */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Sayohat yoki 0% nasiya haqida so'rang..."
            disabled={isLoading}
            className="flex-1 bg-slate-800/90 text-white placeholder-slate-400 text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-slate-700 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            className="w-10 h-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md shadow-cyan-500/25 active:scale-95 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
