import React from 'react';
import { PhoneCall, HeartHandshake, ShieldCheck } from 'lucide-react';
import { triggerHaptic } from '../../lib/twa';

export const HotlineBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-500/30 p-4 my-3 shadow-lg">
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
              <HeartHandshake className="w-3 h-3 text-sky-400" />
              Ijtimoiy Missiya
            </span>
            <span className="text-[10px] text-slate-400">Keksalar uchun</span>
          </div>
          <h4 className="text-sm font-bold text-white leading-tight">
            Gadjet bilmaydiganlar uchun telefon orqali buyurtma
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Ota-onangiz yoki yaqinlaringiz uchun bepul maslahat va hamshira hamrohligidagi turlar.
          </p>
        </div>

        <a
          href="tel:2233"
          onClick={() => triggerHaptic('medium')}
          className="shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white font-extrabold shadow-lg shadow-sky-500/30 active:scale-95 transition-all"
        >
          <PhoneCall className="w-5 h-5 mb-0.5 animate-bounce" />
          <span className="text-xs font-black tracking-wider">2233</span>
        </a>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          O‘zbekiston bo‘ylab bepul qo‘ng‘iroq
        </span>
        <span className="text-sky-400 font-medium">24/7 Call-markaz</span>
      </div>
    </div>
  );
};
