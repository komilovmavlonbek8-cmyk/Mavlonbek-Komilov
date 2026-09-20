import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, FileText, Building2, Coins } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

interface HalolNasiyaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HalolNasiyaModal: React.FC<HalolNasiyaModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'shariat' | 'providers' | 'calc'>('shariat');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-sky-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                0% Halol Nasiya
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black border border-emerald-500/30">
                  Fatvo Bor
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Toza foizsiz muddatli to‘lov qoidalari</p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 p-1.5 gap-1">
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('shariat');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'shariat'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shariat Me’yorlari
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('providers');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'providers'
                ? 'bg-sky-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bank Hamkorlari
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('calc');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'calc'
                ? 'bg-indigo-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Muddatlar
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3.5 text-xs">
          {activeTab === 'shariat' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                <h4 className="font-extrabold text-emerald-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Ribo (Sudxo‘rlik) dan butunlay xoli
                </h4>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Guzasht platformasidagi barcha nasiya rejalarida hech qanday yashirin komissiya, ustama foiz yoki kechiktirilgan kunlar uchun penya (jarima) mavjud emas. Shartnoma tuzilgan kundagi narx qat’iy saqlanadi.
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-white text-xs">Asosiy Qoidalar:</h5>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <p className="font-semibold text-sky-400">1. Murabaha & Ijara mexanizmi</p>
                  <p className="text-slate-400 text-[11px]">
                    Sayohat xizmati yoki chipta avval hamkor bank tomonidan to‘liq xarid qilinadi, so‘ngra xaridorga teng oylik bo‘lib to‘lash bilan sotiladi.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <p className="font-semibold text-amber-400">2. Kechiktirilgan to‘lovlar va Penya yo‘qligi</p>
                  <p className="text-slate-400 text-[11px]">
                    Agar mijoz uzrli sabablarga ko‘ra to‘lovni kechiktirsa, unga qo‘shimcha foiz yoki jarima solinmaydi. Bu Islom moliyasi talablariga 100% mos keladi.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                  <p className="font-semibold text-rose-400">3. Shaffof shartnoma</p>
                  <p className="text-slate-400 text-[11px]">
                    Barcha shartlar to‘lovdan oldin to‘liq ko‘rsatiladi. Kutilmagan sug‘urta to‘lovlari yoki yashirin servis haqlari yo‘q.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'providers' && (
            <div className="space-y-3">
              <p className="text-slate-300 text-[11px]">
                Platformamiz O‘zbekiston Respublikasining yetakchi halol moliyaviy tizimlari bilan integratsiya qilingan:
              </p>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 font-black flex items-center justify-center text-sm border border-purple-500/30">
                    UZUM
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Uzum Nasiya</h5>
                    <p className="text-[10px] text-slate-400">3, 6, 12 va 24 oylik muddatli to‘lov</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Ulangan
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center text-sm border border-emerald-500/30">
                    ALIF
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Alif Nasiya</h5>
                    <p className="text-[10px] text-slate-400">Shariat Kengashi sertifikatiga ega</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  Ulangan
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-black flex items-center justify-center text-sm border border-sky-500/30">
                    CARD
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">Humo & Uzcard Avtomatik Jamg‘arma</h5>
                    <p className="text-[10px] text-slate-400">Oylik maoshdan rejalashtirilgan to‘lov</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold">
                  Faol
                </span>
              </div>
            </div>
          )}

          {activeTab === 'calc' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">Qulay muddatlar taqsimoti:</span>
                
                <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">3 Oy</span>
                    <span className="font-black text-sky-400">0% Ustama</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Tezkor sayohatlar uchun</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">6 Oy</span>
                    <span className="font-black text-emerald-400">0% Ustama</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Ommabop optimal reja</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">12 Oy</span>
                    <span className="font-black text-amber-400">0% Ustama</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Umra va uzoq safarlar</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">24 Oy</span>
                    <span className="font-black text-purple-400">Kichik to‘lov</span>
                    <p className="text-[9px] text-slate-400 mt-0.5">Oila va keksalar uchun</p>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 text-[11px] text-sky-200">
                💡 Har bir tur paketi sahifasida 3, 6, 12 va 24 oylik to‘lovlar miqdori real vaqtda hisoblab ko‘rsatiladi.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800">
          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
          >
            Tushundim, Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
