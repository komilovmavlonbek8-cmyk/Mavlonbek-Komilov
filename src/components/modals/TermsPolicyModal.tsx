import React, { useState } from 'react';
import { X, FileText, ShieldCheck, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

interface TermsPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsPolicyModal: React.FC<TermsPolicyModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'refund' | 'terms'>('refund');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0e1626] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Qoidalar & Qaytarish (Refund)</h3>
              <p className="text-[11px] text-slate-400">Rasmiy shartnoma va bekor qilish siyosati</p>
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
              setActiveTab('refund');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'refund'
                ? 'bg-sky-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bekor Qilish (Refund)</span>
          </button>
          <button
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('terms');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'terms'
                ? 'bg-indigo-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ommaviy Oferta</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto no-scrollbar space-y-3.5 text-xs">
          {activeTab === 'refund' && (
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/30 space-y-1.5">
                <h4 className="font-extrabold text-sky-300 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Mablag‘ni qaytarish kafolati
                </h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Har bir sayohat buyurtmasi qonuniy himoyalangan. Rejalaringiz o‘zgargan taqdirda, quyidagi shaffof jadval asosida to‘lovingiz qaytariladi:
                </p>
              </div>

              {/* Refund percentages breakdown */}
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">30 kundan ortiq qolganda</span>
                    <span className="text-[10px] text-slate-400">Parvozdan kamida bir oy oldin bekor qilinsa</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-xs border border-emerald-500/30">
                    100% Qaytarish
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">15 – 30 kun qolganda</span>
                    <span className="text-[10px] text-slate-400">Mehmonxona bandlovi jarimalari chegirilib</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 font-black text-xs border border-sky-500/30">
                    70% Qaytarish
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">7 – 15 kun qolganda</span>
                    <span className="text-[10px] text-slate-400">Aviachipta va vaucher komissiyasi chegirilib</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs border border-amber-500/30">
                    50% Qaytarish
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">7 kundan kam qolganda</span>
                    <span className="text-[10px] text-slate-400">Aviakompaniya qat’iy qoidalariga binoan</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-bold text-xs border border-slate-700">
                    Individual hisob
                  </span>
                </div>
              </div>

              {/* Medical exception */}
              <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-400 text-xs block">
                  🏥 Bemorlik va Favqulodda Holatlar:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Agar sayohatchi yoki uning yaqin qarindoshi to‘satdan betob bo‘lib qolsa (rasmiy tibbiy xulosa taqdim etilganda), sayohat muddati jarimasiz boshqa kunga ko‘chiriladi yoki to‘liq sug‘urta kompensatsiyasi taqdim etiladi.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="font-bold text-white text-xs">Guzasht Platformasi Ommaviy Ofertasi</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  1. <b>Platforma roli:</b> "Guzasht" O‘zbekiston Respublikasi Turizm Qo‘mitasi tomonidan litsenziyalangan turistik agentliklar va sayohatchilarni birlashtiruvchi B2B va B2C raqamli ekotizimidir.
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  2. <b>To‘lovlar xavfsizligi:</b> Barcha elektron to‘lovlar va Halol Nasiya operatsiyalari bank litsenziyasiga ega hamkorlar (Uzum, Alif, Payme) tomonidan himoyalangan.
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  3. <b>QR-kodli Sertifikat:</b> To‘lov amalga oshirilgach berilgan sertifikat rasmiy yuridik kuchga ega va sayyohning barcha huquqlarini kafolatlaydi.
                </p>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  4. <b>Keksalar xavfsizligi:</b> VIP Keksalar turlarida maxsus tibbiy hamshiralar va transferlar xizmati bilan ta’minlash kafolatlanadi.
                </p>
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
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
