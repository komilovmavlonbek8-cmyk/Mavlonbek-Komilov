import React from 'react';
import { X, ShieldAlert, PhoneCall, Building2, HeartHandshake, CheckCircle2 } from 'lucide-react';

interface DemoBadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoBadgeModal: React.FC<DemoBadgeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#131d2e] border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Guzasht DEMO Versiyasi</h3>
            <span className="text-xs text-amber-400 font-medium">
              Turizm qo'mitasi va investorlar ko'rigi uchun
            </span>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Ushbu ilova davlat subsidiyasi va investitsiya dasturi doirasida ishlab chiqilgan prototip (MVP) hisoblanadi. Real ishga tushirish belgilangan reja va shartnomalar asosida amalga oshiriladi.
        </p>

        <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">0% Foizsiz bo‘lib to‘lash:</span>
              <p className="text-slate-400 mt-0.5">Uzum Bank va Alif Bank bilan hamkorlik muzokaralari bosqichida.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <PhoneCall className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">2233 Ishonch raqami (Inklusiv xizmat):</span>
              <p className="text-slate-400 mt-0.5">Keksalar va smartfon ishlatishga qiynaladiganlar uchun telefon orqali to‘liq buyurtma va maslahat.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <HeartHandshake className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">VIP Keksalar va Hamshira hamrohligi:</span>
              <p className="text-slate-400 mt-0.5">Sayohat davomida doimiy tibbiy kuzatuv va shifokor ko‘magi mavjud turlar.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Building2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Ma'lumotlar xavfsizligi:</span>
              <p className="text-slate-400 mt-0.5">Barcha namunaviy ma'lumotlar demo rejimida. Haqiqiy bank kartasi mablag'lari yechilmaydi.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 active:scale-98 transition"
        >
          Tushunarli, davom etish
        </button>
      </div>
    </div>
  );
};
